-- Journaliser les créations et modifications CRM dans la même transaction.
-- Le trigger s'applique aussi aux imports et écritures hors interface navigateur.
-- Migration versionnée dans GitHub uniquement : ne pas l'appliquer à Supabase sans autorisation.

create or replace function public.record_crm_activity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_new jsonb;
  v_old jsonb;
  v_changed_fields text[];
  v_activity_type text;
  v_subject text;
  v_body text;
  v_business_id uuid;
  v_contact_id uuid;
  v_opportunity_id uuid;
  v_entity_id uuid;
  v_entity_type text := tg_table_name;
  v_previous_status text;
  v_new_status text;
  v_actor_user_id uuid := auth.uid();
begin
  v_new := to_jsonb(new);

  if tg_op = 'INSERT' then
    v_activity_type := 'system';
    v_body := 'Fiche créée dans le CRM.';
    v_entity_id := new.id;

    if tg_table_name = 'businesses' then
      v_business_id := new.id;
      v_subject := 'Entreprise créée : ' || new.legal_name;
      v_new_status := new.qualification_status;
    elsif tg_table_name = 'contacts' then
      v_business_id := new.business_id;
      v_contact_id := new.id;
      v_subject := 'Contact créé : ' || concat_ws(' ', new.first_name, new.last_name);
    elsif tg_table_name = 'opportunities' then
      v_business_id := new.business_id;
      v_contact_id := new.primary_contact_id;
      v_opportunity_id := new.id;
      v_subject := 'Opportunité créée : ' || new.title;
      v_new_status := new.status;
    else
      raise exception 'Table CRM non prise en charge pour la traçabilité.';
    end if;

    insert into public.activities (
      organization_id, business_id, contact_id, opportunity_id,
      actor_user_id, activity_type, subject, body, metadata
    ) values (
      new.organization_id, v_business_id, v_contact_id, v_opportunity_id,
      v_actor_user_id, v_activity_type, v_subject, v_body,
      jsonb_build_object(
        'event', 'created',
        'entity_type', v_entity_type,
        'entity_id', v_entity_id,
        'new_status', v_new_status
      )
    );
    return new;
  end if;

  v_old := to_jsonb(old) - 'updated_at';
  v_new := v_new - 'updated_at';
  select coalesce(array_agg(item.key order by item.key), array[]::text[])
    into v_changed_fields
    from jsonb_each(v_new) as item
   where v_old -> item.key is distinct from item.value;

  if cardinality(v_changed_fields) = 0 then
    return new;
  end if;

  v_entity_id := new.id;
  if tg_table_name = 'businesses' then
    v_business_id := new.id;
    v_previous_status := old.qualification_status;
    v_new_status := new.qualification_status;
    v_activity_type := 'qualification';
    v_subject := 'Qualification mise à jour : ' || new.legal_name;
  elsif tg_table_name = 'contacts' then
    v_business_id := new.business_id;
    v_contact_id := new.id;
    v_activity_type := 'note';
    v_subject := 'Fiche contact modifiée : ' || concat_ws(' ', new.first_name, new.last_name);
  elsif tg_table_name = 'opportunities' then
    v_business_id := new.business_id;
    v_contact_id := new.primary_contact_id;
    v_opportunity_id := new.id;
    v_previous_status := old.status;
    v_new_status := new.status;
    v_activity_type := case when old.status is distinct from new.status then 'status_change' else 'qualification' end;
    v_subject := case
      when old.status is distinct from new.status then 'Étape commerciale modifiée : ' || new.title
      else 'Qualification mise à jour : ' || new.title
    end;
  else
    raise exception 'Table CRM non prise en charge pour la traçabilité.';
  end if;

  if tg_table_name = 'opportunities' and old.status is distinct from new.status then
    v_body := 'Étape précédente : ' || coalesce(old.status, 'non définie')
      || ' · Nouvelle étape : ' || coalesce(new.status, 'non définie');
  else
    v_body := 'Champs modifiés : ' || array_to_string(v_changed_fields, ', ');
  end if;

  insert into public.activities (
    organization_id, business_id, contact_id, opportunity_id,
    actor_user_id, activity_type, subject, body, metadata
  ) values (
    new.organization_id, v_business_id, v_contact_id, v_opportunity_id,
    v_actor_user_id, v_activity_type, v_subject, v_body,
    jsonb_build_object(
      'event', 'updated',
      'entity_type', v_entity_type,
      'entity_id', v_entity_id,
      'changed_fields', to_jsonb(v_changed_fields),
      'previous_status', v_previous_status,
      'new_status', v_new_status
    )
  );

  return new;
end;
$$;

revoke all on function public.record_crm_activity() from public, anon;
grant execute on function public.record_crm_activity() to authenticated, service_role;

drop trigger if exists businesses_record_crm_activity on public.businesses;
create trigger businesses_record_crm_activity
  after insert or update on public.businesses
  for each row execute function public.record_crm_activity();

drop trigger if exists contacts_record_crm_activity on public.contacts;
create trigger contacts_record_crm_activity
  after insert or update on public.contacts
  for each row execute function public.record_crm_activity();

drop trigger if exists opportunities_record_crm_activity on public.opportunities;
create trigger opportunities_record_crm_activity
  after insert or update on public.opportunities
  for each row execute function public.record_crm_activity();

comment on function public.record_crm_activity() is
'Ajoute une activité d’historique pour chaque création ou modification effective d’une fiche CRM, dans la transaction de la fiche.';
