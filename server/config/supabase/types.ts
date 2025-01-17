export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string
          last_name?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          scheduled_at: string
          status: string
          customer_id: string
          service_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          scheduled_at: string
          status: string
          customer_id: string
          service_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          scheduled_at?: string
          status?: string
          customer_id?: string
          service_id?: string
        }
      }
      payments: {
        Row: {
          id: string
          payment_intent_id: string
          amount: number
          currency: string
          status: string
          created_at: string
          updated_at: string
          booking_id: string
          customer_id: string | null
          service_id: string
        }
        Insert: {
          id?: string
          payment_intent_id: string
          amount: number
          currency: string
          status: string
          created_at?: string
          updated_at?: string
          booking_id: string
          customer_id?: string
          service_id: string
        }
        Update: {
          id?: string
          payment_intent_id?: string
          amount?: number
          currency?: string
          status?: string
          created_at?: string
          updated_at?: string
          booking_id?: string
          customer_id?: string
          service_id?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          duration: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          duration: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          duration?: string
        }
      }
      reviews: {
        Row: {
          id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
          booking_id: string
          customer_id: string
        }
        Insert: {
          id?: string
          rating: number
          comment?: string
          created_at?: string
          updated_at?: string
          booking_id: string
          customer_id: string
        }
        Update: {
          id?: string
          rating?: number
          comment?: string
          created_at?: string
          updated_at?: string
          booking_id?: string
          customer_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
