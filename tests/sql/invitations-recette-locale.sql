-- Recette locale des invitations (base jetable, tout est annulé en fin de script).
\set ON_ERROR_STOP off
begin;
alter table auth.users add column if not exists email_confirmed_at timestamptz;
create temp table res(id text, ok boolean, detail text);
grant all on res to public;
insert into auth.users(id,email,email_confirmed_at) values
 ('00000000-0000-0000-0000-0000000000a1','owner@t.fr',now()),('00000000-0000-0000-0000-0000000000a2','admin@t.fr',now()),
 ('00000000-0000-0000-0000-0000000000a3','member@t.fr',now()),('00000000-0000-0000-0000-0000000000b1','c1-owner@t.fr',now()),
 ('00000000-0000-0000-0000-0000000000e1','new-member@t.fr',now()),('00000000-0000-0000-0000-0000000000e2','new-client@t.fr',now()),
 ('00000000-0000-0000-0000-0000000000e3','stranger@t.fr',now()),('00000000-0000-0000-0000-0000000000e4','unconfirmed@t.fr',null);
insert into public.organizations(id,name,slug,kind) values
 ('11111111-1111-1111-1111-111111111111','Interne','int','internal'),
 ('22222222-2222-2222-2222-222222222222','Client1','c1','client');
insert into public.organization_members(organization_id,user_id,role) values
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-0000000000a1','owner'),
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-0000000000a2','admin'),
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-0000000000a3','member'),
 ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-0000000000b1','owner');

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
\set O '00000000-0000-0000-0000-0000000000a1'
\set A '00000000-0000-0000-0000-0000000000a2'
\set M '00000000-0000-0000-0000-0000000000a3'
\set C '00000000-0000-0000-0000-0000000000b1'
\set INT '11111111-1111-1111-1111-111111111111'
\set C1 '22222222-2222-2222-2222-222222222222'

-- Droits d'invitation
select pg_temp.t('INV-01 owner invite admin interne', :'O', format($$select public.create_invitation('x1@t.fr','internal','admin','%s')$$, :'INT'), 'ok');
select pg_temp.t('INV-02 owner invite member', :'O', format($$select public.create_invitation('x2@t.fr','internal','member','%s')$$, :'INT'), 'ok');
select pg_temp.t('INV-03 admin invite member', :'A', format($$select public.create_invitation('x3@t.fr','internal','viewer','%s')$$, :'INT'), 'ok');
select pg_temp.t('INV-04 admin ne peut pas inviter admin', :'A', format($$select public.create_invitation('x4@t.fr','internal','admin','%s')$$, :'INT'), 'ACCESS_DENIED');
select pg_temp.t('INV-05 personne ne donne owner interne', :'O', format($$select public.create_invitation('x5@t.fr','internal','owner','%s')$$, :'INT'), 'INVALID_ROLE');
select pg_temp.t('INV-06 member simple refusé', :'M', format($$select public.create_invitation('x6@t.fr','internal','member','%s')$$, :'INT'), 'ACCESS_DENIED');
select pg_temp.t('INV-07 client owner refusé (non interne)', :'C', format($$select public.create_invitation('x7@t.fr','client','member','%s')$$, :'C1'), 'ACCESS_DENIED');
select pg_temp.t('INV-08 admin invite client nouvelle org', :'A', $$select public.create_invitation('x8@t.fr','client','owner',null,'Ma Société')$$, 'ok');
select pg_temp.t('INV-09 invite client org existante', :'O', format($$select public.create_invitation('x9@t.fr','client','member','%s')$$, :'C1'), 'ok');
select pg_temp.t('INV-10 auto-invitation refusée', :'O', $$select public.create_invitation('owner@t.fr','internal','member','11111111-1111-1111-1111-111111111111')$$, 'SELF_INVITATION');
select pg_temp.t('INV-11 déjà membre refusé', :'O', $$select public.create_invitation('admin@t.fr','internal','member','11111111-1111-1111-1111-111111111111')$$, 'ALREADY_MEMBER');
select pg_temp.t('INV-12 doublon en attente refusé', :'O', format($$select public.create_invitation('X1@T.fr ','internal','member','%s')$$, :'INT'), 'ALREADY_PENDING');
select pg_temp.t('INV-13 e-mail invalide', :'O', format($$select public.create_invitation('pas-un-mail','internal','member','%s')$$, :'INT'), 'INVALID_EMAIL');
select pg_temp.t('INV-14 org interne pour client refusée', :'O', format($$select public.create_invitation('y1@t.fr','client','member','%s')$$, :'INT'), 'INVALID_ORGANIZATION');
select pg_temp.t('INV-15 sans session refusé', '', $$select public.create_invitation('y2@t.fr','internal','member','11111111-1111-1111-1111-111111111111')$$, 'AUTH_REQUIRED');

-- Accès direct aux tables interdit
select pg_temp.t('SEC-01 lecture directe refusée', :'O', 'select * from private.invitations', 'permission denied');
select pg_temp.t('SEC-02 anon ne peut pas appeler', :'O', $$set local role anon; select public.create_invitation('z@t.fr','internal','member','11111111-1111-1111-1111-111111111111')$$, 'permission denied');

-- Liste / révocation
create temp table inv_ids as select email, id from private.invitations;
grant select on inv_ids to public;
select pg_temp.t('LST-01 owner liste', :'O', 'select public.list_invitations()', 'ok');
select pg_temp.t('LST-02 member simple refusé', :'M', 'select public.list_invitations()', 'ACCESS_DENIED');
select pg_temp.t('REV-01 admin révoque la sienne', :'A', $$select public.revoke_invitation((select id from inv_ids where email='x3@t.fr'))$$, 'ok');
select pg_temp.t('REV-02 admin ne révoque pas celle d''un autre', :'A', $$select public.revoke_invitation((select id from inv_ids where email='x2@t.fr'))$$, 'INVITATION_NOT_FOUND');
select pg_temp.t('REV-03 owner révoque toute', :'O', $$select public.revoke_invitation((select id from inv_ids where email='x2@t.fr'))$$, 'ok');
select pg_temp.t('REV-04 réinvitation après révocation', :'O', format($$select public.create_invitation('x2@t.fr','internal','member','%s')$$, :'INT'), 'ok');

-- Quota : 10 par 24 h pour l'invitant (owner en a déjà créé 6 : x1,x2,x5? non refusés ; compte réel ci-dessous)
do $$ declare n int; begin
  select count(*) into n from private.invitations where invited_by='00000000-0000-0000-0000-0000000000a1';
  insert into res values ('QUO-00 compte owner avant remplissage', true, n::text);
  for i in n+1..10 loop insert into private.invitations(email,kind,role,organization_id,invited_by) values ('fill'||i||'@t.fr','internal','member','11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-0000000000a1'); end loop;
end $$;
select pg_temp.t('QUO-01 11e invitation refusée', :'O', format($$select public.create_invitation('over@t.fr','internal','member','%s')$$, :'INT'), 'QUOTA_EXCEEDED');

-- Acceptation
insert into private.invitations(email,kind,role,organization_id,invited_by) values
 ('new-member@t.fr','internal','member','11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-0000000000a1');
insert into private.invitations(email,kind,role,new_organization_name,invited_by) values
 ('new-client@t.fr','client','owner','Boulangerie Dupont','00000000-0000-0000-0000-0000000000a1');
insert into private.invitations(email,kind,role,organization_id,invited_by,expires_at,created_at) values
 ('stranger@t.fr','internal','member','11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-0000000000a1', now()-interval '1 day', now()-interval '8 days');
select pg_temp.t('ACC-01 invité interne accepte', '00000000-0000-0000-0000-0000000000e1', 'select public.accept_invitation()', 'ok');
select pg_temp.t('ACC-02 client sans consentement refusé', '00000000-0000-0000-0000-0000000000e2', 'select public.accept_invitation()', 'NOTICE_REQUIRED');
select pg_temp.t('ACC-03 client avec mauvaise version refusé', '00000000-0000-0000-0000-0000000000e2', $$select public.accept_invitation('2020-01-01')$$, 'NOTICE_REQUIRED');
select pg_temp.t('ACC-04 client accepte avec consentement', '00000000-0000-0000-0000-0000000000e2', $$select public.accept_invitation('2026-11-05')$$, 'ok');
select pg_temp.t('ACC-05 réacceptation idempotente', '00000000-0000-0000-0000-0000000000e2', $$select public.accept_invitation('2026-11-05')$$, 'ok');
select pg_temp.t('ACC-06 invitation expirée refusée', '00000000-0000-0000-0000-0000000000e3', 'select public.accept_invitation()', 'INVITATION_NOT_FOUND');
select pg_temp.t('ACC-07 e-mail non confirmé refusé', '00000000-0000-0000-0000-0000000000e4', 'select public.accept_invitation()', 'EMAIL_NOT_CONFIRMED');
select pg_temp.t('ACC-08 sans invitation refusé', '00000000-0000-0000-0000-0000000000b1', 'select public.accept_invitation()', 'INVITATION_NOT_FOUND');

do $$ begin
  insert into res values ('CHK-01 membre interne créé', exists(select 1 from organization_members where user_id='00000000-0000-0000-0000-0000000000e1' and organization_id='11111111-1111-1111-1111-111111111111' and role='member'), '');
  insert into res values ('CHK-02 organisation client créée + owner', exists(select 1 from organization_members m join organizations o on o.id=m.organization_id where m.user_id='00000000-0000-0000-0000-0000000000e2' and m.role='owner' and o.kind='client' and o.name='Boulangerie Dupont'), '');
  insert into res values ('CHK-03 consentement journalisé', exists(select 1 from privacy_acknowledgments where user_id='00000000-0000-0000-0000-0000000000e2' and notice_version='2026-11-05'), '');
  insert into res values ('CHK-04 une seule org pour le client', (select count(*) from organization_members where user_id='00000000-0000-0000-0000-0000000000e2')=1, '');
  insert into res values ('CHK-05 invitation expirée jamais acceptée', (select status from private.invitations where email='stranger@t.fr')<>'accepted', '');
end $$;

-- Conflit de mondes : un membre interne ne peut pas devenir client
insert into private.invitations(email,kind,role,organization_id,invited_by) values
 ('member@t.fr','client','member','22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-0000000000a1');
select pg_temp.t('ACC-09 interne ne devient pas client', '00000000-0000-0000-0000-0000000000a3', $$select public.accept_invitation('2026-11-05')$$, 'ACCOUNT_CONFLICT');

select id, case when ok then 'PASS' else 'FAIL' end as r, detail from res order by id;
select count(*) filter (where ok) as pass, count(*) filter (where not ok) as fail from res;
rollback;
