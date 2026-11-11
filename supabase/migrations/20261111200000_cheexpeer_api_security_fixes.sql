-- Cheexpeer — correction additive des contrats de soumission et d'approbation.
-- Préparé sur Evolution-9 uniquement. Ne pas appliquer sans recette SQL contrôlée
-- sur une instance locale puis autorisation explicite pour MajestiOS-Test.

-- L'idempotence est isolée par organisation. Les anciennes lignes sont conservées.
alter table private.cheexpeer_missions
  drop constraint if exists cheexpeer_missions_idempotency_unique;

create unique index if not exists cheexpeer_missions_org_idempotency_unique
  on private.cheexpeer_missions (organization_id, idempotency_key)
  where idempotency_key is not null;

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

  if p_idempotency_key is not null
     and (pg_catalog.length(p_idempotency_key) > 200
       or nullif(pg_catalog.btrim(p_idempotency_key), '') is null) then
    raise exception 'invalid idempotency key' using errcode = '22023';
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
  on conflict (organization_id, idempotency_key)
    where idempotency_key is not null
  do nothing
  returning * into v_mission;

  if not found then
    select m.* into v_mission
    from private.cheexpeer_missions as m
    where m.organization_id = p_organization_id
      and m.idempotency_key = p_idempotency_key
    for share;

    if not found then
      -- Ne révèle aucune information sur une mission d'un autre tenant.
      raise exception 'mission submission could not be completed'
        using errcode = '42501';
    end if;

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

  if p_requires_approval then
    insert into private.cheexpeer_approvals (
      mission_id, requested_from, action_summary, risk_level
    ) values (
      v_mission.id,
      p_created_by,
      pg_catalog.left(coalesce(p_objective, p_title), 2000),
      case
        when p_autonomy_level >= 4 then 'critical'
        when p_autonomy_level = 3 then 'high'
        when p_autonomy_level = 2 then 'medium'
        else 'low'
      end
    );
    insert into private.cheexpeer_mission_events (
      mission_id, event_type, actor_type, actor_id, details
    ) values (
      v_mission.id, 'approval_requested', 'system', 'cheexpeer_api',
      pg_catalog.jsonb_build_object('risk_level',
        case
          when p_autonomy_level >= 4 then 'critical'
          when p_autonomy_level = 3 then 'high'
          when p_autonomy_level = 2 then 'medium'
          else 'low'
        end)
    );
  end if;

  if v_status = 'queued' then
    perform pgmq.send(
      'cheexpeer_missions',
      pg_catalog.jsonb_build_object('kind', 'mission_ready', 'mission_id', v_mission.id)
    );
  end if;

  return query select v_mission.id, v_mission.status, true;
end;
$$;

create or replace function private.cheexpeer_decide_approval(
  p_approval_id uuid,
  p_decision_by uuid,
  p_decision text,
  p_decision_note text default null
)
returns table(approval_status text, mission_status text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_approval private.cheexpeer_approvals%rowtype;
  v_mission private.cheexpeer_missions%rowtype;
  v_next_mission_status text;
begin
  if p_decision not in ('approved', 'rejected') then
    raise exception 'decision must be approved or rejected'
      using errcode = '22023';
  end if;
  if p_decision_by is null then
    raise exception 'decision_by is required'
      using errcode = '22023';
  end if;

  select a.* into v_approval
  from private.cheexpeer_approvals as a
  where a.id = p_approval_id
  for update;

  if not found or v_approval.status <> 'pending' then
    raise exception 'approval not found or no longer pending'
      using errcode = '55000';
  end if;

  select m.* into v_mission
  from private.cheexpeer_missions as m
  where m.id = v_approval.mission_id
  for update;

  if not found or v_mission.status <> 'awaiting_approval' then
    raise exception 'mission is not awaiting approval'
      using errcode = '55000';
  end if;

  if not exists (
    select 1
    from public.organization_members as om
    where om.organization_id = v_mission.organization_id
      and om.user_id = p_decision_by
      and om.role in ('owner', 'admin')
  ) then
    raise exception 'approver is not an owner or admin of this organization'
      using errcode = '42501';
  end if;

  if v_approval.expires_at is not null and v_approval.expires_at <= pg_catalog.now() then
    update private.cheexpeer_approvals
    set status = 'expired',
        decided_at = pg_catalog.now()
    where id = p_approval_id;

    insert into private.cheexpeer_mission_events (
      mission_id, event_type, actor_type, actor_id, details
    ) values (
      v_mission.id, 'approval_expired', 'system', 'cheexpeer_api',
      pg_catalog.jsonb_build_object('approval_id', p_approval_id)
    );

    -- Expiration = résultat métier normal : aucune exception ne doit annuler
    -- la persistance de l'état expired. La mission n'est jamais mise en file.
    return query select 'expired'::text, v_mission.status;
    return;
  end if;

  update private.cheexpeer_approvals
  set status = p_decision,
      decision_by = p_decision_by,
      decision_note = pg_catalog.left(p_decision_note, 2000),
      decided_at = pg_catalog.now()
  where id = p_approval_id;

  v_next_mission_status := case
    when p_decision = 'rejected' then 'blocked'
    when v_mission.scheduled_at > pg_catalog.now() then 'scheduled'
    else 'queued'
  end;

  update private.cheexpeer_missions
  set status = v_next_mission_status,
      finished_at = case when p_decision = 'rejected' then pg_catalog.now() else null end
  where id = v_mission.id;

  insert into private.cheexpeer_mission_events (
    mission_id, event_type, actor_type, actor_id, details
  ) values (
    v_mission.id,
    case when p_decision = 'approved' then 'approval_granted' else 'approval_rejected' end,
    'user', p_decision_by::text,
    pg_catalog.jsonb_build_object(
      'approval_id', p_approval_id,
      'decision_note', pg_catalog.left(p_decision_note, 2000),
      'new_mission_status', v_next_mission_status
    )
  );

  if v_next_mission_status = 'queued' then
    perform pgmq.send(
      'cheexpeer_missions',
      pg_catalog.jsonb_build_object('kind', 'mission_ready', 'mission_id', v_mission.id)
    );
  end if;

  return query select p_decision, v_next_mission_status;
end;
$$;

revoke all on function private.cheexpeer_submit_mission(uuid,text,text,uuid,text,smallint,smallint,boolean,timestamptz,timestamptz,jsonb,jsonb,text) from public, anon, authenticated;
revoke all on function private.cheexpeer_decide_approval(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function private.cheexpeer_submit_mission(uuid,text,text,uuid,text,smallint,smallint,boolean,timestamptz,timestamptz,jsonb,jsonb,text) to service_role;
grant execute on function private.cheexpeer_decide_approval(uuid,uuid,text,text) to service_role;

comment on index private.cheexpeer_missions_org_idempotency_unique is
'Idempotency is scoped to organization; a repeated key cannot reveal another tenant mission.';
comment on function private.cheexpeer_decide_approval(uuid,uuid,text,text) is
'Server-only decision. Expiration is persisted as a normal result and never enqueues the mission.';


-- Lecture tenant-scoped destinée exclusivement à l'API serveur de consultation.
create or replace function public.cheexpeer_api_read_mission(
  p_mission_id uuid,
  p_organization_id uuid
)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select pg_catalog.jsonb_build_object(
    'mission', pg_catalog.jsonb_build_object(
      'id', m.id,
      'organization_id', m.organization_id,
      'mission_type', m.mission_type,
      'title', m.title,
      'objective', m.objective,
      'status', m.status,
      'priority', m.priority,
      'autonomy_level', m.autonomy_level,
      'requires_approval', m.requires_approval,
      'scheduled_at', m.scheduled_at,
      'deadline_at', m.deadline_at,
      'result', m.result,
      'error_code', m.error_code,
      'error_summary', m.error_summary,
      'created_at', m.created_at,
      'updated_at', m.updated_at,
      'started_at', m.started_at,
      'finished_at', m.finished_at
    ),
    'approvals', coalesce((
      select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
        'id', a.id, 'status', a.status, 'action_summary', a.action_summary,
        'risk_level', a.risk_level, 'decision_note', a.decision_note,
        'expires_at', a.expires_at, 'decided_at', a.decided_at,
        'created_at', a.created_at
      ) order by a.created_at)
      from private.cheexpeer_approvals a
      where a.mission_id = m.id
    ), '[]'::jsonb),
    'events', coalesce((
      select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
        'id', e.id, 'event_type', e.event_type, 'actor_type', e.actor_type,
        'actor_id', e.actor_id, 'details', e.details, 'occurred_at', e.occurred_at
      ) order by e.occurred_at, e.id)
      from private.cheexpeer_mission_events e
      where e.mission_id = m.id
    ), '[]'::jsonb)
  )
  from private.cheexpeer_missions m
  where m.id = p_mission_id
    and m.organization_id = p_organization_id;
$$;

revoke all on function public.cheexpeer_api_read_mission(uuid,uuid) from public, anon, authenticated;
grant execute on function public.cheexpeer_api_read_mission(uuid,uuid) to service_role;

comment on function public.cheexpeer_api_read_mission(uuid,uuid) is
'Server-only tenant-scoped mission read; returns a bounded field allowlist for the authenticated organization API.';


-- Façades PostgREST publiques, mais strictement réservées au service_role.
-- Les handlers Edge sont les seuls consommateurs autorisés.
create or replace function public.cheexpeer_api_submit_mission(
  p_organization_id uuid,
  p_mission_type text,
  p_title text,
  p_created_by uuid,
  p_objective text,
  p_priority smallint,
  p_autonomy_level smallint,
  p_requires_approval boolean,
  p_scheduled_at timestamptz,
  p_deadline_at timestamptz,
  p_input jsonb,
  p_context jsonb,
  p_idempotency_key text
)
returns table(mission_id uuid, mission_status text, was_created boolean)
language sql
security invoker
set search_path = ''
as $$
  select * from private.cheexpeer_submit_mission(
    p_organization_id, p_mission_type, p_title, p_created_by, p_objective,
    p_priority, p_autonomy_level, p_requires_approval, p_scheduled_at,
    p_deadline_at, p_input, p_context, p_idempotency_key
  );
$$;

create or replace function public.cheexpeer_api_decide_approval(
  p_organization_id uuid,
  p_approval_id uuid,
  p_decision_by uuid,
  p_decision text,
  p_decision_note text
)
returns table(approval_status text, mission_status text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_mission_id uuid;
begin
  if p_organization_id is null or p_approval_id is null then
    raise exception 'organization_id and approval_id are required'
      using errcode = '22023';
  end if;

  -- L'organisation fournie par le client doit correspondre à celle de
  -- l'approbation elle-même, avant toute décision ou révélation d'état.
  select a.mission_id into v_mission_id
  from private.cheexpeer_approvals a
  join private.cheexpeer_missions m on m.id = a.mission_id
  where a.id = p_approval_id
    and m.organization_id = p_organization_id;

  if not found then
    raise exception 'approval not found'
      using errcode = '42501';
  end if;

  return query
    select * from private.cheexpeer_decide_approval(
      p_approval_id, p_decision_by, p_decision, p_decision_note
    );
end;
$$;

revoke all on function public.cheexpeer_api_submit_mission(uuid,text,text,uuid,text,smallint,smallint,boolean,timestamptz,timestamptz,jsonb,jsonb,text) from public, anon, authenticated;
revoke all on function public.cheexpeer_api_decide_approval(uuid,uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.cheexpeer_api_submit_mission(uuid,text,text,uuid,text,smallint,smallint,boolean,timestamptz,timestamptz,jsonb,jsonb,text) to service_role;
grant execute on function public.cheexpeer_api_decide_approval(uuid,uuid,uuid,text,text) to service_role;
