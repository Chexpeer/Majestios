-- Alertes « marché gagné » : un titulaire d'espace enregistre jusqu'à 5 recherches (département, famille d'achats, montant, mot-clé)
-- et voit les nouveaux marchés attribués depuis sa dernière consultation. Chaque membre ne voit et ne modifie que ses propres alertes.
-- Retour arrière : drop table public.contract_alerts cascade ; drop function private.contract_alerts_cap.

create table if not exists public.contract_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 120),
  department text check (department is null or department ~ '^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$'),
  cpv text check (cpv is null or cpv ~ '^[0-9]{2}$'),
  query text check (query is null or char_length(query) between 3 and 80),
  min_amount numeric check (min_amount is null or (min_amount > 0 and min_amount <= 1e10)),
  last_seen_on date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists contract_alerts_user_idx on public.contract_alerts (user_id, created_at);
alter table public.contract_alerts enable row level security;
revoke all on public.contract_alerts from public, anon, authenticated;
grant select, insert, update, delete on public.contract_alerts to authenticated;

drop policy if exists contract_alerts_select on public.contract_alerts;
drop policy if exists contract_alerts_insert on public.contract_alerts;
drop policy if exists contract_alerts_update on public.contract_alerts;
drop policy if exists contract_alerts_delete on public.contract_alerts;
create policy contract_alerts_select on public.contract_alerts for select to authenticated using (user_id = (select auth.uid()));
create policy contract_alerts_insert on public.contract_alerts for insert to authenticated with check (user_id = (select auth.uid()));
create policy contract_alerts_update on public.contract_alerts for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy contract_alerts_delete on public.contract_alerts for delete to authenticated using (user_id = (select auth.uid()));

-- Au plus 5 alertes par membre.
create or replace function private.contract_alerts_cap()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.contract_alerts a where a.user_id = new.user_id) >= 5 then
    raise exception 'alert_limit_reached' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke all on function private.contract_alerts_cap() from public, anon, authenticated;
drop trigger if exists contract_alerts_cap on public.contract_alerts;
create trigger contract_alerts_cap before insert on public.contract_alerts for each row execute function private.contract_alerts_cap();
