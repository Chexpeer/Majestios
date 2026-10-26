-- Reference copy: memory schema definitions are maintained in supabase/migrations/0001_initial_schema.sql.
-- This schema stores validated companies, contacts, decision makers, opportunities and ACT activity records.
-- Apply the migration, not this reference file, to initialize a database.
create schema if not exists memory;
