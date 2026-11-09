-- MajestiOS CRM — cohérence métier des relations et unicité SIRET.
-- Migration versionnée dans GitHub uniquement : ne pas l'appliquer à Supabase sans autorisation.

create or replace function private.enforce_tenant_relationship_integrity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_related_business_id uuid;
  v_related_org_id uuid;
begin
  if tg_op = 'UPDATE' and new.organization_id is distinct from old.organization_id then
    raise exception 'organization_id is immutable; tenant reassignment is not allowed'
      using errcode = '23514';
  end if;

  if tg_table_name = 'businesses' then
    if new.assigned_to is not null and not exists (
      select 1 from public.organization_members m
      where m.organization_id = new.organization_id and m.user_id = new.assigned_to
    ) then
      raise exception 'assigned_to must be a member of the same organization' using errcode = '23514';
    end if;

  elsif tg_table_name = 'contacts' then
    if new.business_id is not null and not exists (
      select 1 from public.businesses b
      where b.id = new.business_id and b.organization_id = new.organization_id
    ) then
      raise exception 'contact business must belong to the same organization' using errcode = '23514';
    end if;

  elsif tg_table_name = 'opportunities' then
    if new.business_id is not null and not exists (
      select 1 from public.businesses b
      where b.id = new.business_id and b.organization_id = new.organization_id
    ) then
      raise exception 'opportunity business must belong to the same organization' using errcode = '23514';
    end if;

    if new.primary_contact_id is not null then
      select c.organization_id, c.business_id
        into v_related_org_id, v_related_business_id
      from public.contacts c
      where c.id = new.primary_contact_id;

      if not found or v_related_org_id is distinct from new.organization_id then
        raise exception 'opportunity contact must belong to the same organization' using errcode = '23514';
      end if;

      if v_related_business_id is not null
         and new.business_id is not null
         and v_related_business_id is distinct from new.business_id then
        raise exception 'opportunity contact must belong to the opportunity business' using errcode = '23514';
      end if;
    end if;

    if new.assigned_to is not null and not exists (
      select 1 from public.organization_members m
      where m.organization_id = new.organization_id and m.user_id = new.assigned_to
    ) then
      raise exception 'assigned_to must be a member of the same organization' using errcode = '23514';
    end if;

  elsif tg_table_name = 'activities' then
    if new.business_id is not null and not exists (
      select 1 from public.businesses b
      where b.id = new.business_id and b.organization_id = new.organization_id
    ) then
      raise exception 'activity business must belong to the same organization' using errcode = '23514';
    end if;

    if new.contact_id is not null then
      select c.organization_id, c.business_id
        into v_related_org_id, v_related_business_id
      from public.contacts c
      where c.id = new.contact_id;

      if not found or v_related_org_id is distinct from new.organization_id then
        raise exception 'activity contact must belong to the same organization' using errcode = '23514';
      end if;

      if new.business_id is not null
         and v_related_business_id is not null
         and v_related_business_id is distinct from new.business_id then
        raise exception 'activity contact must belong to the activity business' using errcode = '23514';
      end if;
    end if;

    if new.opportunity_id is not null then
      select o.organization_id, o.business_id
        into v_related_org_id, v_related_business_id
      from public.opportunities o
      where o.id = new.opportunity_id;

      if not found or v_related_org_id is distinct from new.organization_id then
        raise exception 'activity opportunity must belong to the same organization' using errcode = '23514';
      end if;

      if new.business_id is not null
         and v_related_business_id is not null
         and v_related_business_id is distinct from new.business_id then
        raise exception 'activity business must match the opportunity business' using errcode = '23514';
      end if;

      if new.contact_id is not null and v_related_business_id is not null then
        select c.business_id into v_related_org_id
        from public.contacts c
        where c.id = new.contact_id;

        if v_related_org_id is not null and v_related_org_id is distinct from v_related_business_id then
          raise exception 'activity contact must match the opportunity business' using errcode = '23514';
        end if;
      end if;
    end if;
  end if;

  return new;
end;
$$;

-- Une vérification préalable explicite évite qu'un index unique échoue sans diagnostic.
do $$
begin
  if exists (
    select 1
    from public.businesses
    where siret is not null
      and regexp_replace(siret, '[^0-9]', '', 'g') <> ''
    group by organization_id, regexp_replace(siret, '[^0-9]', '', 'g')
    having count(*) > 1
  ) then
    raise exception 'Duplicate SIRET values exist within an organization; deduplicate CRM records before applying this migration.';
  end if;
end;
$$;

create unique index if not exists businesses_org_siret_unique
  on public.businesses (organization_id, (regexp_replace(siret, '[^0-9]', '', 'g')))
  where siret is not null
    and regexp_replace(siret, '[^0-9]', '', 'g') <> '';
