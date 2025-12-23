export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          role: 'buyer' | 'seller' | 'broker' | 'admin'
          full_name: string | null
          company_name: string | null
          subscription_tier: string
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: 'buyer' | 'seller' | 'broker' | 'admin'
          full_name?: string | null
          company_name?: string | null
          subscription_tier?: string
          is_verified?: boolean
        }
        Update: {
          id?: string
          email?: string | null
          role?: 'buyer' | 'seller' | 'broker' | 'admin'
          full_name?: string | null
          company_name?: string | null
          subscription_tier?: string
          is_verified?: boolean
        }
      }
      listings: {
        Row: {
          id: string
          owner_id: string | null
          title: string
          lane: 'operational' | 'digital'
          teaser_summary: string | null
          price: number | null
          location_city: string | null
          location_province: string | null
          private_address: string | null
          financials_summary: Json | null
          status: string
          created_at: string
        }
      }
      deals: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          seller_id: string
          current_stage: 
            | '0_discovery' 
            | '1_inquiry' 
            | '2_nda' 
            | '3_discussion' 
            | '4_loi' 
            | '5_diligence' 
            | '6_closing' 
            | '7_closed'
          nda_signed: boolean
          loi_status: string
          created_at: string
        }
      }
    }
  }
}
