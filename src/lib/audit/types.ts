export type AuditAction =
  | 'listing_approved'
  | 'listing_suspended'
  | 'listing_removed'
  | 'user_suspended'
  | 'user_banned'
  | 'user_role_changed'
  | 'nda_approved'
  | 'nda_revoked'
  | 'deal_room_created'
  | 'deal_room_closed'
  | 'payment_refunded'
  | 'content_updated'
  | 'system_config_changed'
  | 'other';

export type AuditEvent = {
  id: string;
  actor_id: string | null;
  actor_email?: string | null;
  actor_name?: string | null;
  action: AuditAction;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, any> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
};

export type AuditFilters = {
  actor_id?: string;
  action?: AuditAction | 'all';
  entity_type?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
};


