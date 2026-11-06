create or replace function private.enforce_tenant_relationship_integrity()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if tg_op='UPDATE' and new.organization_id is distinct from old.organization_id then
  raise exception 'organization_id is immutable; tenant reassignment is not allowed' using errcode='23514';
 end if;
 if tg_table_name='businesses' then
  if new.assigned_to is not null and not exists(select 1 from public.organization_members m where m.organization_id=new.organization_id and m.user_id=new.assigned_to) then
   raise exception 'assigned_to must be a member of the same organization' using errcode='23514';
  end if;
 elsif tg_table_name='contacts' then
  if new.business_id is not null and not exists(select 1 from public.businesses b where b.id=new.business_id and b.organization_id=new.organization_id) then
   raise exception 'contact business must belong to the same organization' using errcode='23514';
  end if;
 elsif tg_table_name='opportunities' then
  if new.business_id is not null and not exists(select 1 from public.businesses b where b.id=new.business_id and b.organization_id=new.organization_id) then
   raise exception 'opportunity business must belong to the same organization' using errcode='23514';
  end if;
  if new.primary_contact_id is not null and not exists(select 1 from public.contacts c where c.id=new.primary_contact_id and c.organization_id=new.organization_id) then
   raise exception 'opportunity contact must belong to the same organization' using errcode='23514';
  end if;
  if new.assigned_to is not null and not exists(select 1 from public.organization_members m where m.organization_id=new.organization_id and m.user_id=new.assigned_to) then
   raise exception 'assigned_to must be a member of the same organization' using errcode='23514';
  end if;
 elsif tg_table_name='activities' then
  if new.business_id is not null and not exists(select 1 from public.businesses b where b.id=new.business_id and b.organization_id=new.organization_id) then
   raise exception 'activity business must belong to the same organization' using errcode='23514';
  end if;
  if new.contact_id is not null and not exists(select 1 from public.contacts c where c.id=new.contact_id and c.organization_id=new.organization_id) then
   raise exception 'activity contact must belong to the same organization' using errcode='23514';
  end if;
  if new.opportunity_id is not null and not exists(select 1 from public.opportunities o where o.id=new.opportunity_id and o.organization_id=new.organization_id) then
   raise exception 'activity opportunity must belong to the same organization' using errcode='23514';
  end if;
 end if;
 return new;
end;
$$;
revoke all on function private.enforce_tenant_relationship_integrity() from public,anon,authenticated;
create trigger businesses_tenant_integrity before insert or update on public.businesses for each row execute function private.enforce_tenant_relationship_integrity();
create trigger contacts_tenant_integrity before insert or update on public.contacts for each row execute function private.enforce_tenant_relationship_integrity();
create trigger opportunities_tenant_integrity before insert or update on public.opportunities for each row execute function private.enforce_tenant_relationship_integrity();
create trigger activities_tenant_integrity before insert or update on public.activities for each row execute function private.enforce_tenant_relationship_integrity();
