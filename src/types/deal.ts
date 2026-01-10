/**
 * Deal Workspace Types (V17)
 */

export type DealStatus = 
  | 'discovery'
  | 'nda_signed'
  | 'diligence'
  | 'financing'
  | 'offer'
  | 'closing'
  | 'closed'
  | 'cancelled';

export type DealStage =
  | 'Discovery'
  | 'NDA Signed'
  | 'Diligence'
  | 'Financing'
  | 'Offer'
  | 'Closing';

export type DocType = 
  | 'financial'
  | 'legal'
  | 'operational'
  | 'other';

export type TaskStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PartnerRole = 
  | 'broker'
  | 'lawyer'
  | 'accountant'
  | 'banker'
  | 'advisor'
  | 'other';

export type PartnerStatus = 
  | 'pending'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface Deal {
  id: string;
  user_id: string;
  listing_id: string;
  status: DealStatus;
  created_at: string;
  updated_at: string;
  // Optional joined data
  listing?: {
    id: string;
    title: string | null;
    asking_price: number | null;
    hero_image_url: string | null;
  };
}

export interface DealDocument {
  id: string;
  deal_id: string;
  file_path: string;
  file_name: string;
  doc_type: DocType;
  created_at: string;
  uploaded_by?: string;
  file_size?: number;
}

export interface DealTask {
  id: string;
  deal_id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
}

export interface DealPartner {
  id: string;
  deal_id: string;
  partner_id: string;
  role: PartnerRole;
  status: PartnerStatus;
  created_at: string;
  updated_at: string;
  // Optional joined data
  partner?: {
    id: string;
    name: string;
    email: string;
    company?: string | null;
  };
}

export interface AiAnalysisSummary {
  growth_score: number;
  risk_score: number;
  executive_summary: string;
  key_highlights: string[];
  updated_at: string;
}

export interface DealWorkspaceData {
  deal: Deal;
  documents: DealDocument[];
  tasks: DealTask[];
  partners: DealPartner[];
  aiAnalysis?: AiAnalysisSummary | null;
}
