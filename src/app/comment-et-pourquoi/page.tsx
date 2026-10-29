import { redirect } from "next/navigation";

// URL historique : le concept officiel est centralisé dans « Comprendre MajestiOS ».
export default function LegacyConceptRedirect() {
  redirect("/comprendre/concept");
}
