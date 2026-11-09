-- Cheexpeer — file durable de transport des missions.
-- Le contenu métier et l'état de vérité restent dans private.cheexpeer_missions.
create schema if not exists pgmq;
create extension if not exists pgmq with schema pgmq;

do $$
begin
  if not exists (
    select 1 from pgmq.meta where queue_name = 'cheexpeer_missions'
  ) then
    perform pgmq.create('cheexpeer_missions');
  end if;
end $$;

comment on extension pgmq is
'Transport durable interne des missions Cheexpeer ; aucune exposition client pgmq_public.';
