/**
 * Point d'entrée navigateur de l'adaptateur de recherche membre.
 * Ce module reste volontairement non raccordé à la page tant que l'endpoint
 * hébergé n'a pas été vérifié et que la bascule n'a pas été autorisée.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";
import { createProspectionMemberAdapter } from "./prospection-member-adapter.mjs";

const client = createClient(MAJESTIOS_SUPABASE.url, MAJESTIOS_SUPABASE.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

window.MajestiosProspectionMemberSearch = createProspectionMemberAdapter({ supabase: client });
