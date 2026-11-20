-- Nouveaux types d'annonces : immobilier (offre / recherche) et entreprise (cession / reprise).
-- Étend la règle de la table et la liste contrôlée par submit_announcement et publish_announcement_admin.
-- Retour arrière : remettre les 8 types d'origine (voir 20261116170000_announcements_require_account_and_kinds.sql).
alter table public.announcements drop constraint if exists announcements_kind_check;
alter table public.announcements add constraint announcements_kind_check check (kind in
  ('subcontract_need','subcontract_offer','job_offer','job_seeker','equipment_offer','equipment_wanted','other_offer','other_request',
   'real_estate_offer','real_estate_wanted','business_sale','business_wanted'));

do $$
declare
  d text;
  fn regprocedure;
  old_list constant text := '''other_offer'',''other_request'')';
  new_list constant text := '''other_offer'',''other_request'',''real_estate_offer'',''real_estate_wanted'',''business_sale'',''business_wanted'')';
begin
  foreach fn in array array[
    'public.submit_announcement(text,text,text,text,text,text,date,text,text,text,boolean,text,text)'::regprocedure,
    'public.publish_announcement_admin(text,text,text,text,text,text,date,text,text)'::regprocedure
  ] loop
    d := pg_get_functiondef(fn);
    if position(old_list in d) = 0 then raise exception 'Liste des types introuvable dans %', fn; end if;
    execute replace(d, old_list, new_list);
  end loop;
end $$;
