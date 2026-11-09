-- Cheexpeer — dispatcher, claims, leases and mission lifecycle.
-- Applied only to MajestiOS-Test during the Cheexpeer execution-engine build.
-- The database remains the source of truth; PGMQ carries wake-up messages only.

create or replace function private.cheexpeer_submit_mission(
  p_organization_id uuid,
  p_mission_type text,
  p_title text,
  p_created_by uuid default null,
  p_objective text default null,
  p_priority smallint default 3,
  p_autonomy_level smallint default 0,
  p_requires_approval boolean default true,
  p_scheduled_at timestamptz default now(),
  p_deadline_at timestamptz default null,
  p_input jsonb default '{}'::jsonb,
  p_context jsonb default '{}'::jsonb,
  p_idempotency_key text default null
)
returns table(mission_id uuid, mission_status text, was_created boolean)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_mission private.cheexpeer_missions%rowtype;
  v_status text;
begin
  if p_organization_id is null
     or nullif(pg_catalog.btrim(p_mission_type), '') is null
     or nullif(pg_catalog.btrim(p_title), '') is null then
    raise exception 'organization_id, mission_type and title are required'
      using errcode = '22023';
  end if;

  if p_priority not between 1 and 5 or p_autonomy_level not between 0 and 4 then
    raise exception 'priority or autonomy_level outside allowed range'
      using errcode = '22023';
  end if;

  if p_scheduled_at is null then
    raise exception 'scheduled_at is required' using errcode = '22023';
  end if;

  v_status := case
    when p_requires_approval then 'awaiting_approval'
    when p_scheduled_at > pg_catalog.now() then 'scheduled'
    else 'queued'
  end;

  insert into private.cheexpeer_missions (
    organization_id, created_by, mission_type, title, objective,
    status, priority, autonomy_level, requires_approval,
    scheduled_at, deadline_at, input, context, idempotency_key
  )
  values (
    p_organization_id, p_created_by, pg_catalog.btrim(p_mission_type),
    pg_catalog.btrim(p_title), p_objective, v_status, p_priority,
    p_autonomy_level, p_requires_approval, p_scheduled_at,
    p_deadline_at, coalesce(p_input, '{}'::jsonb),
    coalesce(p_context, '{}'::jsonb), p_idempotency_key
  )
  on conflict (idempotency_key) do nothing
  returning * into v_mission;

  if not found then
    if p_idempotency_key is null then
      raise exception 'mission insert conflict without idempotency key'
        using errcode = '23505';
    end if;
    select m.* into v_mission
    from private.cheexpeer_missions as m
    where m.idempotency_key = p_idempotency_key;
    return query select v_mission.id, v_mission.status, false;
    return;
  end if;

  insert into private.cheexpeer_mission_events (
    mission_id, event_type, actor_type, actor_id, details
  ) values (
    v_mission.id, 'mission_submitted', 'system', 'cheexpeer_api',
    pg_catalog.jsonb_build_object(
      'initial_status', v_status,
      'priority', p_priority,
      'autonomy_level', p_autonomy_level,
      'requires_approval', p_requires_approval
    )
  );

  if v_status = 'queued' then
    perform pgmq.send(
      'cheexpeer_missions',
      pg_catalog.jsonb_build_object('kind', 'mission_ready', 'mission_id', v_mission.id)
    );
  end if;

  return query select v_mission.id, v_mission.status, true;
end;
$$;

create or replace function private.cheexpeer_dispatch_due_missions(
  p_limit integer default 100
)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count integer := 0;
begin
  if p_limit < 1 or p_limit > 1000 then
    raise exception 'limit must be between 1 and 1000' using errcode = '22023';
  end if;

  with due as (
    select m.id
    from private.cheexpeer_missions as m
    where m.status in ('scheduled', 'retry_wait')
      and m.scheduled_at <= pg_catalog.now()
      and (m.deadline_at is null or m.deadline_at > pg_catalog.now())
    order by m.priority desc, m.deadline_at asc nulls last,
             m.scheduled_at asc, m.created_at asc
    for update skip locked
    limit p_limit
  ), promoted as (
    update private.cheexpeer_missions as m
    set status = 'queued'
    from due
    where m.id = due.id
    returning m.id, m.priority, m.deadline_at
  ), logged as (
    insert into private.cheexpeer_mission_events (
      mission_id, event_type, actor_type, actor_id, details
    )
    select p.id, 'mission_promoted_to_queue', 'system', 'dispatcher',
           pg_catalog.jsonb_build_object('priority', p.priority, 'deadline_at', p.deadline_at)
    from promoted as p
    returning mission_id
  )
  select pg_catalog.count(*)::integer into v_count from logged;

  if v_count > 0 then
    perform pgmq.send(
      'cheexpeer_missions',
      pg_catalog.jsonb_build_object('kind', 'dispatch_wakeup', 'promoted_count', v_count)
    );
  end if;

  return v_count;
end;
$$;

create or replace function private.cheexpeer_claim_next_mission(
  p_worker_id text,
  p_lease_seconds integer default 120
)
returns table(
  mission_id uuid,
  organization_id uuid,
  mission_type text,
  title text,
  objective text,
  mission_input jsonb,
  mission_context jsonb,
  priority smallint,
  autonomy_level smallint,
  attempt_count smallint,
  deadline_at timestamptz,
  lease_expires_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_m private.cheexpeer_missions%rowtype;
begin
  if nullif(pg_catalog.btrim(p_worker_id), '') is null then
    raise exception 'worker_id is required' using errcode = '22023';
  end if;
  if p_lease_seconds < 15 or p_lease_seconds > 3600 then
    raise exception 'lease must be between 15 and 3600 seconds'
      using errcode = '22023';
  end if;

  with expired as (
    update private.cheexpeer_missions as m
    set status = case
          when m.attempt_count >= m.max_attempts
            or (m.deadline_at is not null and m.deadline_at <= pg_catalog.now())
          then 'failed'
          else 'retry_wait'
        end,
        scheduled_at = pg_catalog.now(),
        lease_owner = null,
        lease_expires_at = null,
        finished_at = case
          when m.attempt_count >= m.max_attempts
            or (m.deadline_at is not null and m.deadline_at <= pg_catalog.now())
          then pg_catalog.now()
          else null
        end,
        error_code = 'WORKER_LEASE_EXPIRED',
        error_summary = 'Worker lease expired before the mission was completed'
    where m.status = 'running'
      and m.lease_expires_at <= pg_catalog.now()
    returning m.id, m.status, m.attempt_count
  )
  insert into private.cheexpeer_mission_events (
    mission_id, event_type, actor_type, actor_id, details
  )
  select e.id, 'worker_lease_expired', 'system', 'dispatcher',
         pg_catalog.jsonb_build_object('new_status', e.status, 'attempt_count', e.attempt_count)
  from expired as e;

  select m.* into v_m
  from private.cheexpeer_missions as m
  where m.status = 'queued'
    and (m.deadline_at is null or m.deadline_at > pg_catalog.now())
    and (
      not m.requires_approval
      or exists (
        select 1 from private.cheexpeer_approvals as a
        where a.mission_id = m.id and a.status = 'approved'
      )
    )
  order by m.priority desc, m.deadline_at asc nulls last,
           m.scheduled_at asc, m.created_at asc
  for update skip locked
  limit 1;

  if not found then
    return;
  end if;

  update private.cheexpeer_missions as m
  set status = 'running',
      attempt_count = m.attempt_count + 1,
      lease_owner = pg_catalog.btrim(p_worker_id),
      lease_expires_at = pg_catalog.now() + pg_catalog.make_interval(secs => p_lease_seconds),
      started_at = coalesce(m.started_at, pg_catalog.now()),
      finished_at = null
  where m.id = v_m.id
  returning m.* into v_m;

  insert into private.cheexpeer_mission_events (
    mission_id, event_type, actor_type, actor_id, details
  ) values (
    v_m.id, 'mission_claimed', 'worker', pg_catalog.btrim(p_worker_id),
    pg_catalog.jsonb_build_object(
      'attempt_count', v_m.attempt_count,
      'lease_expires_at', v_m.lease_expires_at,
      'priority', v_m.priority
    )
  );

  return query select
    v_m.id, v_m.organization_id, v_m.mission_type, v_m.title,
    v_m.objective, v_m.input, v_m.context, v_m.priority,
    v_m.autonomy_level, v_m.attempt_count, v_m.deadline_at,
    v_m.lease_expires_at;
end;
$$;

create or replace function private.cheexpeer_renew_mission_lease(
  p_mission_id uuid,
  p_worker_id text,
  p_lease_seconds integer default 120
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_expiry timestamptz;
begin
  if p_lease_seconds < 15 or p_lease_seconds > 3600 then
    raise exception 'lease must be between 15 and 3600 seconds'
      using errcode = '22023';
  end if;

  update private.cheexpeer_missions as m
  set lease_expires_at = pg_catalog.now() + pg_catalog.make_interval(secs => p_lease_seconds)
  where m.id = p_mission_id
    and m.status = 'running'
    and m.lease_owner = p_worker_id
    and m.lease_expires_at > pg_catalog.now()
  returning m.lease_expires_at into v_expiry;

  if not found then
    return false;
  end if;

  insert into private.cheexpeer_mission_events (
    mission_id, event_type, actor_type, actor_id, details
  ) values (
    p_mission_id, 'mission_lease_renewed', 'worker', p_worker_id,
    pg_catalog.jsonb_build_object('lease_expires_at', v_expiry)
  );

  return true;
end;
$$;

create or replace function private.cheexpeer_complete_mission(
  p_mission_id uuid,
  p_worker_id text,
  p_result jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update private.cheexpeer_missions as m
  set status = 'succeeded',
      result = coalesce(p_result, '{}'::jsonb),
      lease_owner = null,
      lease_expires_at = null,
      finished_at = pg_catalog.now(),
      error_code = null,
      error_summary = null
  where m.id = p_mission_id
    and m.status = 'running'
    and m.lease_owner = p_worker_id
    and m.lease_expires_at > pg_catalog.now();

  if not found then
    return false;
  end if;

  insert into private.cheexpeer_mission_events (
    mission_id, event_type, actor_type, actor_id, details
  ) values (
    p_mission_id, 'mission_succeeded', 'worker', p_worker_id,
    pg_catalog.jsonb_build_object('result', coalesce(p_result, '{}'::jsonb))
  );

  return true;
end;
$$;

create or replace function private.cheexpeer_fail_mission(
  p_mission_id uuid,
  p_worker_id text,
  p_error_code text,
  p_error_summary text,
  p_retry_delay_seconds integer default 60
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_status text;
  v_attempt smallint;
  v_max_attempts smallint;
  v_deadline timestamptz;
begin
  if p_retry_delay_seconds < 5 or p_retry_delay_seconds > 86400 then
    raise exception 'retry delay must be between 5 and 86400 seconds'
      using errcode = '22023';
  end if;

  update private.cheexpeer_missions as m
  set status = case
        when m.attempt_count < m.max_attempts
          and (m.deadline_at is null or m.deadline_at > pg_catalog.now())
        then 'retry_wait'
        else 'failed'
      end,
      scheduled_at = case
        when m.attempt_count < m.max_attempts
          and (m.deadline_at is null or m.deadline_at > pg_catalog.now())
        then pg_catalog.now() + pg_catalog.make_interval(secs => p_retry_delay_seconds)
        else m.scheduled_at
      end,
      lease_owner = null,
      lease_expires_at = null,
      finished_at = case
        when m.attempt_count < m.max_attempts
          and (m.deadline_at is null or m.deadline_at > pg_catalog.now())
        then null
        else pg_catalog.now()
      end,
      error_code = left(coalesce(p_error_code, 'MISSION_FAILED'), 120),
      error_summary = left(coalesce(p_error_summary, 'Mission failed'), 2000)
  where m.id = p_mission_id
    and m.status = 'running'
    and m.lease_owner = p_worker_id
    and m.lease_expires_at > pg_catalog.now()
  returning m.status, m.attempt_count, m.max_attempts, m.deadline_at
  into v_status, v_attempt, v_max_attempts, v_deadline;

  if not found then
    return null;
  end if;

  insert into private.cheexpeer_mission_events (
    mission_id, event_type, actor_type, actor_id, details
  ) values (
    p_mission_id, case when v_status = 'retry_wait' then 'mission_retry_scheduled' else 'mission_failed' end,
    'worker', p_worker_id,
    pg_catalog.jsonb_build_object(
      'status', v_status,
      'attempt_count', v_attempt,
      'max_attempts', v_max_attempts,
      'retry_delay_seconds', case when v_status = 'retry_wait' then p_retry_delay_seconds else null end,
      'deadline_at', v_deadline,
      'error_code', left(coalesce(p_error_code, 'MISSION_FAILED'), 120),
      'error_summary', left(coalesce(p_error_summary, 'Mission failed'), 2000)
    )
  );

  return v_status;
end;
$$;

revoke all on function private.cheexpeer_submit_mission(uuid,text,text,uuid,text,smallint,smallint,boolean,timestamptz,timestamptz,jsonb,jsonb,text) from public, anon, authenticated;
revoke all on function private.cheexpeer_dispatch_due_missions(integer) from public, anon, authenticated;
revoke all on function private.cheexpeer_claim_next_mission(text,integer) from public, anon, authenticated;
revoke all on function private.cheexpeer_renew_mission_lease(uuid,text,integer) from public, anon, authenticated;
revoke all on function private.cheexpeer_complete_mission(uuid,text,jsonb) from public, anon, authenticated;
revoke all on function private.cheexpeer_fail_mission(uuid,text,text,text,integer) from public, anon, authenticated;

grant execute on function private.cheexpeer_submit_mission(uuid,text,text,uuid,text,smallint,smallint,boolean,timestamptz,timestamptz,jsonb,jsonb,text) to service_role;
grant execute on function private.cheexpeer_dispatch_due_missions(integer) to service_role;
grant execute on function private.cheexpeer_claim_next_mission(text,integer) to service_role;
grant execute on function private.cheexpeer_renew_mission_lease(uuid,text,integer) to service_role;
grant execute on function private.cheexpeer_complete_mission(uuid,text,jsonb) to service_role;
grant execute on function private.cheexpeer_fail_mission(uuid,text,text,text,integer) to service_role;

comment on function private.cheexpeer_claim_next_mission(text,integer) is
'Claims the highest-priority eligible mission using row locks and a bounded lease. Only service_role may execute.';
comment on function private.cheexpeer_dispatch_due_missions(integer) is
'Promotes due scheduled/retry missions and emits a PGMQ wake-up. Priority is enforced by the database claim function, not FIFO.';
