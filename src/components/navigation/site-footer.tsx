import Link from "next/link";

const groups = [
  { title: "Explorer", links: [
    { href: "/#recherche", label: "Marchés publics" },
    { href: "/appels-offres-prives", label: "Opportunités privées" },
    { href: "/reseaux", label: "Réseaux professionnels" },
  ]},
  { title: "Comprendre", links: [
    { href: "/comment-et-pourquoi", label: "Le concept MajestiOS" },
    { href: "/aide/faq", label: "FAQ" },
  ]},
  { title: "Participer", links: [
    { href: "/nous-rejoindre", label: "Nous rejoindre" },
    { href: "/espace-membre", label: "Espace membre" },
  ]},
  { title: "Informations", links: [
    { href: "/mentions-legales", label: "Mentions légales" },
  ]},
];

export default function SiteFooter() {
  return <footer className="public-footer site-footer">
    <Link className="footer-brand" href="/">MajestiOS</Link>
    <div className="footer-links">
      {groups.map(group => <div key={group.title}>
        <strong>{group.title}</strong>
        {group.links.map(link => <Link key={link.href + link.label} href={link.href}>{link.label}</Link>)}
      </div>)}
    </div>
    <small>© MajestiOS · Plateforme en développement. Les fonctions signalées comme prévues ne sont pas encore disponibles.</small>
  </footer>;
}
