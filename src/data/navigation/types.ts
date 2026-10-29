export type SiteNode = {
  label: string;
  href: string;
  description: string;
  status?: "ready" | "preparing";
  children?: SiteNode[];
};
