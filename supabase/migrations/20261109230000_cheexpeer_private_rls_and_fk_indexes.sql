-- Cheexpeer — durcissement post-installation MajestiOS-Test.
-- Les tables privées restent interdites aux rôles navigateur ; service_role
-- conserve l'accès serveur prévu. Index de couverture des clés étrangères.

do $$
declare
  t text;
begin
  foreach t in array array[
    'cheexpeer_missions',
    'cheexpeer_mission_steps',
    'cheexpeer_mission_events',
    'cheexpeer_approvals',
    'cheexpeer_tool_registry',
    'cheexpeer_schedules'
  ] loop
    execute format('drop policy if exists %I on private.%I', t || '_deny_browser', t);
    execute format(
      'create policy %I on private.%I for all to anon, authenticated using (false) with check (false)',
      t || '_deny_browser', t
    );
  end loop;
end $$;

create index if not exists cheexpeer_missions_created_by_idx
  on private.cheexpeer_missions (created_by);
create index if not exists cheexpeer_steps_dependency_idx
  on private.cheexpeer_mission_steps (mission_id, depends_on_step_id);
create index if not exists cheexpeer_events_step_idx
  on private.cheexpeer_mission_events (mission_id, step_id);
create index if not exists cheexpeer_approvals_mission_idx
  on private.cheexpeer_approvals (mission_id);
create index if not exists cheexpeer_approvals_step_idx
  on private.cheexpeer_approvals (mission_id, step_id);
create index if not exists cheexpeer_approvals_requested_from_idx
  on private.cheexpeer_approvals (requested_from);
create index if not exists cheexpeer_approvals_decision_by_idx
  on private.cheexpeer_approvals (decision_by);
create index if not exists cheexpeer_schedules_created_by_idx
  on private.cheexpeer_schedules (created_by);
create index if not exists reputation_audit_usage_user_idx
  on private.reputation_audit_usage (user_id);

comment on policy cheexpeer_missions_deny_browser on private.cheexpeer_missions is
'Accès navigateur explicitement interdit ; seules les fonctions serveur autorisées manipulent les missions.';
