import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/appels-offres-publics", destination: "/opportunites/marches-publics", permanent: true },
      { source: "/appels-offres-publics/:id", destination: "/opportunites/marches-publics/:id", permanent: true },
      { source: "/appels-offres-publics/:id/repondre", destination: "/opportunites/marches-publics/:id/repondre", permanent: true },
      { source: "/appels-offres-prives", destination: "/opportunites/marches-prives", permanent: true },
      { source: "/offres-emploi", destination: "/opportunites/emploi/offres", permanent: true },
      { source: "/opportunites/business", destination: "/business", permanent: true },
      { source: "/developpement-commercial/diagnostic-business", destination: "/business/diagnostic", permanent: true },
      { source: "/intelligence-commerciale", destination: "/developpement-commercial", permanent: true },
      { source: "/partenaires", destination: "/reseaux", permanent: true },
      { source: "/e-reputation", destination: "/developpement-commercial/e-reputation", permanent: true },
      { source: "/etudes-de-marche", destination: "/developpement-commercial/etudes-de-marche", permanent: true },
      { source: "/comprendre/faq", destination: "/faq", permanent: true },
      { source: "/comprendre/concept", destination: "/comment-et-pourquoi", permanent: true }
    ];
  }
};
export default nextConfig;
