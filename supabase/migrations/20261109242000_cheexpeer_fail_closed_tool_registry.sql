-- Cheexpeer — fail closed for missions without an enabled tool executor.
-- The only exception is the inert autonomy-0 readiness probe used for tests.
CREATE OR REPLACE FUNCTION private.cheexpeer_claim_next_mission(p_worker_id text, p_lease_seconds integer DEFAULT 120)
 RETURNS TABLE(mission_id uuid, organization_id uuid, mission_type text, title text, objective text, mission_input jsonb, mission_context jsonb, priority smallint, autonomy_level smallint, attempt_count smallint, deadline_at timestamp with time zone, lease_expires_at timestamp with time zone)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
    and (
      (m.mission_type = 'readiness_probe' and m.autonomy_level = 0)
      or exists (
        select 1
        from private.cheexpeer_tool_registry as t
        where t.tool_key = m.mission_type
          and t.enabled = true
          and m.autonomy_level <= t.autonomy_max
          and (
            not (m.requires_approval or t.requires_approval)
            or exists (
              select 1 from private.cheexpeer_approvals as a
              where a.mission_id = m.id and a.status = 'approved'
            )
          )
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
$function$;

comment on function private.cheexpeer_claim_next_mission(text,integer) is
'Claims only approved missions whose executor is explicitly enabled in the tool registry, except inert autonomy-0 readiness_probe tests. Uses row locks and bounded leases.';
