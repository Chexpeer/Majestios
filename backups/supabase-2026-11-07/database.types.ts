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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          actor_user_id: string | null
          body: string | null
          business_id: string | null
          contact_id: string | null
          created_at: string
          id: string
          metadata: Json
          occurred_at: string
          opportunity_id: string | null
          organization_id: string
          subject: string
        }
        Insert: {
          activity_type: string
          actor_user_id?: string | null
          body?: string | null
          business_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          opportunity_id?: string | null
          organization_id: string
          subject: string
        }
        Update: {
          activity_type?: string
          actor_user_id?: string | null
          body?: string | null
          business_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          opportunity_id?: string | null
          organization_id?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address_line: string | null
          ape_naf: string | null
          assigned_to: string | null
          city: string | null
          country_code: string
          created_at: string
          created_by: string | null
          department_code: string | null
          id: string
          legal_name: string
          organization_id: string
          postal_code: string | null
          qualification_notes: string | null
          qualification_status: string
          siren: string | null
          siret: string | null
          source_label: string | null
          source_url: string | null
          trade_name: string | null
          updated_at: string
          vat_number: string | null
          website: string | null
        }
        Insert: {
          address_line?: string | null
          ape_naf?: string | null
          assigned_to?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          created_by?: string | null
          department_code?: string | null
          id?: string
          legal_name: string
          organization_id: string
          postal_code?: string | null
          qualification_notes?: string | null
          qualification_status?: string
          siren?: string | null
          siret?: string | null
          source_label?: string | null
          source_url?: string | null
          trade_name?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          address_line?: string | null
          ape_naf?: string | null
          assigned_to?: string | null
          city?: string | null
          country_code?: string
          created_at?: string
          created_by?: string | null
          department_code?: string | null
          id?: string
          legal_name?: string
          organization_id?: string
          postal_code?: string | null
          qualification_notes?: string | null
          qualification_status?: string
          siren?: string | null
          siret?: string | null
          source_label?: string | null
          source_url?: string | null
          trade_name?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_requests: {
        Row: {
          consent_recorded_at: string | null
          contact_snapshot: Json
          created_at: string
          created_by: string | null
          id: string
          message: string | null
          organization_id: string
          privacy_notice_version: string | null
          request_type: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          consent_recorded_at?: string | null
          contact_snapshot?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string | null
          organization_id: string
          privacy_notice_version?: string | null
          request_type: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          consent_recorded_at?: string | null
          contact_snapshot?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string | null
          organization_id?: string
          privacy_notice_version?: string | null
          request_type?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          business_id: string | null
          consent_status: string
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string | null
          id: string
          is_primary: boolean
          job_title: string | null
          last_name: string
          organization_id: string
          phone: string | null
          source_label: string | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          consent_status?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_primary?: boolean
          job_title?: string | null
          last_name: string
          organization_id: string
          phone?: string | null
          source_label?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          consent_status?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_primary?: boolean
          job_title?: string | null
          last_name?: string
          organization_id?: string
          phone?: string | null
          source_label?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_reminders: {
        Row: {
          action: string
          cancelled_at: string | null
          created_at: string
          due_at: string
          id: string
          opportunity_id: string
          organization_id: string
          read_at: string | null
          state: string
          title: string
        }
        Insert: {
          action: string
          cancelled_at?: string | null
          created_at?: string
          due_at: string
          id?: string
          opportunity_id: string
          organization_id: string
          read_at?: string | null
          state?: string
          title: string
        }
        Update: {
          action?: string
          cancelled_at?: string | null
          created_at?: string
          due_at?: string
          id?: string
          opportunity_id?: string
          organization_id?: string
          read_at?: string | null
          state?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_reminders_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reminders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          assigned_to: string | null
          business_id: string | null
          created_at: string
          created_by: string | null
          department_code: string | null
          description: string | null
          id: string
          next_action: string | null
          next_action_at: string | null
          organization_id: string
          primary_contact_id: string | null
          qualification_score: number | null
          qualification_summary: string | null
          source_external_id: string | null
          source_published_at: string | null
          source_type: string
          source_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          business_id?: string | null
          created_at?: string
          created_by?: string | null
          department_code?: string | null
          description?: string | null
          id?: string
          next_action?: string | null
          next_action_at?: string | null
          organization_id: string
          primary_contact_id?: string | null
          qualification_score?: number | null
          qualification_summary?: string | null
          source_external_id?: string | null
          source_published_at?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          business_id?: string | null
          created_at?: string
          created_by?: string | null
          department_code?: string | null
          description?: string | null
          id?: string
          next_action?: string | null
          next_action_at?: string | null
          organization_id?: string
          primary_contact_id?: string | null
          qualification_score?: number | null
          qualification_summary?: string | null
          source_external_id?: string | null
          source_published_at?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          kind: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      privacy_acknowledgments: {
        Row: {
          acknowledged_at: string
          created_at: string
          id: string
          notice_version: string
          organization_id: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string
          created_at?: string
          id?: string
          notice_version: string
          organization_id?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string
          created_at?: string
          id?: string
          notice_version?: string
          organization_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "privacy_acknowledgments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_crm_reminder: {
        Args: { p_reminder_id: string }
        Returns: string
      }
      provision_client_workspace: {
        Args: {
          p_display_name: string
          p_notice_version: string
          p_organization_name: string
          p_phone: string
          p_slug: string
          p_user_id: string
        }
        Returns: Json
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
