-- Reference copy: staging schema definitions are maintained in supabase/migrations/0001_initial_schema.sql.
-- This schema stores imported source records separately from validated company memory.
-- Apply the migration, not this reference file, to initialize a database.
create schema if not exists staging;
