// این فایل به صورت خودکار توسط Supabase CLI تولید می‌شود
// دستور: npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/lib/database.types.ts

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
      users: {
        Row: {
          id: number
          name: string
          email: string | null
          phone: string | null
          password: string
          referral_code: string
          referred_by: number | null
          created_at: string
          is_admin: boolean
          province: string | null
          city: string | null
          postal_code: string | null
          is_active: boolean
          total_discount_earned: number
        }
        Insert: {
          id?: number
          name: string
          email?: string | null
          phone?: string | null
          password: string
          referral_code: string
          referred_by?: number | null
          created_at?: string
          is_admin?: boolean
          province?: string | null
          city?: string | null
          postal_code?: string | null
          is_active?: boolean
          total_discount_earned?: number
        }
        Update: {
          id?: number
          name?: string
          email?: string | null
          phone?: string | null
          password?: string
          referral_code?: string
          referred_by?: number | null
          created_at?: string
          is_admin?: boolean
          province?: string | null
          city?: string | null
          postal_code?: string | null
          is_active?: boolean
          total_discount_earned?: number
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: number
          category_id: number
          name: string
          price: number
          description: string | null
          stock: number
          image_url: string | null
          created_at: string
          featured: boolean
          discount: number
        }
        Insert: {
          id?: number
          category_id: number
          name: string
          price: number
          description?: string | null
          stock?: number
          image_url?: string | null
          created_at?: string
          featured?: boolean
          discount?: number
        }
        Update: {
          id?: number
          category_id?: number
          name?: string
          price?: number
          description?: string | null
          stock?: number
          image_url?: string | null
          created_at?: string
          featured?: boolean
          discount?: number
        }
      }
    }
  }
}
