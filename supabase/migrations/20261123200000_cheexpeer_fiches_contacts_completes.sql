-- Fiches contacts : une seule mission remplit dirigeants, site web, téléphone (Google Maps) et e-mail (site de l'entreprise). Décision du propriétaire, 23/11/2026.
update private.cheexpeer_tool_registry
set description = 'Pour 30 entreprises au plus : dirigeants publiés par l''annuaire officiel ; site web, téléphone et lien Google Maps (Google Places) ; e-mail lu sur le site de l''entreprise. Chaque information garde sa source ; une case vide signifie « non trouvé ». Lecture seule : aucun envoi, aucune écriture métier, validation humaine obligatoire.'
where tool_key = 'fiches_contacts' and version = 1;
