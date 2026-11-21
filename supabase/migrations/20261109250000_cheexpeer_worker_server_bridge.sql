-- Cheexpeer worker bridge.
-- Public RPC wrappers are callable only by service_role (used by the private Edge Function).
-- The private schema and PGMQ internals remain unexposed to browser roles.

create or replace function public.cheexpeer_worker_dispatch_due(p_limit integer default 50)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return private.cheexpeer_dispatch_due_missions(p_limit);
end;
$$;

create or replace function public.cheexpeer_worker_read_wakeups(
  p_visibility_timeout_seconds integer default 120,
  p_batch_size integer default 10
)
returns table(
  msg_id bigint,
  read_ct integer,
  enqueued_at timestamptz,
  vt timestamptz,
  message jsonb
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_visibility_timeout_seconds < 15 or p_visibility_timeout_seconds > 3600 then
    raise exception 'visibility timeout must be between 15 and 3600 seconds'
      using errcode = '22023';
  end if;
  if p_batch_size < 1 or p_batch_size > 10 then
    raise exception 'batch size must be between 1 and 10'
      using errcode = '22023';
  end if;

  return query
  select q.msg_id, q.read_ct, q.enqueued_at, q.vt, q.message
  from pgmq.read('cheexpeer_missions', p_visibility_timeout_seconds, p_batch_size) as q;
end;
$$;

create or replace function public.cheexpeer_worker_archive_wakeup(p_message_id bigint)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_message_id is null or p_message_id < 1 then
    raise exception 'message id must be positive' using errcode = '22023';
  end if;
  return pgmq.archive('cheexpeer_missions', p_message_id);
end;
$$;

create or replace function public.cheexpeer_worker_claim_next(
  p_worker_id text,
  p_lease_seconds integer default 120
)
returns table(
  mission_id uuid,
  organization_id uuid,
  mission_type text,
  title text,
  objective text,
  mission_input jsonb,
  mission_context jsonb,
  priority smallint,
  autonomy_level smallint,
  attempt_count smallint,
  deadline_at timestamptz,
  lease_expires_at timestamptz
)
language sql
security invoker
set search_path = ''
as $$
  select * from private.cheexpeer_claim_next_mission(p_worker_id, p_lease_seconds);
$$;

create or replace function public.cheexpeer_worker_renew_lease(
  p_mission_id uuid,
  p_worker_id text,
  p_lease_seconds integer default 120
)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.cheexpeer_renew_mission_lease(p_mission_id, p_worker_id, p_lease_seconds);
$$;

create or replace function public.cheexpeer_worker_complete_mission(
  p_mission_id uuid,
  p_worker_id text,
  p_result jsonb default '{}'::jsonb
)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.cheexpeer_complete_mission(p_mission_id, p_worker_id, p_result);
$$;

create or replace function public.cheexpeer_worker_fail_mission(
  p_mission_id uuid,
  p_worker_id text,
  p_error_code text,
  p_error_summary text,
  p_retry_delay_seconds integer default 60
)
returns text
language sql
security invoker
set search_path = ''
as $$
  select private.cheexpeer_fail_mission(
    p_mission_id, p_worker_id, p_error_code, p_error_summary, p_retry_delay_seconds
  );
$$;

revoke all on function public.cheexpeer_worker_dispatch_due(integer) from public, anon, authenticated;
revoke all on function public.cheexpeer_worker_read_wakeups(integer,integer) from public, anon, authenticated;
revoke all on function public.cheexpeer_worker_archive_wakeup(bigint) from public, anon, authenticated;
revoke all on function public.cheexpeer_worker_claim_next(text,integer) from public, anon, authenticated;
revoke all on function public.cheexpeer_worker_renew_lease(uuid,text,integer) from public, anon, authenticated;
revoke all on function public.cheexpeer_worker_complete_mission(uuid,text,jsonb) from public, anon, authenticated;
revoke all on function public.cheexpeer_worker_fail_mission(uuid,text,text,text,integer) from public, anon, authenticated;

grant execute on function public.cheexpeer_worker_dispatch_due(integer) to service_role;
grant execute on function public.cheexpeer_worker_read_wakeups(integer,integer) to service_role;
grant execute on function public.cheexpeer_worker_archive_wakeup(bigint) to service_role;
grant execute on function public.cheexpeer_worker_claim_next(text,integer) to service_role;
grant execute on function public.cheexpeer_worker_renew_lease(uuid,text,integer) to service_role;
grant execute on function public.cheexpeer_worker_complete_mission(uuid,text,jsonb) to service_role;
grant execute on function public.cheexpeer_worker_fail_mission(uuid,text,text,text,integer) to service_role;

comment on function public.cheexpeer_worker_read_wakeups(integer,integer) is
'Server-only bridge to PGMQ. Browser roles cannot read the Cheexpeer queue.';
comment on function public.cheexpeer_worker_claim_next(text,integer) is
'Server-only bridge to the private priority dispatcher.';
