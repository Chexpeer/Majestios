-- Aligner le RPC de traitement des relances sur la frontière VIP du CRM.
-- La migration 20261108181246_vip_only_crm_access.sql a restreint les politiques
-- des tables aux rôles owner/admin, mais le RPC SECURITY DEFINER historique
-- utilisait encore private.is_org_editor(), qui accepte aussi le rôle member.
-- Migration versionnée dans GitHub uniquement : ne pas l'appliquer sans autorisation.

create or replace function public.complete_crm_reminder(p_reminder_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_reminder public.crm_reminders%rowtype;
  v_opportunity public.opportunities%rowtype;
  v_activity_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.';
  end if;

  select r.* into v_reminder
    from public.crm_reminders r
   where r.id = p_reminder_id
   for update;

  if not found then
    raise exception 'Relance introuvable.';
  end if;

  -- Même règle que les politiques VIP appliquées aux tables CRM :
  -- owner/admin uniquement, y compris pour un appel RPC direct.
  if not (select private.is_org_admin(v_reminder.organization_id)) then
    raise exception 'Droits insuffisants pour traiter cette relance.';
  end if;

  if v_reminder.state <> 'pending' then
    raise exception 'Cette relance a déjà été traitée ou annulée.';
  end if;

  select o.* into v_opportunity
    from public.opportunities o
   where o.id = v_reminder.opportunity_id
     and o.organization_id = v_reminder.organization_id;

  if not found then
    raise exception 'Opportunité associée introuvable.';
  end if;

  update public.crm_reminders
     set state = 'read', read_at = now()
   where id = v_reminder.id;

  insert into public.activities (
    organization_id, opportunity_id, business_id, actor_user_id,
    activity_type, subject, body, metadata
  ) values (
    v_reminder.organization_id,
    v_reminder.opportunity_id,
    v_opportunity.business_id,
    v_user_id,
    'task',
    'Relance commerciale traitée : ' || v_reminder.title,
    v_reminder.action,
    jsonb_build_object(
      'source', 'crm_reminder',
      'reminder_id', v_reminder.id,
      'due_at', v_reminder.due_at,
      'completed_at', now()
    )
  ) returning id into v_activity_id;

  return v_activity_id;
end;
$$;

revoke all on function public.complete_crm_reminder(uuid) from public, anon;
grant execute on function public.complete_crm_reminder(uuid) to authenticated;

comment on function public.complete_crm_reminder(uuid) is
'Traite une relance CRM et écrit atomiquement une activité ; accès owner/admin aligné sur la frontière VIP du CRM.';
