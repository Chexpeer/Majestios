import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emploi et missions professionnelles — MajestiOS",
  description: "Un espace dédié aux missions, collaborations et opportunités professionnelles.",
};

export default function EmploymentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
