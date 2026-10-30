export type SiteNode = {
  label: string;
  href: string;
  description: string;
  status?: "ready" | "pending_data" | "preparing";
  children?: SiteNode[];
};
