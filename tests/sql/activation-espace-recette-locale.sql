-- Recette locale de l'activation d'espace (mot de passe obligatoire, 10 jours) (base jetable, tout est annulé en fin de script).
\set ON_ERROR_STOP off
begin;
alter table auth.users add column if not exists email_confirmed_at timestamptz;
create temp table res(id text, ok boolean, detail text);
grant all on res to public;
alter table auth.users add column if not exists encrypted_password text;
insert into auth.users(id,email,email_confirmed_at) values
 ('00000000-0000-0000-0000-0000000000a1','neuf@t.fr',now()),('00000000-0000-0000-0000-0000000000a2','non-confirme@t.fr',null),
 ('00000000-0000-0000-0000-0000000000a3','deja-membre@t.fr',now());
insert into public.organizations(id,name,slug,kind) values ('22222222-2222-2222-2222-222222222222','Client1','c1','client');
insert into public.organization_members(organization_id,user_id,role) values ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-0000000000a3','owner');
\i /tmp/claude-0/work/Majestios/supabase/migrations/20261115030000_member_activation.sql
create function pg_temp.as_user(u text) returns void language plpgsql as $$
begin perform set_config('request.jwt.claim.sub', u, true); execute 'set local role authenticated'; end $$;
create function pg_temp.reset_user() returns void language plpgsql as $$
begin execute 'reset role'; perform set_config('request.jwt.claim.sub','',true); end $$;
-- t(id, user, sql, attendu) : 'ok' = exécuté sans erreur ; sinon le texte attendu dans le message d'erreur.
create function pg_temp.t(p_id text, p_user text, p_sql text, p_expect text) returns void language plpgsql as $f$
declare v_err text := null;
begin
  perform pg_temp.as_user(p_user);
  begin execute p_sql; exception when others then v_err := sqlerrm; end;
  perform pg_temp.reset_user();
  insert into res values (p_id,
    case when p_expect = 'ok' then v_err is null else coalesce(v_err,'') like '%'||p_expect||'%' end,
    coalesce(v_err,'ok'));
end $f$;
\set N '00000000-0000-0000-0000-0000000000a1'
\set U '00000000-0000-0000-0000-0000000000a2'
\set M '00000000-0000-0000-0000-0000000000a3'
select pg_temp.t('ACT-01 anonyme refusé', '', 'select public.start_member_activation()', 'AUTH_REQUIRED');
select pg_temp.t('ACT-02 adresse non confirmée refusée', :'U', 'select public.start_member_activation()', 'EMAIL_NOT_CONFIRMED');
select pg_temp.t('ACT-03 nouveau compte : activation en attente', :'N', 'select public.start_member_activation()', 'ok');
do $$ declare v jsonb; begin
  perform set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',true); set local role authenticated;
  v := public.member_activation_status(); reset role; perform set_config('request.jwt.claim.sub','',true);
  insert into res values ('ACT-04 état en attente, sans mot de passe', v->>'state'='pending' and (v->>'has_password')::boolean=false, v::text);
  insert into res values ('ACT-05 délai de 10 jours', (v->>'deadline')::timestamptz between now()+interval '9 days 23 hours' and now()+interval '10 days 1 hour', v::text);
end $$;
select pg_temp.t('ACT-06 second appel idempotent', :'N', 'select public.start_member_activation()', 'ok');
do $$ begin insert into res values ('ACT-07 une seule ligne', (select count(*) from private.member_activations where user_id='00000000-0000-0000-0000-0000000000a1')=1, ''); end $$;
do $$ declare v jsonb; begin
  perform set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a3',true); set local role authenticated;
  v := public.start_member_activation(); reset role; perform set_config('request.jwt.claim.sub','',true);
  insert into res values ('ACT-08 déjà membre : actif, aucune ligne en attente', v->>'state'='active' and (select count(*) from private.member_activations where user_id='00000000-0000-0000-0000-0000000000a3')=0, v::text);
end $$;
-- Prêt pour l'espace ? (service seulement)
select pg_temp.t('ACT-09 authenticated ne lit pas la préparation', :'N', $$select public.member_ready_for_workspace('00000000-0000-0000-0000-0000000000a1')$$, 'permission denied');
select pg_temp.t('ACT-10 authenticated ne clôt pas l''activation', :'N', $$select public.complete_member_activation('00000000-0000-0000-0000-0000000000a1')$$, 'permission denied');
select pg_temp.t('ACT-11 lecture directe de la table refusée', :'N', 'select * from private.member_activations', 'permission denied');
do $$ declare v jsonb; begin
  set local role service_role;
  v := public.member_ready_for_workspace('00000000-0000-0000-0000-0000000000a1'); reset role;
  insert into res values ('ACT-12 sans mot de passe : non prêt', (v->>'has_password')::boolean=false and (v->>'has_activation')::boolean and not (v->>'expired')::boolean, v::text);
  update auth.users set encrypted_password='$2a$10$abcdefghijklmnopqrstuv' where id='00000000-0000-0000-0000-0000000000a1';
  set local role service_role;
  v := public.member_ready_for_workspace('00000000-0000-0000-0000-0000000000a1'); reset role;
  insert into res values ('ACT-13 mot de passe créé : prêt', (v->>'has_password')::boolean, v::text);
exception when others then reset role; insert into res values ('ACT-12/13 service', false, sqlerrm); end $$;
-- Expiration puis renouvellement
update private.member_activations set deadline = now() - interval '1 day' where user_id='00000000-0000-0000-0000-0000000000a1';
do $$ declare v jsonb; begin
  perform set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',true); set local role authenticated;
  v := public.member_activation_status(); reset role; perform set_config('request.jwt.claim.sub','',true);
  insert into res values ('ACT-14 délai dépassé : expiré', v->>'state'='expired', v::text);
end $$;
select pg_temp.t('ACT-15 nouvelle demande : renouvelé', :'N', 'select public.start_member_activation()', 'ok');
do $$ begin insert into res values ('ACT-16 de nouveau en attente pour 10 jours', (select deadline > now()+interval '9 days' from private.member_activations where user_id='00000000-0000-0000-0000-0000000000a1'), ''); end $$;
do $$ begin
  set local role service_role; perform public.complete_member_activation('00000000-0000-0000-0000-0000000000a1'); reset role;
  insert into res values ('ACT-17 activation clôturée par le service', (select activated_at is not null from private.member_activations where user_id='00000000-0000-0000-0000-0000000000a1'), '');
exception when others then reset role; insert into res values ('ACT-17', false, sqlerrm); end $$;
select id, case when ok then 'PASS' else 'FAIL' end as r, detail from res order by id;
select count(*) filter (where ok) as pass, count(*) filter (where not ok) as fail from res;
rollback;
