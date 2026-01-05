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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          calendly_link: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          preferred_dates: Json | null
          status: string | null
          topic: string
        }
        Insert: {
          calendly_link?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          preferred_dates?: Json | null
          status?: string | null
          topic: string
        }
        Update: {
          calendly_link?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_dates?: Json | null
          status?: string | null
          topic?: string
        }
        Relationships: []
      }
      assets_links: {
        Row: {
          created_at: string
          id: string
          label: string
          project_id: string | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          project_id?: string | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          project_id?: string | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          admin_id: string | null
          approved_at: string | null
          client_email: string
          client_name: string | null
          client_user_id: string | null
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_id: string | null
          services: Json
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          admin_id?: string | null
          approved_at?: string | null
          client_email: string
          client_name?: string | null
          client_user_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_id?: string | null
          services?: Json
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          admin_id?: string | null
          approved_at?: string | null
          client_email?: string
          client_name?: string | null
          client_user_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_id?: string | null
          services?: Json
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_messages: {
        Row: {
          category: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          category?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          budget_range: string | null
          business_type: string | null
          created_at: string
          email: string
          goal: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          service_type: string
          source: string | null
          status: string | null
          urgency: string | null
        }
        Insert: {
          budget_range?: string | null
          business_type?: string | null
          created_at?: string
          email: string
          goal?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          service_type: string
          source?: string | null
          status?: string | null
          urgency?: string | null
        }
        Update: {
          budget_range?: string | null
          business_type?: string | null
          created_at?: string
          email?: string
          goal?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          service_type?: string
          source?: string | null
          status?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      maintenance_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          project_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          discount_applied: number | null
          id: string
          payment_method: string
          promo_code: string | null
          service_type: string
          status: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          discount_applied?: number | null
          id?: string
          payment_method: string
          promo_code?: string | null
          service_type: string
          status?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          discount_applied?: number | null
          id?: string
          payment_method?: string
          promo_code?: string | null
          service_type?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          referral_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          referral_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          referral_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          end_date: string | null
          id: string
          milestone_type: string
          notes: string | null
          project_id: string | null
          start_date: string | null
          status: string | null
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          milestone_type: string
          notes?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          milestone_type?: string
          notes?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          domain_status: string | null
          estimated_end_date: string | null
          hosting_status: string | null
          id: string
          last_backup_date: string | null
          maintenance_active: boolean | null
          max_revisions: number | null
          name: string
          next_maintenance_date: string | null
          notes: string | null
          payment_id: string | null
          revisions_used: number | null
          service_type: string
          ssl_status: string | null
          start_date: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          domain_status?: string | null
          estimated_end_date?: string | null
          hosting_status?: string | null
          id?: string
          last_backup_date?: string | null
          maintenance_active?: boolean | null
          max_revisions?: number | null
          name: string
          next_maintenance_date?: string | null
          notes?: string | null
          payment_id?: string | null
          revisions_used?: number | null
          service_type: string
          ssl_status?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          domain_status?: string | null
          estimated_end_date?: string | null
          hosting_status?: string | null
          id?: string
          last_backup_date?: string | null
          maintenance_active?: boolean | null
          max_revisions?: number | null
          name?: string
          next_maintenance_date?: string | null
          notes?: string | null
          payment_id?: string | null
          revisions_used?: number | null
          service_type?: string
          ssl_status?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          discount_earned: number | null
          free_marketing_earned: boolean | null
          id: string
          referral_code: string
          referred_email: string | null
          referred_user_id: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          discount_earned?: number | null
          free_marketing_earned?: boolean | null
          id?: string
          referral_code: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          discount_earned?: number | null
          free_marketing_earned?: boolean | null
          id?: string
          referral_code?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      revision_requests: {
        Row: {
          admin_response: string | null
          created_at: string
          description: string
          id: string
          project_id: string | null
          resolved_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          description: string
          id?: string
          project_id?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          description?: string
          id?: string
          project_id?: string | null
          resolved_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revision_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revision_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      security_assessments: {
        Row: {
          checklist: Json | null
          created_at: string
          id: string
          project_id: string | null
          report_date: string | null
          report_url: string | null
          scope_summary: string | null
          status: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          checklist?: Json | null
          created_at?: string
          id?: string
          project_id?: string | null
          report_date?: string | null
          report_url?: string | null
          scope_summary?: string | null
          status?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          checklist?: Json | null
          created_at?: string
          id?: string
          project_id?: string | null
          report_date?: string | null
          report_url?: string | null
          scope_summary?: string | null
          status?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_assessments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      success_stories: {
        Row: {
          author: string | null
          content: string | null
          created_at: string
          description: string
          featured: boolean | null
          id: string
          image_url: string | null
          published: boolean | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string
          description: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string
          description?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string
          email: string | null
          id: string
          message: string
          name: string | null
          phone: string | null
          priority: string | null
          status: string | null
          subject: string
          ticket_number: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          category: string
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name?: string | null
          phone?: string | null
          priority?: string | null
          status?: string | null
          subject: string
          ticket_number?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string | null
          phone?: string | null
          priority?: string | null
          status?: string | null
          subject?: string
          ticket_number?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
