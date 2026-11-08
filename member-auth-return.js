import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const config = MAJESTIOS_SUPABASE;
const callbackUrl = new URL(window.location.href);
const hasAuthCallback = callbackUrl.searchParams.has("code") ||
  callbackUrl.hash.includes("access_token=") ||
  callbackUrl.searchParams.has("error") ||
  callbackUrl.searchParams.has("error_description");

if (config?.url && config?.publishableKey && hasAuthCallback) {
  const supabase = createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const { data, error } = await supabase.auth.getSession();
  if (error || callbackUrl.searchParams.has("error")) {
    const params = new URLSearchParams();
    params.set("auth_error", callbackUrl.searchParams.get("error_description") ||
      error?.message || "La confirmation du compte n’a pas abouti.");
    window.location.replace(`/espace-membre.html?${params.toString()}`);
  } else if (data.session?.user?.email_confirmed_at) {
    const metadata = data.session.user.user_metadata ?? {};
    if (
      metadata.privacy_notice_acknowledged === true &&
      metadata.privacy_notice_version === "2026-11-05" &&
      metadata.organization_name
    ) {
      window.location.replace("/espace-membre.html?confirmed=1");
    }
  }
}
