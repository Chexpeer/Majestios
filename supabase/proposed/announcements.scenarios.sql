-- Scénarios de sécurité de la proposition « annonces » (à jouer sur une base de test après stub auth/rôles).
-- Chaque bloc échoue bruyamment si le comportement attendu n'est pas obtenu.
\set ON_ERROR_STOP on
create or replace function pg_temp.expect_error(p_sql text, p_fragment text) returns void language plpgsql as $$
begin
  begin execute p_sql; exception when others then
    if sqlerrm like '%' || p_fragment || '%' then return; end if;
    raise exception 'erreur inattendue pour [%] : %', p_sql, sqlerrm;
  end;
  raise exception 'aucune erreur pour [%] (attendu : %)', p_sql, p_fragment;
end $$;
grant execute on function pg_temp.expect_error(text, text) to public;

select set_config('request.headers', '{"x-forwarded-for":"203.0.113.7"}', false);
set role anon;

-- 1. Aucun accès direct pour un visiteur
select pg_temp.expect_error('select * from public.announcements', 'permission denied');
select pg_temp.expect_error('select * from private.announcement_contacts', 'permission denied');
select pg_temp.expect_error('insert into public.announcements(kind,title,description,trade,consent_notice_version,submitter_hash) values (''subcontract_need'',''abcdefgh'',''x'',''y'',''v'',''h'')', 'permission denied');

-- 2. Dépôt valide
create temp table t_ref(ref text);
grant all on t_ref to public;
insert into t_ref select public.submit_announcement('subcontract_need','Cherche plaquiste Rennes','Chantier de 12 logements neufs à Rennes, 600 m² de cloisons à poser en mars. Fourniture par nos soins.','Plâtrerie','35','Rennes et agglomération',current_date+30,'Jean Martin','jean@example.fr','0612345678',true,'annonces-test');
do $$ begin if (select ref from t_ref) not like 'AN-%' then raise exception 'référence absente'; end if; end $$;

-- 3. Piège à robots, consentement, coordonnées dans le texte, adresse invalide, département invalide
do $$ begin
  if public.submit_announcement('subcontract_need','Titre suffisant','Description suffisamment longue pour passer les contrôles de taille.','Maçonnerie','35',null,null,'Paul','p@example.fr',null,true,'v','http://spam') <> 'AN-IGNORE' then raise exception 'honeypot'; end if;
end $$;
select pg_temp.expect_error($$select public.submit_announcement('subcontract_need','Titre suffisant','Description suffisamment longue pour passer les contrôles de taille.','Maçonnerie','35',null,null,'Paul','p@example.fr',null,false,'v')$$, 'consent_required');
select pg_temp.expect_error($$select public.submit_announcement('subcontract_need','Titre suffisant','Appelez moi au 06 12 34 56 78 pour une description assez longue.','Maçonnerie','35',null,null,'Paul','p@example.fr',null,true,'v')$$, 'contact_in_text');
select pg_temp.expect_error($$select public.submit_announcement('subcontract_need','Titre suffisant','Voir mon site www.exemple.fr pour une description assez longue ok.','Maçonnerie','35',null,null,'Paul','p@example.fr',null,true,'v')$$, 'contact_in_text');
select pg_temp.expect_error($$select public.submit_announcement('subcontract_need','Titre suffisant','Description suffisamment longue pour passer les contrôles de taille.','Maçonnerie','99',null,null,'Paul','p@example.fr',null,true,'v')$$, 'invalid_department');
select pg_temp.expect_error($$select public.submit_announcement('subcontract_need','Titre suffisant','Description suffisamment longue pour passer les contrôles de taille.','Maçonnerie','35',null,null,'Paul','pas-un-email',null,true,'v')$$, 'invalid_email');
select pg_temp.expect_error($$select public.submit_announcement('autre','Titre suffisant','Description suffisamment longue pour passer les contrôles de taille.','Maçonnerie','35',null,null,'Paul','p@example.fr',null,true,'v')$$, 'invalid_kind');

-- 4. Limite de débit : 3 dépôts par jour et par origine (1 déjà fait)
select public.submit_announcement('subcontract_offer','Équipe carreleurs dispo','Deux carreleurs expérimentés disponibles dès avril sur le Grand Ouest, carrelage et faïence.','Carrelage','44',null,null,'Luc','luc@example.fr',null,true,'v');
select public.submit_announcement('subcontract_offer','Peintre en bâtiment dispo','Peintre indépendant disponible pour du renfort sur chantiers de rénovation en Mayenne.','Peinture','53',null,null,'Eva','eva@example.fr',null,true,'v');
select pg_temp.expect_error($$select public.submit_announcement('subcontract_offer','Quatrième annonce','Une quatrième annonce depuis la même origine doit être refusée par la limite.','Peinture','53',null,null,'Zoe','zoe@example.fr',null,true,'v')$$, 'rate_limited');

-- 5. Rien de publié, rien de lisible ; la file de relecture est interdite aux visiteurs
do $$ begin if (select count(*) from public.list_published_announcements()) <> 0 then raise exception 'annonce visible avant relecture'; end if; end $$;
select pg_temp.expect_error('select * from public.moderation_queue()', 'permission denied');
select pg_temp.expect_error($$select public.moderate_announcement(gen_random_uuid(),'publish')$$, 'permission denied');

-- 6. Un compte client (non interne) ne relit pas
reset role; set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000b2', false);
select pg_temp.expect_error('select * from public.moderation_queue()', 'forbidden');
select pg_temp.expect_error($$select public.moderate_announcement(gen_random_uuid(),'publish')$$, 'forbidden');

-- 7. Le personnel interne relit : voit les coordonnées, publie, refuse (note obligatoire)
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', false);
do $$ declare q record; first_id uuid; second_id uuid; begin
  if (select count(*) from public.moderation_queue()) <> 3 then raise exception 'file de relecture incorrecte'; end if;
  select id into first_id from public.moderation_queue() where trade = 'Plâtrerie';
  select id into second_id from public.moderation_queue() where trade = 'Carrelage';
  if (select email from public.moderation_queue() where id = first_id) <> 'jean@example.fr' then raise exception 'coordonnées absentes pour le personnel'; end if;
  perform pg_temp.expect_error(format('select public.moderate_announcement(%L,''reject'')', second_id), 'note_required');
  perform public.moderate_announcement(first_id, 'publish', null, 'Cherche plaquiste — Rennes (35)');
  perform public.moderate_announcement(second_id, 'reject', 'Annonce trop vague');
  perform pg_temp.expect_error(format('select public.moderate_announcement(%L,''publish'')', second_id), 'not_pending');
end $$;

-- 8. Le visiteur voit l'annonce publiée sans aucune coordonnée, et peut demander une mise en relation
reset role; set role anon;
select set_config('request.jwt.claim.sub', '', false);
do $$ declare r record; begin
  if (select count(*) from public.list_published_announcements()) <> 1 then raise exception 'publication incorrecte'; end if;
  select * into r from public.list_published_announcements();
  if r.title <> 'Cherche plaquiste — Rennes (35)' then raise exception 'correction du texte non appliquée'; end if;
  if to_jsonb(r)::text ~* '(jean@|0612345678|contact_name|email|phone)' then raise exception 'FUITE de coordonnées'; end if;
  if public.request_announcement_introduction(r.reference,'Sophie Durand','sophie@example.fr','Bonjour, nous sommes plaquistes sur Rennes et disponibles en mars.',true,'v') is not true then raise exception 'mise en relation'; end if;
  perform pg_temp.expect_error(format('select public.request_announcement_introduction(%L,''X Y'',''x@example.fr'',''court'',true,''v'')', r.reference), 'violates check');
  perform pg_temp.expect_error($q$select public.request_announcement_introduction('AN-INEXISTANT','Sophie Durand','sophie@example.fr','Bonjour, nous sommes plaquistes sur Rennes et disponibles.',true,'v')$q$, 'announcement_not_available');
end $$;
select pg_temp.expect_error('select * from private.announcement_introductions', 'permission denied');

-- 9. Expiration
reset role;
update public.announcements set expires_at = now() - interval '1 minute' where status = 'published';
select private.expire_announcements();
set role anon;
do $$ begin if (select count(*) from public.list_published_announcements()) <> 0 then raise exception 'annonce expirée encore visible'; end if; end $$;
reset role;
do $$ begin if (select count(*) from private.announcement_events) < 8 then raise exception 'journal incomplet'; end if; end $$;
select 'SCENARIOS_OK' as resultat;
