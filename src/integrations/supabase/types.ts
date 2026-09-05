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
      gallery_images: {
        Row: {
          category: string
          created_at: string
          id: string
          image_url: string
          sort_order: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          title?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      marks_config: {
        Row: {
          class: number
          total_out_of: number
        }
        Insert: {
          class: number
          total_out_of?: number
        }
        Update: {
          class?: number
          total_out_of?: number
        }
        Relationships: []
      }
      pdfs: {
        Row: {
          category: string
          created_at: string
          description: string
          file_name: string
          file_url: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          file_name?: string
          file_url: string
          id?: string
          sort_order?: number
          title?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          file_name?: string
          file_url?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          class: number
          created_at: string
          exam_year: number
          father_name: string
          group: string
          id: string
          name: string
          phone: string
          roll_number: string
          village: string
        }
        Insert: {
          class: number
          created_at?: string
          exam_year?: number
          father_name: string
          group: string
          id?: string
          name: string
          phone: string
          roll_number: string
          village: string
        }
        Update: {
          class?: number
          created_at?: string
          exam_year?: number
          father_name?: string
          group?: string
          id?: string
          name?: string
          phone?: string
          roll_number?: string
          village?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          exam_year: number
          grade: string
          id: string
          percentage: number
          roll_number: string
          status: string
          subject1: number
          subject2: number
          subject3: number
          subject4: number
          total: number
        }
        Insert: {
          exam_year?: number
          grade?: string
          id?: string
          percentage?: number
          roll_number: string
          status?: string
          subject1?: number
          subject2?: number
          subject3?: number
          subject4?: number
          total?: number
        }
        Update: {
          exam_year?: number
          grade?: string
          id?: string
          percentage?: number
          roll_number?: string
          status?: string
          subject1?: number
          subject2?: number
          subject3?: number
          subject4?: number
          total?: number
        }
        Relationships: []
      }
      roll_counters: {
        Row: {
          class: number
          last_number: number
        }
        Insert: {
          class: number
          last_number?: number
        }
        Update: {
          class?: number
          last_number?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          exam_notice: string | null
          exam_notice_type: string | null
          id: number
          registration_status: string
          result_expiry_date: string | null
          result_publish_date: string | null
          result_status: string
        }
        Insert: {
          exam_notice?: string | null
          exam_notice_type?: string | null
          id?: number
          registration_status?: string
          result_expiry_date?: string | null
          result_publish_date?: string | null
          result_status?: string
        }
        Update: {
          exam_notice?: string | null
          exam_notice_type?: string | null
          id?: number
          registration_status?: string
          result_expiry_date?: string | null
          result_publish_date?: string | null
          result_status?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          father_name: string
          id: string
          name: string
          phone: string
          photo_url: string | null
          post: string
          role: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          father_name?: string
          id?: string
          name: string
          phone?: string
          photo_url?: string | null
          post?: string
          role?: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          father_name?: string
          id?: string
          name?: string
          phone?: string
          photo_url?: string | null
          post?: string
          role?: string
          sort_order?: number
        }
        Relationships: []
      }
      winners: {
        Row: {
          class: number
          created_at: string
          father_name: string
          group_name: string
          id: string
          name: string
          percentage: number
          photo_url: string | null
          rank: number
          roll_number: string
          year: number
        }
        Insert: {
          class: number
          created_at?: string
          father_name?: string
          group_name?: string
          id?: string
          name: string
          percentage?: number
          photo_url?: string | null
          rank: number
          roll_number?: string
          year: number
        }
        Update: {
          class?: number
          created_at?: string
          father_name?: string
          group_name?: string
          id?: string
          name?: string
          percentage?: number
          photo_url?: string | null
          rank?: number
          roll_number?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_registration_open: { Args: never; Returns: boolean }
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
