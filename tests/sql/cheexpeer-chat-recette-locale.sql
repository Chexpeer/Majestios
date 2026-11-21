-- Recette locale du chat Cheexpeer (base jetable, tout est annulé en fin de script).
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


\set ON_ERROR_STOP off
select pg_temp.t('CHAT-01 admin voit le statut', :'A', 'select public.cheexpeer_chat_status()', 'ok');
select pg_temp.t('CHAT-02 membre simple refusé', :'M', 'select public.cheexpeer_chat_status()', 'ACCESS_DENIED');
select pg_temp.t('CHAT-03 client refusé', :'C', 'select public.cheexpeer_chat_status()', 'ACCESS_DENIED');
select pg_temp.t('CHAT-04 éteint par défaut : message refusé', :'O', $$select public.cheexpeer_chat_prepare(null,'Bonjour')$$, 'CHAT_DISABLED');
select pg_temp.t('CHAT-05 admin ne peut pas allumer', :'A', 'select public.set_cheexpeer_chat_enabled(true)', 'ACCESS_DENIED');
select pg_temp.t('CHAT-06 owner allume', :'O', 'select public.set_cheexpeer_chat_enabled(true)', 'ok');
select pg_temp.t('CHAT-07 message vide refusé', :'O', $$select public.cheexpeer_chat_prepare(null,'   ')$$, 'EMPTY_MESSAGE');
select pg_temp.t('CHAT-08 message trop long refusé', :'O', $$select public.cheexpeer_chat_prepare(null, repeat('a',4001))$$, 'MESSAGE_TOO_LONG');
select pg_temp.t('CHAT-09 question enregistrée', :'O', $$select public.cheexpeer_chat_prepare('aaaaaaaa-0000-4000-8000-000000000001'::uuid,'Où en est le site ?')$$, 'CONVERSATION_NOT_FOUND');
create temp table conv as select gen_random_uuid() as id;
grant select on conv to public;
select pg_temp.t('CHAT-10 nouvelle conversation', :'O', $$select public.cheexpeer_chat_prepare(null,'Où en est le site ?')$$, 'ok');
do $$ begin
  insert into res values ('CHK-01 question stockée', (select count(*) from private.cheexpeer_chat_messages where role='user')=1, '');
  update conv set id=(select conversation_id from private.cheexpeer_chat_messages limit 1);
end $$;
select pg_temp.t('CHAT-11 authenticated ne peut pas écrire une réponse', :'O', $$select public.cheexpeer_chat_record('00000000-0000-0000-0000-0000000000a1'::uuid,(select id from conv),'faux',1,1)$$, 'permission denied');
do $$ begin
  set local role service_role;
  perform public.cheexpeer_chat_record('00000000-0000-0000-0000-0000000000a1'::uuid,(select id from conv),'Le site est en test.',10,20);
  reset role;
  insert into res values ('CHK-02 réponse stockée par le service', (select count(*) from private.cheexpeer_chat_messages where role='assistant')=1, '');
exception when others then reset role; insert into res values ('CHK-02 réponse stockée par le service', false, sqlerrm); end $$;
select pg_temp.t('CHAT-12 historique lisible par son auteur', :'O', $$select public.cheexpeer_chat_history(null)$$, 'ok');
do $$ declare v jsonb; begin
  perform set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a2',true); set local role authenticated;
  v := public.cheexpeer_chat_history((select id from conv)); reset role; perform set_config('request.jwt.claim.sub','',true);
  insert into res values ('CHK-03 un autre admin ne lit pas la conversation', jsonb_array_length(v->'messages')=0, v::text);
end $$;
select pg_temp.t('CHAT-13 autre admin ne continue pas la conversation', :'A', $$select public.cheexpeer_chat_prepare((select id from conv),'intrusion')$$, 'CONVERSATION_NOT_FOUND');
-- Plafond journalier
do $$ begin
  update private.cheexpeer_chat_settings set daily_message_cap = 2;
end $$;
select pg_temp.t('CHAT-14 2e question passe', :'O', $$select public.cheexpeer_chat_prepare((select id from conv),'Deuxième')$$, 'ok');
select pg_temp.t('CHAT-15 3e question bloquée (plafond jour)', :'O', $$select public.cheexpeer_chat_prepare((select id from conv),'Troisième')$$, 'QUOTA_DAY');
do $$ begin update private.cheexpeer_chat_settings set daily_message_cap = 30, monthly_message_cap = 2; end $$;
select pg_temp.t('CHAT-16 plafond mensuel', :'O', $$select public.cheexpeer_chat_prepare((select id from conv),'Mensuel')$$, 'QUOTA_MONTH');
select pg_temp.t('SEC-01 lecture directe refusée', :'O', 'select * from private.cheexpeer_chat_messages', 'permission denied');
select pg_temp.t('CHAT-17 effacement', :'O', $$select public.cheexpeer_chat_clear((select id from conv))$$, 'ok');
do $$ begin insert into res values ('CHK-04 conversation effacée', (select count(*) from private.cheexpeer_chat_messages)=0, ''); end $$;
select pg_temp.t('CHAT-18 éteindre', :'O', 'select public.set_cheexpeer_chat_enabled(false)', 'ok');
select id, case when ok then 'PASS' else 'FAIL' end as r, detail from res order by id;
select count(*) filter (where ok) as pass, count(*) filter (where not ok) as fail from res;
rollback;
