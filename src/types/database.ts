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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customer_rewards: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          is_redeemed: boolean | null
          redeemed_at: string | null
          restaurant_id: string | null
          reward_text: string
          reward_type: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_redeemed?: boolean | null
          redeemed_at?: string | null
          restaurant_id?: string | null
          reward_text: string
          reward_type: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_redeemed?: boolean | null
          redeemed_at?: string | null
          restaurant_id?: string | null
          reward_text?: string
          reward_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_rewards_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_rewards_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          birthday: string | null
          birthday_set_at: string | null
          created_at: string | null
          email: string
          id: string
          last_visit_at: string | null
          name: string
          phone: string | null
          qr_token: string
          restaurant_id: string
          total_points: number
          total_spent: number | null
          total_visits: number
          updated_at: string | null
        }
        Insert: {
          birthday?: string | null
          birthday_set_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_visit_at?: string | null
          name: string
          phone?: string | null
          qr_token?: string
          restaurant_id: string
          total_points?: number
          total_spent?: number | null
          total_visits?: number
          updated_at?: string | null
        }
        Update: {
          birthday?: string | null
          birthday_set_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_visit_at?: string | null
          name?: string
          phone?: string | null
          qr_token?: string
          restaurant_id?: string
          total_points?: number
          total_spent?: number | null
          total_visits?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_config: {
        Row: {
          amount_divisor: number
          id: string
          points_per_amount: number
          restaurant_id: string
          updated_at: string | null
        }
        Insert: {
          amount_divisor?: number
          id?: string
          points_per_amount?: number
          restaurant_id: string
          updated_at?: string | null
        }
        Update: {
          amount_divisor?: number
          id?: string
          points_per_amount?: number
          restaurant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_config_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_rewards: {
        Row: {
          active: boolean
          created_at: string | null
          id: string
          name: string
          points_required: number
          restaurant_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          id?: string
          name: string
          points_required: number
          restaurant_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string | null
          id?: string
          name?: string
          points_required?: number
          restaurant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_rewards_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_visits: {
        Row: {
          amount: number
          amount_per_person: number | null
          amount_total: number | null
          created_at: string | null
          customer_id: string
          id: string
          party_size: number
          points_earned: number
          registered_by: string | null
          restaurant_id: string
          session_id: string | null
          table_number: string | null
        }
        Insert: {
          amount: number
          amount_per_person?: number | null
          amount_total?: number | null
          created_at?: string | null
          customer_id: string
          id?: string
          party_size?: number
          points_earned?: number
          registered_by?: string | null
          restaurant_id: string
          session_id?: string | null
          table_number?: string | null
        }
        Update: {
          amount?: number
          amount_per_person?: number | null
          amount_total?: number | null
          created_at?: string | null
          customer_id?: string
          id?: string
          party_size?: number
          points_earned?: number
          registered_by?: string | null
          restaurant_id?: string
          session_id?: string | null
          table_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_visits_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_visits_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          active: boolean
          created_at: string | null
          id: string
          name: string
          order: number
          restaurant_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          id?: string
          name: string
          order?: number
          restaurant_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string | null
          id?: string
          name?: string
          order?: number
          restaurant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          active: boolean
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          order: number
          price: number
          restaurant_id: string
          sale_price: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          order?: number
          price: number
          restaurant_id: string
          sale_price?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          order?: number
          price?: number
          restaurant_id?: string
          sale_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_slots: {
        Row: {
          active: boolean
          created_at: string | null
          day_of_week: number
          id: string
          max_capacity: number
          restaurant_id: string
          time: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          day_of_week: number
          id?: string
          max_capacity?: number
          restaurant_id: string
          time: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string | null
          day_of_week?: number
          id?: string
          max_capacity?: number
          restaurant_id?: string
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_slots_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          date: string
          id: string
          notes: string | null
          party_size: number
          restaurant_id: string
          slot_id: string | null
          status: string
          time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          date: string
          id?: string
          notes?: string | null
          party_size: number
          restaurant_id: string
          slot_id?: string | null
          status?: string
          time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          date?: string
          id?: string
          notes?: string | null
          party_size?: number
          restaurant_id?: string
          slot_id?: string | null
          status?: string
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "reservation_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          banner_url: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          featured_dish_id: string | null
          id: string
          logo_url: string | null
          loyalty_birthday_reward_enabled: boolean | null
          loyalty_birthday_reward_text: string | null
          loyalty_stamps_reward_enabled: boolean | null
          loyalty_stamps_reward_text: string | null
          loyalty_stamps_target: number | null
          loyalty_welcome_reward_enabled: boolean | null
          loyalty_welcome_reward_text: string | null
          name: string
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          plan: string
          primary_color: string | null
          slug: string
          social_links: Json | null
          subscription_status: string
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          featured_dish_id?: string | null
          id?: string
          logo_url?: string | null
          loyalty_birthday_reward_enabled?: boolean | null
          loyalty_birthday_reward_text?: string | null
          loyalty_stamps_reward_enabled?: boolean | null
          loyalty_stamps_reward_text?: string | null
          loyalty_stamps_target?: number | null
          loyalty_welcome_reward_enabled?: boolean | null
          loyalty_welcome_reward_text?: string | null
          name: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          plan?: string
          primary_color?: string | null
          slug: string
          social_links?: Json | null
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          featured_dish_id?: string | null
          id?: string
          logo_url?: string | null
          loyalty_birthday_reward_enabled?: boolean | null
          loyalty_birthday_reward_text?: string | null
          loyalty_stamps_reward_enabled?: boolean | null
          loyalty_stamps_reward_text?: string | null
          loyalty_stamps_target?: number | null
          loyalty_welcome_reward_enabled?: boolean | null
          loyalty_welcome_reward_text?: string | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          plan?: string
          primary_color?: string | null
          slug?: string
          social_links?: Json | null
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          external_id: string | null
          id: string
          payment_provider: string | null
          plan: string
          restaurant_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          external_id?: string | null
          id?: string
          payment_provider?: string | null
          plan: string
          restaurant_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          external_id?: string | null
          id?: string
          payment_provider?: string | null
          plan?: string
          restaurant_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admins: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_restaurant_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
