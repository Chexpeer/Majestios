-- Recette CRM locale (base jetable, aucune écriture distante). Tout est annulé en fin de script.
-- Prérequis : migrations du dépôt appliquées sur une base PostgreSQL vierge avec stubs auth/pg_cron.
\set ON_ERROR_STOP off
begin;
create temp table res(id text, ok boolean, detail text);
grant all on res to public;

insert into auth.users(id,email) values
 ('00000000-0000-0000-0000-0000000000a1','int-owner@t'),('00000000-0000-0000-0000-0000000000a2','int-member@t'),
 ('00000000-0000-0000-0000-0000000000b1','c1-owner@t'),('00000000-0000-0000-0000-0000000000b2','c1-member@t'),
 ('00000000-0000-0000-0000-0000000000b3','c1-viewer@t'),('00000000-0000-0000-0000-0000000000c1','c2-owner@t'),
 ('00000000-0000-0000-0000-0000000000d1','outsider@t');
insert into public.organizations(id,name,slug,kind) values
 ('11111111-1111-1111-1111-111111111111','Interne','int','internal'),
 ('22222222-2222-2222-2222-222222222222','Client1','c1','client'),
 ('33333333-3333-3333-3333-333333333333','Client2','c2','client');
insert into public.organization_members(organization_id,user_id,role) values
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-0000000000a1','owner'),
 ('11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-0000000000a2','member'),
 ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-0000000000b1','owner'),
 ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-0000000000b2','member'),
 ('22222222-2222-2222-2222-222222222222','00000000-0000-0000-0000-0000000000b3','viewer'),
 ('33333333-3333-3333-3333-333333333333','00000000-0000-0000-0000-0000000000c1','owner');
-- données de base (postgres)
insert into public.businesses(id,organization_id,legal_name) values
 ('aaaaaaaa-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','Soc C1'),
 ('aaaaaaaa-0000-0000-0000-000000000002','33333333-3333-3333-3333-333333333333','Soc C2'),
 ('aaaaaaaa-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Soc INT');

create function pg_temp.as_user(u text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', u, true);
  execute 'set local role authenticated';
end $$;
create function pg_temp.reset_user() returns void language plpgsql as $$
begin execute 'reset role'; perform set_config('request.jwt.claim.sub','',true); end $$;

-- t(id, user, sql, attendu) : 'ok' = au moins une ligne touchée sans erreur ; 'deny' = erreur ou 0 ligne.
create function pg_temp.t(p_id text, p_user text, p_sql text, p_expect text) returns void language plpgsql as $f$
declare v_err text := null; v_rows int := 0; v_ok boolean;
begin
  perform pg_temp.as_user(p_user);
  begin
    execute p_sql;
    get diagnostics v_rows = row_count;
  exception when others then v_err := sqlerrm;
  end;
  perform pg_temp.reset_user();
  v_ok := case p_expect when 'ok' then v_err is null and v_rows > 0
                        else v_err is not null or v_rows = 0 end;
  insert into res values (p_id, v_ok, coalesce('erreur: '||v_err, v_rows||' ligne(s)'));
end $f$;
create function pg_temp.q(p_id text, p_sql text, p_expect text) returns void language plpgsql as $f$
declare v text;
begin
  execute p_sql into v;
  insert into res values (p_id, v = p_expect, 'obtenu='||coalesce(v,'NULL')||' attendu='||p_expect);
end $f$;

\set io '''00000000-0000-0000-0000-0000000000a1'''
\set im '''00000000-0000-0000-0000-0000000000a2'''
\set co '''00000000-0000-0000-0000-0000000000b1'''
\set cm '''00000000-0000-0000-0000-0000000000b2'''
\set cv '''00000000-0000-0000-0000-0000000000b3'''
\set c2 '''00000000-0000-0000-0000-0000000000c1'''
\set ou '''00000000-0000-0000-0000-0000000000d1'''

select pg_temp.t('RLS-01 membre client lit sa société', :cm, $q$select 1 from public.businesses where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'ok');
select pg_temp.t('RLS-02 lecteur client lit sa société', :cv, $q$select 1 from public.businesses where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'ok');
select pg_temp.t('RLS-03 autre client ne lit pas', :c2, $q$select 1 from public.businesses where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'deny');
select pg_temp.t('RLS-04 externe ne lit rien', :ou, $q$select 1 from public.businesses$q$, 'deny');
select pg_temp.t('RLS-05 membre interne simple ne lit pas le CRM interne', :im, $q$select 1 from public.businesses where id='aaaaaaaa-0000-0000-0000-000000000003'$q$, 'deny');
select pg_temp.t('RLS-06 owner interne lit le CRM interne', :io, $q$select 1 from public.businesses where id='aaaaaaaa-0000-0000-0000-000000000003'$q$, 'ok');
select pg_temp.t('RLS-07 owner interne ne lit pas un client', :io, $q$select 1 from public.businesses where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'deny');

select pg_temp.t('W-01 membre client crée une société', :cm, $q$insert into public.businesses(organization_id,legal_name,created_by) values ('22222222-2222-2222-2222-222222222222','Nouvelle','00000000-0000-0000-0000-0000000000b2')$q$, 'ok');
select pg_temp.t('W-02 lecteur client ne crée pas', :cv, $q$insert into public.businesses(organization_id,legal_name) values ('22222222-2222-2222-2222-222222222222','Interdit')$q$, 'deny');
select pg_temp.t('W-03 pas de création chez un autre client', :cm, $q$insert into public.businesses(organization_id,legal_name) values ('33333333-3333-3333-3333-333333333333','Intrus')$q$, 'deny');
select pg_temp.t('W-04 created_by usurpé refusé', :cm, $q$insert into public.businesses(organization_id,legal_name,created_by) values ('22222222-2222-2222-2222-222222222222','Usurpe','00000000-0000-0000-0000-0000000000b1')$q$, 'deny');
select pg_temp.t('W-05 membre interne simple ne crée pas en interne', :im, $q$insert into public.businesses(organization_id,legal_name) values ('11111111-1111-1111-1111-111111111111','X')$q$, 'deny');
select pg_temp.t('W-06 membre client modifie une société', :cm, $q$update public.businesses set trade_name='Maj' where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'ok');
select pg_temp.t('W-07 lecteur ne modifie pas', :cv, $q$update public.businesses set trade_name='Maj2' where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'deny');
select pg_temp.t('W-08 autre client ne modifie pas', :c2, $q$update public.businesses set trade_name='Maj3' where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'deny');
select pg_temp.t('W-09 changer organization_id refusé', :cm, $q$update public.businesses set organization_id='33333333-3333-3333-3333-333333333333' where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'deny');
select pg_temp.t('W-10 membre ne supprime pas', :cm, $q$delete from public.businesses where id='aaaaaaaa-0000-0000-0000-000000000001'$q$, 'deny');

select pg_temp.t('TRG-01 contact org1 + société org2 refusé', :cm, $q$insert into public.contacts(organization_id,business_id,last_name) values ('22222222-2222-2222-2222-222222222222','aaaaaaaa-0000-0000-0000-000000000002','Dupont')$q$, 'deny');
select pg_temp.t('TRG-02 contact valide', :cm, $q$insert into public.contacts(id,organization_id,business_id,last_name) values ('cccccccc-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','aaaaaaaa-0000-0000-0000-000000000001','Martin')$q$, 'ok');
select pg_temp.t('TRG-03 contact sans société (NULL optionnel)', :cm, $q$insert into public.contacts(organization_id,last_name) values ('22222222-2222-2222-2222-222222222222','Solo')$q$, 'ok');
select pg_temp.t('TRG-04 opportunité avec société d un autre client refusée', :cm, $q$insert into public.opportunities(organization_id,business_id,title) values ('22222222-2222-2222-2222-222222222222','aaaaaaaa-0000-0000-0000-000000000002','X')$q$, 'deny');
select pg_temp.t('TRG-05 opportunité valide', :cm, $q$insert into public.opportunities(id,organization_id,business_id,primary_contact_id,title,next_action,next_action_at) values ('dddddddd-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','aaaaaaaa-0000-0000-0000-000000000001','cccccccc-0000-0000-0000-000000000001','Appel offres test','Rappeler le client', now()+interval '1 day')$q$, 'ok');
select pg_temp.t('TRG-06 activité liée à une opportunité d un autre client refusée', :c2, $q$insert into public.activities(organization_id,opportunity_id,activity_type,subject) values ('33333333-3333-3333-3333-333333333333','dddddddd-0000-0000-0000-000000000001','note','x')$q$, 'deny');
select pg_temp.t('TRG-07 note valide', :cm, $q$insert into public.activities(organization_id,opportunity_id,activity_type,subject,actor_user_id) values ('22222222-2222-2222-2222-222222222222','dddddddd-0000-0000-0000-000000000001','note','Note ok','00000000-0000-0000-0000-0000000000b2')$q$, 'ok');

select pg_temp.t('ACT-01 changement de statut', :cm, $q$update public.opportunities set status='qualified' where id='dddddddd-0000-0000-0000-000000000001'$q$, 'ok');
select pg_temp.q('ACT-02 historique statut enregistré', $q$select count(*)::text from public.activities where opportunity_id='dddddddd-0000-0000-0000-000000000001' and activity_type='status_change'$q$, '1');
select pg_temp.t('ACT-03 modification contact historisée', :cm, $q$update public.contacts set job_title='Directeur' where id='cccccccc-0000-0000-0000-000000000001'$q$, 'ok');
update public.opportunities set next_action_at = now() - interval '1 hour' where id='dddddddd-0000-0000-0000-000000000001';
select private.materialize_crm_reminders();
select pg_temp.q('REM-01 relance matérialisée par la tâche planifiée', $q$select count(*)::text from public.crm_reminders where opportunity_id='dddddddd-0000-0000-0000-000000000001' and state='pending'$q$, '1');
select pg_temp.t('REM-02 lecteur ne traite pas la relance', :cv, $q$select public.complete_crm_reminder(id) from public.crm_reminders where opportunity_id='dddddddd-0000-0000-0000-000000000001'$q$, 'deny');
select pg_temp.t('REM-03 autre client ne traite pas', :c2, $q$select public.complete_crm_reminder(id) from public.crm_reminders where opportunity_id='dddddddd-0000-0000-0000-000000000001'$q$, 'deny');
select pg_temp.t('REM-04 anonyme refusé', '', $q$select public.complete_crm_reminder(gen_random_uuid())$q$, 'deny');
select pg_temp.t('REM-05 membre traite la relance', :cm, $q$select public.complete_crm_reminder(id) from public.crm_reminders where opportunity_id='dddddddd-0000-0000-0000-000000000001'$q$, 'ok');
select pg_temp.q('REM-06 relance passée en lue', $q$select state from public.crm_reminders where opportunity_id='dddddddd-0000-0000-0000-000000000001'$q$, 'read');
select pg_temp.t('REM-07 deuxième traitement refusé', :cm, $q$select public.complete_crm_reminder(id) from public.crm_reminders where opportunity_id='dddddddd-0000-0000-0000-000000000001'$q$, 'deny');
select pg_temp.q('REM-08 activité de traitement créée', $q$select count(*)::text from public.activities where metadata->>'source'='crm_reminder'$q$, '1');
select pg_temp.t('REM-09 modification directe refusée (lecteur)', :cv, $q$update public.crm_reminders set state='cancelled'$q$, 'deny');
select pg_temp.t('REM-10 insertion directe refusée', :co, $q$insert into public.crm_reminders(organization_id,opportunity_id,due_at,title,action) values ('22222222-2222-2222-2222-222222222222','dddddddd-0000-0000-0000-000000000001',now(),'t','a')$q$, 'deny');

select pg_temp.q('PRIV-01 anon sans exécution de complete_crm_reminder', $q$select has_function_privilege('anon','public.complete_crm_reminder(uuid)','execute')::text$q$, 'false');
select pg_temp.q('PRIV-02 authenticated peut exécuter complete_crm_reminder', $q$select has_function_privilege('authenticated','public.complete_crm_reminder(uuid)','execute')::text$q$, 'true');
select pg_temp.q('PRIV-03 anon sans accès aux tables CRM', $q$select (has_table_privilege('anon','public.businesses','select') or has_table_privilege('anon','public.opportunities','select'))::text$q$, 'false');

select pg_temp.q('CRM-TRG-01 trigger intégrité unique (businesses)', $q$select count(*)::text from pg_trigger where tgrelid='public.businesses'::regclass and not tgisinternal and tgname like '%tenant_integrity'$q$, '1');
select pg_temp.q('CRM-TRG-01 trigger intégrité unique (contacts)', $q$select count(*)::text from pg_trigger where tgrelid='public.contacts'::regclass and not tgisinternal and tgname like '%tenant_integrity'$q$, '1');
select pg_temp.q('CRM-TRG-01 trigger intégrité unique (opportunities)', $q$select count(*)::text from pg_trigger where tgrelid='public.opportunities'::regclass and not tgisinternal and tgname like '%tenant_integrity'$q$, '1');
select pg_temp.q('CRM-TRG-01 trigger intégrité unique (activities)', $q$select count(*)::text from pg_trigger where tgrelid='public.activities'::regclass and not tgisinternal and tgname like '%tenant_integrity'$q$, '1');

select case when ok then 'PASS' else 'FAIL' end as statut, id, detail from res order by ok, id;
select count(*) filter (where ok) as pass, count(*) filter (where not ok) as fail from res;
rollback;
