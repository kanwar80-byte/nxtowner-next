export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "v_user_capabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_analysis: {
        Row: {
          automation_potential: string | null
          executive_summary: string | null
          growth_opportunities: string[] | null
          growth_score: number | null
          is_verified: boolean | null
          key_risks: string[] | null
          last_analyzed_at: string | null
          listing_id: string
          operations_score: number | null
          risk_score: number | null
        }
        Insert: {
          automation_potential?: string | null
          executive_summary?: string | null
          growth_opportunities?: string[] | null
          growth_score?: number | null
          is_verified?: boolean | null
          key_risks?: string[] | null
          last_analyzed_at?: string | null
          listing_id: string
          operations_score?: number | null
          risk_score?: number | null
        }
        Update: {
          automation_potential?: string | null
          executive_summary?: string | null
          growth_opportunities?: string[] | null
          growth_score?: number | null
          is_verified?: boolean | null
          key_risks?: string[] | null
          last_analyzed_at?: string | null
          listing_id?: string
          operations_score?: number | null
          risk_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings_v15_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_listing_analysis: {
        Row: {
          automation_potential_score: number | null
          growth_score: number | null
          listing_id: string
          risk_assessment: string | null
          suggested_improvements: string[] | null
        }
        Insert: {
          automation_potential_score?: number | null
          growth_score?: number | null
          listing_id: string
          risk_assessment?: string | null
          suggested_improvements?: string[] | null
        }
        Update: {
          automation_potential_score?: number | null
          growth_score?: number | null
          listing_id?: string
          risk_assessment?: string | null
          suggested_improvements?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_listing_analysis_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings_old"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          meta: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          meta?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          meta?: Json
        }
        Relationships: []
      }
      capabilities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          requires_verification: boolean
          scope: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          requires_verification?: boolean
          scope: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          requires_verification?: boolean
          scope?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          asset_type: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          asset_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          asset_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      deal_engagement: {
        Row: {
          access_to_data_room: boolean | null
          buyer_id: string
          created_at: string
          current_stage: string
          escrow_transaction_id: string | null
          id: string
          inspection_period_ends_at: string | null
          listing_id_digital: string | null
          listing_id_operational: string | null
          seller_id: string
          site_visit_scheduled_for: string | null
          site_visit_status: string | null
        }
        Insert: {
          access_to_data_room?: boolean | null
          buyer_id: string
          created_at?: string
          current_stage: string
          escrow_transaction_id?: string | null
          id?: string
          inspection_period_ends_at?: string | null
          listing_id_digital?: string | null
          listing_id_operational?: string | null
          seller_id: string
          site_visit_scheduled_for?: string | null
          site_visit_status?: string | null
        }
        Update: {
          access_to_data_room?: boolean | null
          buyer_id?: string
          created_at?: string
          current_stage?: string
          escrow_transaction_id?: string | null
          id?: string
          inspection_period_ends_at?: string | null
          listing_id_digital?: string | null
          listing_id_operational?: string | null
          seller_id?: string
          site_visit_scheduled_for?: string | null
          site_visit_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_engagement_listing_id_digital_fkey"
            columns: ["listing_id_digital"]
            isOneToOne: false
            referencedRelation: "listings_digital"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_engagement_listing_id_operational_fkey"
            columns: ["listing_id_operational"]
            isOneToOne: false
            referencedRelation: "listings_operational"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_messages: {
        Row: {
          content: string
          created_at: string
          deal_id: string
          id: string
          is_system_message: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deal_id: string
          id?: string
          is_system_message?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deal_id?: string
          id?: string
          is_system_message?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_messages_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_engagement"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_participants: {
        Row: {
          deal_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          deal_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          deal_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_participants_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "listings_v15_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_room_members: {
        Row: {
          created_at: string
          deal_room_id: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_room_id: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deal_room_id?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_room_members_deal_room_id_fkey"
            columns: ["deal_room_id"]
            isOneToOne: false
            referencedRelation: "deal_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_rooms: {
        Row: {
          buyer_id: string
          created_at: string
          created_by: string
          id: string
          listing_id: string
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          created_by: string
          id?: string
          listing_id: string
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          created_by?: string
          id?: string
          listing_id?: string
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          buyer_id: string
          created_at: string | null
          current_stage: Database["public"]["Enums"]["deal_stage"] | null
          id: string
          last_activity_date: string | null
          listing_id: string
          loi_status: string | null
          nda_signed: boolean | null
          nda_signed_date: string | null
          seller_id: string
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          current_stage?: Database["public"]["Enums"]["deal_stage"] | null
          id?: string
          last_activity_date?: string | null
          listing_id: string
          loi_status?: string | null
          nda_signed?: boolean | null
          nda_signed_date?: string | null
          seller_id: string
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          current_stage?: Database["public"]["Enums"]["deal_stage"] | null
          id?: string
          last_activity_date?: string | null
          listing_id?: string
          loi_status?: string | null
          nda_signed?: boolean | null
          nda_signed_date?: string | null
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "v_user_capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_old"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "v_user_capabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_data: {
        Row: {
          arr: number | null
          churn_rate: number | null
          domain_authority: number | null
          listing_id: string
          monthly_visitors: number | null
          mrr: number | null
          tech_stack: string[] | null
        }
        Insert: {
          arr?: number | null
          churn_rate?: number | null
          domain_authority?: number | null
          listing_id: string
          monthly_visitors?: number | null
          mrr?: number | null
          tech_stack?: string[] | null
        }
        Update: {
          arr?: number | null
          churn_rate?: number | null
          domain_authority?: number | null
          listing_id?: string
          monthly_visitors?: number | null
          mrr?: number | null
          tech_stack?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_data_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings_v15_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_metrics: {
        Row: {
          arr: number | null
          average_order_value: number | null
          cac: number | null
          churn_rate_percent: number | null
          domain_authority: number | null
          email_subscribers: number | null
          listing_id: string
          ltv: number | null
          monthly_visitors: number | null
          mrr: number | null
          return_rate_percent: number | null
          tech_stack: string[] | null
          traffic_sources: Json | null
        }
        Insert: {
          arr?: number | null
          average_order_value?: number | null
          cac?: number | null
          churn_rate_percent?: number | null
          domain_authority?: number | null
          email_subscribers?: number | null
          listing_id: string
          ltv?: number | null
          monthly_visitors?: number | null
          mrr?: number | null
          return_rate_percent?: number | null
          tech_stack?: string[] | null
          traffic_sources?: Json | null
        }
        Update: {
          arr?: number | null
          average_order_value?: number | null
          cac?: number | null
          churn_rate_percent?: number | null
          domain_authority?: number | null
          email_subscribers?: number | null
          listing_id?: string
          ltv?: number | null
          monthly_visitors?: number | null
          mrr?: number | null
          return_rate_percent?: number | null
          tech_stack?: string[] | null
          traffic_sources?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_metrics_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings_old"
            referencedColumns: ["id"]
          },
        ]
      }
      documents_v15: {
        Row: {
          created_at: string
          deal_id: string
          file_path: string | null
          id: string
          mime_type: string | null
          name: string | null
          size_bytes: number | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          deal_id: string
          file_path?: string | null
          id?: string
          mime_type?: string | null
          name?: string | null
          size_bytes?: number | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          deal_id?: string
          file_path?: string | null
          id?: string
          mime_type?: string | null
          name?: string | null
          size_bytes?: number | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          actor_id: string | null
          created_at: string
          deal_room_id: string | null
          id: string
          listing_id: string | null
          payload: Json
          type: Database["public"]["Enums"]["event_type"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          deal_room_id?: string | null
          id?: string
          listing_id?: string | null
          payload?: Json
          type: Database["public"]["Enums"]["event_type"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          deal_room_id?: string | null
          id?: string
          listing_id?: string | null
          payload?: Json
          type?: Database["public"]["Enums"]["event_type"]
        }
        Relationships: [
          {
            foreignKeyName: "events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "v_user_capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_deal_room_id_fkey"
            columns: ["deal_room_id"]
            isOneToOne: false
            referencedRelation: "deal_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_v15_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          buyer_type: string | null
          created_at: string | null
          deal_id: string
          deal_title: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          status: string | null
        }
        Insert: {
          buyer_type?: string | null
          created_at?: string | null
          deal_id: string
          deal_title?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          buyer_type?: string | null
          created_at?: string | null
          deal_id?: string
          deal_title?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      listing_financials: {
        Row: {
          listing_id: string
          normalized_data: Json
          reported_data: Json
          updated_at: string
        }
        Insert: {
          listing_id: string
          normalized_data?: Json
          reported_data?: Json
          updated_at?: string
        }
        Update: {
          listing_id?: string
          normalized_data?: Json
          reported_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      listing_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean
          listing_id: string
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean
          listing_id: string
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean
          listing_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public_teaser"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public_teaser_v17"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_v16"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_v17_public"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          ai: Json
          ai_admin_flags: string[] | null
          ai_confidence_score: number | null
          ai_cons: string[] | null
          ai_growth_score: number | null
          ai_last_reviewed_at: string | null
          ai_pros: string[] | null
          ai_public_summary: string | null
          ai_risk_score: number | null
          ai_summary: string | null
          ai_valuation_rating: string | null
          asking_multiple_ebitda: number | null
          asking_multiple_revenue: number | null
          asking_multiple_sde: number | null
          asking_price: number | null
          asset_type: string | null
          assumable_loans: boolean | null
          business_status: string | null
          cap_rate_pct: number | null
          cash_flow: number | null
          category: string | null
          category_code: string | null
          category_id: string | null
          city: string | null
          confidentiality_level: string | null
          country: string | null
          created_at: string
          currency: string
          deal_stage: string | null
          deal_structure: string | null
          deal_type: string | null
          debt_balance: number | null
          ebitda: number | null
          equipment_value: number | null
          gross_margin_pct: number | null
          gross_revenue: number | null
          has_existing_debt: boolean | null
          has_liens: boolean | null
          hero_image_url: string | null
          id: string
          image_url: string | null
          inventory_included: boolean | null
          inventory_value: number | null
          is_ai_verified: boolean
          is_remote: boolean
          is_verified_by_ai: boolean | null
          last_activity_at: string | null
          listing_tier: string
          location_city: string | null
          location_province: string | null
          loi_interest_count: number
          meta_data: Json | null
          meta_digital: Json
          meta_operational: Json
          monetization_model: string | null
          mrr: number | null
          nda_requests_count: number
          net_margin_pct: number | null
          noi: number | null
          offers_earnout: boolean | null
          offers_lease_to_own: boolean | null
          offers_vtb: boolean | null
          owner_id: string | null
          postal_code: string | null
          province: string | null
          real_estate_included: boolean | null
          real_estate_value: number | null
          revenue_annual: number | null
          revenue_growth_pct: number | null
          revenue_trend: string | null
          saves_count: number
          sde: number | null
          seller_financing_pct: number | null
          status: string
          subcategory: string | null
          subcategory_code: string | null
          subcategory_id: string | null
          tech_stack: string[] | null
          title: string
          updated_at: string
          verification_level: string
          views_count: number
          visibility_boost: boolean
        }
        Insert: {
          ai?: Json
          ai_admin_flags?: string[] | null
          ai_confidence_score?: number | null
          ai_cons?: string[] | null
          ai_growth_score?: number | null
          ai_last_reviewed_at?: string | null
          ai_pros?: string[] | null
          ai_public_summary?: string | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          ai_valuation_rating?: string | null
          asking_multiple_ebitda?: number | null
          asking_multiple_revenue?: number | null
          asking_multiple_sde?: number | null
          asking_price?: number | null
          asset_type?: string | null
          assumable_loans?: boolean | null
          business_status?: string | null
          cap_rate_pct?: number | null
          cash_flow?: number | null
          category?: string | null
          category_code?: string | null
          category_id?: string | null
          city?: string | null
          confidentiality_level?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          deal_stage?: string | null
          deal_structure?: string | null
          deal_type?: string | null
          debt_balance?: number | null
          ebitda?: number | null
          equipment_value?: number | null
          gross_margin_pct?: number | null
          gross_revenue?: number | null
          has_existing_debt?: boolean | null
          has_liens?: boolean | null
          hero_image_url?: string | null
          id?: string
          image_url?: string | null
          inventory_included?: boolean | null
          inventory_value?: number | null
          is_ai_verified?: boolean
          is_remote?: boolean
          is_verified_by_ai?: boolean | null
          last_activity_at?: string | null
          listing_tier?: string
          location_city?: string | null
          location_province?: string | null
          loi_interest_count?: number
          meta_data?: Json | null
          meta_digital?: Json
          meta_operational?: Json
          monetization_model?: string | null
          mrr?: number | null
          nda_requests_count?: number
          net_margin_pct?: number | null
          noi?: number | null
          offers_earnout?: boolean | null
          offers_lease_to_own?: boolean | null
          offers_vtb?: boolean | null
          owner_id?: string | null
          postal_code?: string | null
          province?: string | null
          real_estate_included?: boolean | null
          real_estate_value?: number | null
          revenue_annual?: number | null
          revenue_growth_pct?: number | null
          revenue_trend?: string | null
          saves_count?: number
          sde?: number | null
          seller_financing_pct?: number | null
          status?: string
          subcategory?: string | null
          subcategory_code?: string | null
          subcategory_id?: string | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
          verification_level?: string
          views_count?: number
          visibility_boost?: boolean
        }
        Update: {
          ai?: Json
          ai_admin_flags?: string[] | null
          ai_confidence_score?: number | null
          ai_cons?: string[] | null
          ai_growth_score?: number | null
          ai_last_reviewed_at?: string | null
          ai_pros?: string[] | null
          ai_public_summary?: string | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          ai_valuation_rating?: string | null
          asking_multiple_ebitda?: number | null
          asking_multiple_revenue?: number | null
          asking_multiple_sde?: number | null
          asking_price?: number | null
          asset_type?: string | null
          assumable_loans?: boolean | null
          business_status?: string | null
          cap_rate_pct?: number | null
          cash_flow?: number | null
          category?: string | null
          category_code?: string | null
          category_id?: string | null
          city?: string | null
          confidentiality_level?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          deal_stage?: string | null
          deal_structure?: string | null
          deal_type?: string | null
          debt_balance?: number | null
          ebitda?: number | null
          equipment_value?: number | null
          gross_margin_pct?: number | null
          gross_revenue?: number | null
          has_existing_debt?: boolean | null
          has_liens?: boolean | null
          hero_image_url?: string | null
          id?: string
          image_url?: string | null
          inventory_included?: boolean | null
          inventory_value?: number | null
          is_ai_verified?: boolean
          is_remote?: boolean
          is_verified_by_ai?: boolean | null
          last_activity_at?: string | null
          listing_tier?: string
          location_city?: string | null
          location_province?: string | null
          loi_interest_count?: number
          meta_data?: Json | null
          meta_digital?: Json
          meta_operational?: Json
          monetization_model?: string | null
          mrr?: number | null
          nda_requests_count?: number
          net_margin_pct?: number | null
          noi?: number | null
          offers_earnout?: boolean | null
          offers_lease_to_own?: boolean | null
          offers_vtb?: boolean | null
          owner_id?: string | null
          postal_code?: string | null
          province?: string | null
          real_estate_included?: boolean | null
          real_estate_value?: number | null
          revenue_annual?: number | null
          revenue_growth_pct?: number | null
          revenue_trend?: string | null
          saves_count?: number
          sde?: number | null
          seller_financing_pct?: number | null
          status?: string
          subcategory?: string | null
          subcategory_code?: string | null
          subcategory_id?: string | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
          verification_level?: string
          views_count?: number
          visibility_boost?: boolean
        }
        Relationships: []
      }
      listings_digital: {
        Row: {
          active_users_daily_dau: number | null
          admin_verified: boolean | null
          advertising_spend_monthly: number | null
          ai_code_quality_score: number | null
          ai_sustainability_score: number | null
          api_calls_monthly_volume: number | null
          asking_price: number | null
          average_order_value_aov: number | null
          category: string
          churn_rate_percent: number | null
          client_concentration_max_percent: number | null
          content_articles_count: number | null
          created_at: string
          customer_acquisition_cost_cac: number | null
          date_established: string | null
          domain_authority: number | null
          domain_authority_moz: number | null
          email_subscribers: number | null
          fulfillment_method: string | null
          gross_revenue_annual: number | null
          growth_rate_yoy: number | null
          id: string
          lifetime_value_ltv: number | null
          listing_title: string
          monthly_unique_visitors: number | null
          mrr_current: number | null
          net_profit_annual: number | null
          newsletter_open_rate: number | null
          newsletter_subscribers: number | null
          retainer_clients_count: number | null
          return_rate_percent: number | null
          sku_count: number | null
          status: string | null
          subcategory: string | null
          team_size_fulltime: number | null
          tech_stack: string[] | null
          tech_stack_backend: string | null
          tech_stack_frontend: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          active_users_daily_dau?: number | null
          admin_verified?: boolean | null
          advertising_spend_monthly?: number | null
          ai_code_quality_score?: number | null
          ai_sustainability_score?: number | null
          api_calls_monthly_volume?: number | null
          asking_price?: number | null
          average_order_value_aov?: number | null
          category: string
          churn_rate_percent?: number | null
          client_concentration_max_percent?: number | null
          content_articles_count?: number | null
          created_at?: string
          customer_acquisition_cost_cac?: number | null
          date_established?: string | null
          domain_authority?: number | null
          domain_authority_moz?: number | null
          email_subscribers?: number | null
          fulfillment_method?: string | null
          gross_revenue_annual?: number | null
          growth_rate_yoy?: number | null
          id?: string
          lifetime_value_ltv?: number | null
          listing_title: string
          monthly_unique_visitors?: number | null
          mrr_current?: number | null
          net_profit_annual?: number | null
          newsletter_open_rate?: number | null
          newsletter_subscribers?: number | null
          retainer_clients_count?: number | null
          return_rate_percent?: number | null
          sku_count?: number | null
          status?: string | null
          subcategory?: string | null
          team_size_fulltime?: number | null
          tech_stack?: string[] | null
          tech_stack_backend?: string | null
          tech_stack_frontend?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          active_users_daily_dau?: number | null
          admin_verified?: boolean | null
          advertising_spend_monthly?: number | null
          ai_code_quality_score?: number | null
          ai_sustainability_score?: number | null
          api_calls_monthly_volume?: number | null
          asking_price?: number | null
          average_order_value_aov?: number | null
          category?: string
          churn_rate_percent?: number | null
          client_concentration_max_percent?: number | null
          content_articles_count?: number | null
          created_at?: string
          customer_acquisition_cost_cac?: number | null
          date_established?: string | null
          domain_authority?: number | null
          domain_authority_moz?: number | null
          email_subscribers?: number | null
          fulfillment_method?: string | null
          gross_revenue_annual?: number | null
          growth_rate_yoy?: number | null
          id?: string
          lifetime_value_ltv?: number | null
          listing_title?: string
          monthly_unique_visitors?: number | null
          mrr_current?: number | null
          net_profit_annual?: number | null
          newsletter_open_rate?: number | null
          newsletter_subscribers?: number | null
          retainer_clients_count?: number | null
          return_rate_percent?: number | null
          sku_count?: number | null
          status?: string | null
          subcategory?: string | null
          team_size_fulltime?: number | null
          tech_stack?: string[] | null
          tech_stack_backend?: string | null
          tech_stack_frontend?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      listings_old: {
        Row: {
          asking_price: number | null
          asset_type: string | null
          cash_flow: number | null
          category: string | null
          city: string | null
          created_at: string | null
          ebitda: number | null
          financials_summary: Json | null
          full_pnl_url: string | null
          gross_revenue: number | null
          id: string
          lane: Database["public"]["Enums"]["listing_lane"]
          location_city: string | null
          location_province: string | null
          owner_id: string | null
          price: number | null
          private_address: string | null
          province: string | null
          status: string | null
          subcategory: string | null
          teaser_summary: string | null
          title: string
        }
        Insert: {
          asking_price?: number | null
          asset_type?: string | null
          cash_flow?: number | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          ebitda?: number | null
          financials_summary?: Json | null
          full_pnl_url?: string | null
          gross_revenue?: number | null
          id?: string
          lane?: Database["public"]["Enums"]["listing_lane"]
          location_city?: string | null
          location_province?: string | null
          owner_id?: string | null
          price?: number | null
          private_address?: string | null
          province?: string | null
          status?: string | null
          subcategory?: string | null
          teaser_summary?: string | null
          title: string
        }
        Update: {
          asking_price?: number | null
          asset_type?: string | null
          cash_flow?: number | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          ebitda?: number | null
          financials_summary?: Json | null
          full_pnl_url?: string | null
          gross_revenue?: number | null
          id?: string
          lane?: Database["public"]["Enums"]["listing_lane"]
          location_city?: string | null
          location_province?: string | null
          owner_id?: string | null
          price?: number | null
          private_address?: string | null
          province?: string | null
          status?: string | null
          subcategory?: string | null
          teaser_summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_user_capabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      listings_operational: {
        Row: {
          address_line_1: string | null
          admin_verified: boolean | null
          ai_risk_score: number | null
          ai_valuation_high: number | null
          ai_valuation_low: number | null
          asking_price: number | null
          building_size_sqft: number | null
          cap_rate: number | null
          car_wash_type: string | null
          category: string
          ceiling_clear_height_feet: number | null
          city: string
          created_at: string
          delivery_sales_percent: number | null
          drive_thru_lane_count: number | null
          employees_count: number | null
          environmental_phase_status: string | null
          ev_level_2_chargers_count: number | null
          ev_level_3_chargers_count: number | null
          fuel_supply_contract_expiry: string | null
          fuel_volume_annual_liters: number | null
          grid_capacity_kw: number | null
          gross_revenue_annual: number | null
          id: string
          inventory_value: number | null
          lease_expiry_date: string | null
          listing_title: string
          loading_docks_count: number | null
          membership_count: number | null
          net_rentable_area_sqft: number | null
          noi_annual: number | null
          occupancy_rate_percent: number | null
          outside_storage_permitted: boolean | null
          postal_code: string | null
          power_amps: number | null
          province: string
          pump_count: number | null
          seating_capacity: number | null
          site_size_acres: number | null
          status: string | null
          subcategory: string | null
          traffic_count_daily: number | null
          tunnel_length_feet: number | null
          user_id: string
          vacuum_stations_count: number | null
          walt_years: number | null
          wash_volume_annual_cars: number | null
          water_reclaim_system: boolean | null
          years_in_operation: number | null
          zoning_code: string | null
        }
        Insert: {
          address_line_1?: string | null
          admin_verified?: boolean | null
          ai_risk_score?: number | null
          ai_valuation_high?: number | null
          ai_valuation_low?: number | null
          asking_price?: number | null
          building_size_sqft?: number | null
          cap_rate?: number | null
          car_wash_type?: string | null
          category: string
          ceiling_clear_height_feet?: number | null
          city: string
          created_at?: string
          delivery_sales_percent?: number | null
          drive_thru_lane_count?: number | null
          employees_count?: number | null
          environmental_phase_status?: string | null
          ev_level_2_chargers_count?: number | null
          ev_level_3_chargers_count?: number | null
          fuel_supply_contract_expiry?: string | null
          fuel_volume_annual_liters?: number | null
          grid_capacity_kw?: number | null
          gross_revenue_annual?: number | null
          id?: string
          inventory_value?: number | null
          lease_expiry_date?: string | null
          listing_title: string
          loading_docks_count?: number | null
          membership_count?: number | null
          net_rentable_area_sqft?: number | null
          noi_annual?: number | null
          occupancy_rate_percent?: number | null
          outside_storage_permitted?: boolean | null
          postal_code?: string | null
          power_amps?: number | null
          province: string
          pump_count?: number | null
          seating_capacity?: number | null
          site_size_acres?: number | null
          status?: string | null
          subcategory?: string | null
          traffic_count_daily?: number | null
          tunnel_length_feet?: number | null
          user_id: string
          vacuum_stations_count?: number | null
          walt_years?: number | null
          wash_volume_annual_cars?: number | null
          water_reclaim_system?: boolean | null
          years_in_operation?: number | null
          zoning_code?: string | null
        }
        Update: {
          address_line_1?: string | null
          admin_verified?: boolean | null
          ai_risk_score?: number | null
          ai_valuation_high?: number | null
          ai_valuation_low?: number | null
          asking_price?: number | null
          building_size_sqft?: number | null
          cap_rate?: number | null
          car_wash_type?: string | null
          category?: string
          ceiling_clear_height_feet?: number | null
          city?: string
          created_at?: string
          delivery_sales_percent?: number | null
          drive_thru_lane_count?: number | null
          employees_count?: number | null
          environmental_phase_status?: string | null
          ev_level_2_chargers_count?: number | null
          ev_level_3_chargers_count?: number | null
          fuel_supply_contract_expiry?: string | null
          fuel_volume_annual_liters?: number | null
          grid_capacity_kw?: number | null
          gross_revenue_annual?: number | null
          id?: string
          inventory_value?: number | null
          lease_expiry_date?: string | null
          listing_title?: string
          loading_docks_count?: number | null
          membership_count?: number | null
          net_rentable_area_sqft?: number | null
          noi_annual?: number | null
          occupancy_rate_percent?: number | null
          outside_storage_permitted?: boolean | null
          postal_code?: string | null
          power_amps?: number | null
          province?: string
          pump_count?: number | null
          seating_capacity?: number | null
          site_size_acres?: number | null
          status?: string | null
          subcategory?: string | null
          traffic_count_daily?: number | null
          tunnel_length_feet?: number | null
          user_id?: string
          vacuum_stations_count?: number | null
          walt_years?: number | null
          wash_volume_annual_cars?: number | null
          water_reclaim_system?: boolean | null
          years_in_operation?: number | null
          zoning_code?: string | null
        }
        Relationships: []
      }
      listings_v15_legacy: {
        Row: {
          ai: Json
          ai_growth_score: number | null
          ai_risk_score: number | null
          ai_summary: string | null
          asking_multiple_ebitda: number | null
          asking_multiple_revenue: number | null
          asking_multiple_sde: number | null
          asking_price: number | null
          asset_type: string
          assumable_loans: boolean
          business_status: string | null
          cap_rate_pct: number | null
          cash_flow: number | null
          category: string
          category_id: string | null
          city: string | null
          confidentiality_level: string
          country: string | null
          created_at: string | null
          currency: string
          deal_stage: string
          deal_structure: string | null
          debt_balance: number | null
          ebitda: number | null
          equipment_value: number | null
          gross_margin_pct: number | null
          gross_revenue: number | null
          has_existing_debt: boolean
          has_liens: boolean
          hero_image_url: string | null
          id: string
          inventory_included: boolean
          inventory_value: number | null
          is_remote: boolean
          last_activity_at: string | null
          listing_tier: string
          location_city: string | null
          location_province: string | null
          loi_interest_count: number
          meta_digital: Json
          meta_operational: Json
          nda_requests_count: number
          net_margin_pct: number | null
          noi: number | null
          offers_earnout: boolean
          offers_lease_to_own: boolean
          offers_vtb: boolean
          owner_id: string | null
          ownership_structure: string | null
          postal_code: string | null
          province: string | null
          real_estate_included: boolean
          real_estate_value: number | null
          reason_for_sale: string | null
          revenue_annual: number | null
          revenue_growth_pct: number | null
          revenue_trend: string | null
          saves_count: number
          sde: number | null
          seller_financing_pct: number | null
          status: string
          subcategory: string
          subcategory_id: string | null
          title: string
          updated_at: string
          verification_level: string
          views_count: number
          visibility_boost: string | null
        }
        Insert: {
          ai?: Json
          ai_growth_score?: number | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          asking_multiple_ebitda?: number | null
          asking_multiple_revenue?: number | null
          asking_multiple_sde?: number | null
          asking_price?: number | null
          asset_type: string
          assumable_loans?: boolean
          business_status?: string | null
          cap_rate_pct?: number | null
          cash_flow?: number | null
          category: string
          category_id?: string | null
          city?: string | null
          confidentiality_level?: string
          country?: string | null
          created_at?: string | null
          currency?: string
          deal_stage?: string
          deal_structure?: string | null
          debt_balance?: number | null
          ebitda?: number | null
          equipment_value?: number | null
          gross_margin_pct?: number | null
          gross_revenue?: number | null
          has_existing_debt?: boolean
          has_liens?: boolean
          hero_image_url?: string | null
          id?: string
          inventory_included?: boolean
          inventory_value?: number | null
          is_remote?: boolean
          last_activity_at?: string | null
          listing_tier?: string
          location_city?: string | null
          location_province?: string | null
          loi_interest_count?: number
          meta_digital?: Json
          meta_operational?: Json
          nda_requests_count?: number
          net_margin_pct?: number | null
          noi?: number | null
          offers_earnout?: boolean
          offers_lease_to_own?: boolean
          offers_vtb?: boolean
          owner_id?: string | null
          ownership_structure?: string | null
          postal_code?: string | null
          province?: string | null
          real_estate_included?: boolean
          real_estate_value?: number | null
          reason_for_sale?: string | null
          revenue_annual?: number | null
          revenue_growth_pct?: number | null
          revenue_trend?: string | null
          saves_count?: number
          sde?: number | null
          seller_financing_pct?: number | null
          status?: string
          subcategory: string
          subcategory_id?: string | null
          title: string
          updated_at?: string
          verification_level?: string
          views_count?: number
          visibility_boost?: string | null
        }
        Update: {
          ai?: Json
          ai_growth_score?: number | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          asking_multiple_ebitda?: number | null
          asking_multiple_revenue?: number | null
          asking_multiple_sde?: number | null
          asking_price?: number | null
          asset_type?: string
          assumable_loans?: boolean
          business_status?: string | null
          cap_rate_pct?: number | null
          cash_flow?: number | null
          category?: string
          category_id?: string | null
          city?: string | null
          confidentiality_level?: string
          country?: string | null
          created_at?: string | null
          currency?: string
          deal_stage?: string
          deal_structure?: string | null
          debt_balance?: number | null
          ebitda?: number | null
          equipment_value?: number | null
          gross_margin_pct?: number | null
          gross_revenue?: number | null
          has_existing_debt?: boolean
          has_liens?: boolean
          hero_image_url?: string | null
          id?: string
          inventory_included?: boolean
          inventory_value?: number | null
          is_remote?: boolean
          last_activity_at?: string | null
          listing_tier?: string
          location_city?: string | null
          location_province?: string | null
          loi_interest_count?: number
          meta_digital?: Json
          meta_operational?: Json
          nda_requests_count?: number
          net_margin_pct?: number | null
          noi?: number | null
          offers_earnout?: boolean
          offers_lease_to_own?: boolean
          offers_vtb?: boolean
          owner_id?: string | null
          ownership_structure?: string | null
          postal_code?: string | null
          province?: string | null
          real_estate_included?: boolean
          real_estate_value?: number | null
          reason_for_sale?: string | null
          revenue_annual?: number | null
          revenue_growth_pct?: number | null
          revenue_trend?: string | null
          saves_count?: number
          sde?: number | null
          seller_financing_pct?: number | null
          status?: string
          subcategory?: string
          subcategory_id?: string | null
          title?: string
          updated_at?: string
          verification_level?: string
          views_count?: number
          visibility_boost?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      lois: {
        Row: {
          buyer_id: string
          closing_days: number
          conditions: string | null
          created_at: string | null
          deal_id: string
          id: string
          offer_price: number
          status: string | null
        }
        Insert: {
          buyer_id: string
          closing_days: number
          conditions?: string | null
          created_at?: string | null
          deal_id: string
          id?: string
          offer_price: number
          status?: string | null
        }
        Update: {
          buyer_id?: string
          closing_days?: number
          conditions?: string | null
          created_at?: string | null
          deal_id?: string
          id?: string
          offer_price?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lois_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lois_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "v_user_capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lois_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          deal_id: string
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          deal_id: string
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          deal_id?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "v_user_capabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      nda_signatures: {
        Row: {
          deal_room_id: string
          id: string
          pdf_url: string | null
          role: string
          signature_hash: string | null
          signed_at: string
          user_id: string
        }
        Insert: {
          deal_room_id: string
          id?: string
          pdf_url?: string | null
          role: string
          signature_hash?: string | null
          signed_at?: string
          user_id: string
        }
        Update: {
          deal_room_id?: string
          id?: string
          pdf_url?: string | null
          role?: string
          signature_hash?: string | null
          signed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nda_signatures_deal_room_id_fkey"
            columns: ["deal_room_id"]
            isOneToOne: false
            referencedRelation: "deal_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      ndas: {
        Row: {
          buyer_id: string
          id: string
          listing_id: string
          pdf_url: string | null
          seller_id: string | null
          signed_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          id?: string
          listing_id: string
          pdf_url?: string | null
          seller_id?: string | null
          signed_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          id?: string
          listing_id?: string
          pdf_url?: string | null
          seller_id?: string | null
          signed_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ndas_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ndas_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public_teaser"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ndas_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_public_teaser_v17"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ndas_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_v16"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ndas_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_v17_public"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_data: {
        Row: {
          employee_count: number | null
          equipment_value: number | null
          inventory_value: number | null
          lease_expiry: string | null
          listing_id: string
          real_estate_included: boolean | null
          sq_ft: number | null
        }
        Insert: {
          employee_count?: number | null
          equipment_value?: number | null
          inventory_value?: number | null
          lease_expiry?: string | null
          listing_id: string
          real_estate_included?: boolean | null
          sq_ft?: number | null
        }
        Update: {
          employee_count?: number | null
          equipment_value?: number | null
          inventory_value?: number | null
          lease_expiry?: string | null
          listing_id?: string
          real_estate_included?: boolean | null
          sq_ft?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_data_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings_v15_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_metrics: {
        Row: {
          employee_count: number | null
          equipment_list: string[] | null
          franchise_agreement: boolean | null
          lease_expiration: string | null
          listing_id: string
          lot_size_acres: number | null
          monthly_rent: number | null
          operating_hours: string | null
          real_estate_included: boolean | null
          renewable_options: string | null
          square_footage: number | null
          vehicle_count: number | null
          years_in_business: number | null
          zoning_code: string | null
        }
        Insert: {
          employee_count?: number | null
          equipment_list?: string[] | null
          franchise_agreement?: boolean | null
          lease_expiration?: string | null
          listing_id: string
          lot_size_acres?: number | null
          monthly_rent?: number | null
          operating_hours?: string | null
          real_estate_included?: boolean | null
          renewable_options?: string | null
          square_footage?: number | null
          vehicle_count?: number | null
          years_in_business?: number | null
          zoning_code?: string | null
        }
        Update: {
          employee_count?: number | null
          equipment_list?: string[] | null
          franchise_agreement?: boolean | null
          lease_expiration?: string | null
          listing_id?: string
          lot_size_acres?: number | null
          monthly_rent?: number | null
          operating_hours?: string | null
          real_estate_included?: boolean | null
          renewable_options?: string | null
          square_footage?: number | null
          vehicle_count?: number | null
          years_in_business?: number | null
          zoning_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_metrics_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings_old"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          onboarding_status: string | null
          onboarding_step: string | null
          preferred_track: string | null
          profile_meta: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          roles: string[] | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          onboarding_status?: string | null
          onboarding_step?: string | null
          preferred_track?: string | null
          profile_meta?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          roles?: string[] | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          onboarding_status?: string | null
          onboarding_step?: string | null
          preferred_track?: string | null
          profile_meta?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          roles?: string[] | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_capabilities: {
        Row: {
          capability_id: string
          created_at: string
          role_id: string
        }
        Insert: {
          capability_id: string
          created_at?: string
          role_id: string
        }
        Update: {
          capability_id?: string
          created_at?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_capabilities_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_capabilities_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
        }
        Relationships: []
      }
      saved_listings: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_v15_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          breakdown: Json
          entity_id: string
          entity_type: string
          id: string
          scope: string
          score_key: string
          score_value: number
          updated_at: string
        }
        Insert: {
          breakdown?: Json
          entity_id: string
          entity_type: string
          id?: string
          scope?: string
          score_key: string
          score_value?: number
          updated_at?: string
        }
        Update: {
          breakdown?: Json
          entity_id?: string
          entity_type?: string
          id?: string
          scope?: string
          score_key?: string
          score_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategory_fields: {
        Row: {
          created_at: string
          field_group: string
          field_key: string
          field_label: string
          field_type: string
          id: string
          is_ai_input: boolean
          is_filterable: boolean
          is_required: boolean
          options: Json | null
          sort_order: number
          subcategory_id: string
          ui: Json | null
          updated_at: string
          validation: Json | null
        }
        Insert: {
          created_at?: string
          field_group?: string
          field_key: string
          field_label: string
          field_type: string
          id?: string
          is_ai_input?: boolean
          is_filterable?: boolean
          is_required?: boolean
          options?: Json | null
          sort_order?: number
          subcategory_id: string
          ui?: Json | null
          updated_at?: string
          validation?: Json | null
        }
        Update: {
          created_at?: string
          field_group?: string
          field_key?: string
          field_label?: string
          field_type?: string
          id?: string
          is_ai_input?: boolean
          is_filterable?: boolean
          is_required?: boolean
          options?: Json | null
          sort_order?: number
          subcategory_id?: string
          ui?: Json | null
          updated_at?: string
          validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategory_fields_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_categories: {
        Row: {
          asset_type: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          asset_type: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          asset_type?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      tax_requirements: {
        Row: {
          created_at: string
          data_type: string
          field_key: string
          field_label: string
          field_scope: string
          id: string
          is_required: boolean
          notes: string | null
          select_options: Json | null
          sort_order: number
          subcategory_id: string
        }
        Insert: {
          created_at?: string
          data_type: string
          field_key: string
          field_label: string
          field_scope: string
          id?: string
          is_required?: boolean
          notes?: string | null
          select_options?: Json | null
          sort_order?: number
          subcategory_id: string
        }
        Update: {
          created_at?: string
          data_type?: string
          field_key?: string
          field_label?: string
          field_scope?: string
          id?: string
          is_required?: boolean
          notes?: string | null
          select_options?: Json | null
          sort_order?: number
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_requirements_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "tax_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_subcategories: {
        Row: {
          category_id: string
          code: string
          created_at: string
          hero_images: Json
          id: string
          images: Json | null
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          category_id: string
          code: string
          created_at?: string
          hero_images?: Json
          id?: string
          images?: Json | null
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          code?: string
          created_at?: string
          hero_images?: Json
          id?: string
          images?: Json | null
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tax_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      v16_deal_rooms__archive_20251225: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          status: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "v16_deal_rooms_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "v16_listings__archive_20251225"
            referencedColumns: ["id"]
          },
        ]
      }
      v16_events: {
        Row: {
          actor_id: string | null
          created_at: string
          deal_room_id: string | null
          id: string
          listing_id: string | null
          payload: Json
          type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          deal_room_id?: string | null
          id?: string
          listing_id?: string | null
          payload?: Json
          type: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          deal_room_id?: string | null
          id?: string
          listing_id?: string | null
          payload?: Json
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "v16_events_deal_room_id_fkey"
            columns: ["deal_room_id"]
            isOneToOne: false
            referencedRelation: "v16_deal_rooms__archive_20251225"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "v16_events_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "v16_listings__archive_20251225"
            referencedColumns: ["id"]
          },
        ]
      }
      v16_listing_details__archive_20251225: {
        Row: {
          created_at: string
          details: Json
          listing_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: Json
          listing_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: Json
          listing_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "v16_listing_details_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "v16_listings__archive_20251225"
            referencedColumns: ["id"]
          },
        ]
      }
      v16_listing_media__archive_20251225: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "v16_listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "v16_listings__archive_20251225"
            referencedColumns: ["id"]
          },
        ]
      }
      v16_listings__archive_20251225: {
        Row: {
          ai_growth_score: number | null
          ai_risk_score: number | null
          ai_summary: string | null
          asking_price: number | null
          asset_type: string
          cash_flow: number | null
          category: string
          created_at: string
          ebitda: number | null
          gross_revenue: number | null
          hero_image_url: string | null
          id: string
          location_city: string | null
          location_province: string | null
          owner_id: string
          status: string
          subcategory: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_growth_score?: number | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          asking_price?: number | null
          asset_type: string
          cash_flow?: number | null
          category: string
          created_at?: string
          ebitda?: number | null
          gross_revenue?: number | null
          hero_image_url?: string | null
          id?: string
          location_city?: string | null
          location_province?: string | null
          owner_id: string
          status?: string
          subcategory?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_growth_score?: number | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          asking_price?: number | null
          asset_type?: string
          cash_flow?: number | null
          category?: string
          created_at?: string
          ebitda?: number | null
          gross_revenue?: number | null
          hero_image_url?: string | null
          id?: string
          location_city?: string | null
          location_province?: string | null
          owner_id?: string
          status?: string
          subcategory?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      v16_ndas__archive_20251225: {
        Row: {
          buyer_id: string
          created_at: string
          deal_room_id: string
          id: string
          ip: string | null
          signed_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string
          deal_room_id: string
          id?: string
          ip?: string | null
          signed_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string
          deal_room_id?: string
          id?: string
          ip?: string | null
          signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "v16_ndas_deal_room_id_fkey"
            columns: ["deal_room_id"]
            isOneToOne: false
            referencedRelation: "v16_deal_rooms__archive_20251225"
            referencedColumns: ["id"]
          },
        ]
      }
      v16_scores: {
        Row: {
          breakdown: Json
          created_at: string
          listing_id: string
          score: number
          updated_at: string
        }
        Insert: {
          breakdown?: Json
          created_at?: string
          listing_id: string
          score?: number
          updated_at?: string
        }
        Update: {
          breakdown?: Json
          created_at?: string
          listing_id?: string
          score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "v16_scores_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "v16_listings__archive_20251225"
            referencedColumns: ["id"]
          },
        ]
      }
      valuations: {
        Row: {
          created_at: string
          id: string
          input: Json
          result: Json | null
          type: string
          user_id: string
          valuation_cad: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          input: Json
          result?: Json | null
          type: string
          user_id: string
          valuation_cad?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          input?: Json
          result?: Json | null
          type?: string
          user_id?: string
          valuation_cad?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      listings_public_teaser: {
        Row: {
          asking_price: number | null
          asset_type: string | null
          cash_flow: number | null
          category_id: string | null
          city: string | null
          country: string | null
          created_at: string | null
          hero_image_url: string | null
          id: string | null
          province: string | null
          revenue_annual: number | null
          status: string | null
          subcategory_id: string | null
          title: string | null
        }
        Insert: {
          asking_price?: number | null
          asset_type?: never
          cash_flow?: never
          category_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          hero_image_url?: never
          id?: string | null
          province?: string | null
          revenue_annual?: number | null
          status?: string | null
          subcategory_id?: string | null
          title?: string | null
        }
        Update: {
          asking_price?: number | null
          asset_type?: never
          cash_flow?: never
          category_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          hero_image_url?: never
          id?: string | null
          province?: string | null
          revenue_annual?: number | null
          status?: string | null
          subcategory_id?: string | null
          title?: string | null
        }
        Relationships: []
      }
      listings_public_teaser_v17: {
        Row: {
          asking_price: number | null
          asset_type: string | null
          cash_flow: number | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string | null
          hero_image_url: string | null
          id: string | null
          province: string | null
          revenue_annual: number | null
          status: string | null
          subcategory: string | null
          title: string | null
        }
        Insert: {
          asking_price?: number | null
          asset_type?: never
          cash_flow?: never
          category?: never
          city?: string | null
          country?: string | null
          created_at?: string | null
          hero_image_url?: never
          id?: string | null
          province?: string | null
          revenue_annual?: number | null
          status?: string | null
          subcategory?: never
          title?: string | null
        }
        Update: {
          asking_price?: number | null
          asset_type?: never
          cash_flow?: never
          category?: never
          city?: string | null
          country?: string | null
          created_at?: string | null
          hero_image_url?: never
          id?: string | null
          province?: string | null
          revenue_annual?: number | null
          status?: string | null
          subcategory?: never
          title?: string | null
        }
        Relationships: []
      }
      listings_v16: {
        Row: {
          asking_price: number | null
          asset_type: string | null
          cash_flow: number | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string | null
          hero_image_url: string | null
          id: string | null
          province: string | null
          revenue_annual: number | null
          status: string | null
          subcategory: string | null
          title: string | null
        }
        Insert: {
          asking_price?: number | null
          asset_type?: never
          cash_flow?: never
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          hero_image_url?: never
          id?: string | null
          province?: string | null
          revenue_annual?: number | null
          status?: string | null
          subcategory?: string | null
          title?: string | null
        }
        Update: {
          asking_price?: number | null
          asset_type?: never
          cash_flow?: never
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          hero_image_url?: never
          id?: string | null
          province?: string | null
          revenue_annual?: number | null
          status?: string | null
          subcategory?: string | null
          title?: string | null
        }
        Relationships: []
      }
      listings_v17_public: {
        Row: {
          asking_price: number | null
          asset_type: string | null
          cash_flow: number | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string | null
          hero_image_url: string | null
          id: string | null
          province: string | null
          revenue_annual: number | null
          status: string | null
          subcategory: string | null
          title: string | null
        }
        Insert: {
          asking_price?: number | null
          asset_type?: never
          cash_flow?: never
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          hero_image_url?: never
          id?: string | null
          province?: string | null
          revenue_annual?: number | null
          status?: string | null
          subcategory?: string | null
          title?: string | null
        }
        Update: {
          asking_price?: number | null
          asset_type?: never
          cash_flow?: never
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          hero_image_url?: never
          id?: string | null
          province?: string | null
          revenue_annual?: number | null
          status?: string | null
          subcategory?: string | null
          title?: string | null
        }
        Relationships: []
      }
      v_user_capabilities: {
        Row: {
          can_admin: boolean | null
          can_buy: boolean | null
          can_partner: boolean | null
          can_sell: boolean | null
          email: string | null
          has_premium_access: boolean | null
          id: string | null
          is_verified: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          subscription_tier: string | null
        }
        Insert: {
          can_admin?: never
          can_buy?: never
          can_partner?: never
          can_sell?: never
          email?: string | null
          has_premium_access?: never
          id?: string | null
          is_verified?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_tier?: string | null
        }
        Update: {
          can_admin?: never
          can_buy?: never
          can_partner?: never
          can_sell?: never
          email?: string | null
          has_premium_access?: never
          id?: string | null
          is_verified?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_tier?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_deal_room: { Args: { p_listing_id: string }; Returns: Json }
      create_deal_room_with_nda: {
        Args: {
          _buyer_id: string
          _initial_message: string
          _listing_id: string
        }
        Returns: string
      }
      get_admin_kpis: {
        Args: never
        Returns: {
          active_deals: number
          pending_reviews: number
          total_listings: number
          total_users: number
        }[]
      }
      has_capability: {
        Args: { p_key: string; p_user_id: string }
        Returns: boolean
      }
      is_admin: { Args: { uid: string }; Returns: boolean }
      pick_hero_image: { Args: { p_subcategory_id: string }; Returns: string }
      seed_retail_consumer_delta_pack: {
        Args: { p_subcategory_id: string }
        Returns: undefined
      }
      seed_tax_requirement: {
        Args: {
          p_data_type: string
          p_field_key: string
          p_field_label: string
          p_field_scope: string
          p_is_required: boolean
          p_select_options?: Json
          p_subcategory_id: string
        }
        Returns: undefined
      }
      seed_uuid: { Args: { p_key: string }; Returns: string }
    }
    Enums: {
      asset_type: "operational" | "digital"
      asset_type_enum: "Operational" | "Digital"
      deal_stage:
        | "0_discovery"
        | "1_inquiry"
        | "2_nda"
        | "3_discussion"
        | "4_loi"
        | "5_diligence"
        | "6_closing"
        | "7_closed"
      event_type:
        | "listing_created"
        | "listing_published"
        | "nda_requested"
        | "nda_signed"
        | "deal_room_created"
        | "doc_uploaded"
        | "note_added"
        | "message_sent"
        | "stage_changed"
        | "score_updated"
        | "deal_closed"
        | "deal_paused"
      listing_lane: "operational" | "digital"
      listing_status: "draft" | "published" | "paused" | "archived"
      nda_status: "requested" | "signed" | "revoked"
      user_role: "buyer" | "seller" | "broker" | "admin" | "partner" | "founder"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_type: ["operational", "digital"],
      asset_type_enum: ["Operational", "Digital"],
      deal_stage: [
        "0_discovery",
        "1_inquiry",
        "2_nda",
        "3_discussion",
        "4_loi",
        "5_diligence",
        "6_closing",
        "7_closed",
      ],
      event_type: [
        "listing_created",
        "listing_published",
        "nda_requested",
        "nda_signed",
        "deal_room_created",
        "doc_uploaded",
        "note_added",
        "message_sent",
        "stage_changed",
        "score_updated",
        "deal_closed",
        "deal_paused",
      ],
      listing_lane: ["operational", "digital"],
      listing_status: ["draft", "published", "paused", "archived"],
      nda_status: ["requested", "signed", "revoked"],
      user_role: ["buyer", "seller", "broker", "admin", "partner", "founder"],
    },
  },
} as const