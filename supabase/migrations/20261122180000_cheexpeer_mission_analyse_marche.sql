-- Cheexpeer — mission n°2 « analyse d'un marché » (lecture seule, autonomie 0, validation humaine obligatoire).
-- Spécification : docs/evolution-12/FICHES-MISSIONS-CHEEXPEER-2026-11-22.md
-- Le type est autorisé à la soumission, mais l'outil reste DÉSACTIVÉ dans le registre : aucune mission de ce type ne peut être
-- réservée tant que le propriétaire n'a pas activé l'outil (fail-closed conservé).

create or replace function private.cheexpeer_submit_mission(
  p_organization_id uuid, p_mission_type text, p_title text, p_created_by uuid default null::uuid,
  p_objective text default null::text, p_priority smallint default 3, p_autonomy_level smallint default 0,
  p_requires_approval boolean default true, p_scheduled_at timestamp with time zone default now(),
  p_deadline_at timestamp with time zone default null::timestamp with time zone,
  p_input jsonb default '{}'::jsonb, p_context jsonb default '{}'::jsonb, p_idempotency_key text default null::text)
returns table(mission_id uuid, mission_status text, was_created boolean)
language plpgsql
set search_path to ''
as $function$
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

  -- Types exécutables : le diagnostic de test et la mission « prospects de sous-traitance », toujours en autonomie 0.
  if p_mission_type not in ('readiness_probe', 'prospects_sous_traitance', 'analyse_marche') or p_autonomy_level <> 0 then
    raise exception 'mission type or autonomy level is not currently supported'
      using errcode = '0A000';
  end if;
  -- La mission de prospects ne se lance jamais sans décision d'un administrateur.
  if p_mission_type in ('prospects_sous_traitance', 'analyse_marche') and not p_requires_approval then
    raise exception 'this mission type always requires human approval'
      using errcode = '0A000';
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
$function$;

insert into private.cheexpeer_tool_registry (
  tool_key, version, display_name, description, input_schema, output_schema,
  autonomy_max, requires_approval, effects, enabled, timeout_seconds, max_cost
)
values (
  'analyse_marche', 1,
  'Analyse d''un appel d''offres',
  'Lit un avis du BOAMP : lots, lieu réel des travaux, codes NAF proposés avec l''extrait de l''avis. Lecture seule : aucun envoi, aucune écriture métier, aucune IA générative.',
  '{"type":"object","additionalProperties":false,"required":["idweb"],"properties":{"idweb":{"type":"string"}}}'::jsonb,
  '{"type":"object","required":["type","lots","propositions","effets_externes"]}'::jsonb,
  0, true, 'read', false, 60, 0
)
on conflict (tool_key, version) do nothing;
