-- Cheexpeer — premier handler métier de diagnostic local, strictement en lecture seule.
-- Préparation versionnée : ne pas appliquer sans recette ciblée sur MajestiOS-Test.
-- Le registre reste désactivé ; aucune mission de ce type ne peut être réclamée avant activation explicite.

insert into private.cheexpeer_tool_registry (
  tool_key,
  version,
  display_name,
  description,
  input_schema,
  output_schema,
  autonomy_max,
  requires_approval,
  effects,
  enabled,
  timeout_seconds,
  max_cost
)
values (
  'worker_self_check',
  1,
  'Diagnostic de disponibilité du worker',
  'Vérifie le runtime Node, l’identité technique du worker, le format de son endpoint Supabase et la validité du bail de mission. Aucun accès aux données métier, aucune écriture métier, aucun appel à un tiers.',
  '{"type":"object","additionalProperties":false,"properties":{}}'::jsonb,
  '{"type":"object","additionalProperties":false,"required":["status","checks","external_effects","secrets_exposed","checked_at"],"properties":{"status":{"type":"string","enum":["passed","attention_required"]},"checks":{"type":"array","maxItems":4},"external_effects":{"type":"boolean","const":false},"secrets_exposed":{"type":"boolean","const":false},"checked_at":{"type":"string","format":"date-time"}}}'::jsonb,
  0,
  true,
  'read',
  false,
  15,
  0
)
on conflict (tool_key, version) do nothing;

