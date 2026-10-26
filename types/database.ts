export type UUID = string;

export type OpportunityStage =
  | "detected"
  | "qualified"
  | "contacted"
  | "meeting"
  | "proposal"
  | "won"
  | "lost";

export type AppRole =
  | "SUPER_ADMIN"
  | "TENANT_ADMIN"
  | "BUSINESS_DEVELOPER"
  | "COACH"
  | "MEMBER";

export interface OpportunitySummary {
  id: UUID;
  title: string;
  company: string;
  stage: OpportunityStage;
  score: number;
  source: string;
  updatedAt: string;
}
