-- Queue PGMQ strictement réservée au serveur.
revoke all on schema pgmq from public, anon, authenticated;
grant usage on schema pgmq to service_role;
grant execute on all functions in schema pgmq to service_role;
grant select, insert, update, delete on all tables in schema pgmq to service_role;
grant usage, select on all sequences in schema pgmq to service_role;

revoke all on schema pgmq from public, anon, authenticated;
