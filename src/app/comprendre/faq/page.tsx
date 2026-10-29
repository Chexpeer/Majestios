import { redirect } from "next/navigation";

// La FAQ détaillée existe déjà à /faq ; conserver cette URL de navigation sans dupliquer son contenu.
export default function FaqRoute() {
  redirect("/faq");
}
