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
      announcements: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          title: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          title: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: Database["public"]["Enums"]["challenge_category"]
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: Database["public"]["Enums"]["challenge_category"]
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: Database["public"]["Enums"]["challenge_category"]
        }
        Relationships: []
      }
      challenge_files: {
        Row: {
          challenge_id: string
          created_at: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_files_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_hints: {
        Row: {
          challenge_id: string
          content: string
          cost: number
          created_at: string
          id: string
          order_index: number | null
        }
        Insert: {
          challenge_id: string
          content: string
          cost?: number
          created_at?: string
          id?: string
          order_index?: number | null
        }
        Update: {
          challenge_id?: string
          content?: string
          cost?: number
          created_at?: string
          id?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_hints_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          author: string | null
          category_id: string
          created_at: string
          current_points: number | null
          decay_rate: number | null
          description: string
          difficulty: Database["public"]["Enums"]["challenge_difficulty"] | null
          docker_image: string | null
          flag: string
          id: string
          is_active: boolean | null
          is_hidden: boolean | null
          max_points: number
          min_points: number
          scoring_type: string
          solve_count: number | null
          source_url: string | null
          static_points: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category_id: string
          created_at?: string
          current_points?: number | null
          decay_rate?: number | null
          description: string
          difficulty?:
            | Database["public"]["Enums"]["challenge_difficulty"]
            | null
          docker_image?: string | null
          flag: string
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          max_points?: number
          min_points?: number
          scoring_type?: string
          solve_count?: number | null
          source_url?: string | null
          static_points?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category_id?: string
          created_at?: string
          current_points?: number | null
          decay_rate?: number | null
          description?: string
          difficulty?:
            | Database["public"]["Enums"]["challenge_difficulty"]
            | null
          docker_image?: string | null
          flag?: string
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          max_points?: number
          min_points?: number
          scoring_type?: string
          solve_count?: number | null
          source_url?: string | null
          static_points?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_settings: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          first_blood_bonus: number | null
          freeze_scoreboard: boolean | null
          freeze_time: string | null
          id: string
          individual_mode: boolean | null
          max_team_size: number | null
          name: string
          registration_open: boolean | null
          start_time: string | null
          team_mode: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          first_blood_bonus?: number | null
          freeze_scoreboard?: boolean | null
          freeze_time?: string | null
          id?: string
          individual_mode?: boolean | null
          max_team_size?: number | null
          name?: string
          registration_open?: boolean | null
          start_time?: string | null
          team_mode?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          first_blood_bonus?: number | null
          freeze_scoreboard?: boolean | null
          freeze_time?: string | null
          id?: string
          individual_mode?: boolean | null
          max_team_size?: number | null
          name?: string
          registration_open?: boolean | null
          start_time?: string | null
          team_mode?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          display_name: string | null
          id: string
          score: number | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          score?: number | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          score?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      registration_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          current_uses: number | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      solves: {
        Row: {
          challenge_id: string
          id: string
          is_first_blood: boolean | null
          points_awarded: number
          solved_at: string
          team_id: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          is_first_blood?: boolean | null
          points_awarded: number
          solved_at?: string
          team_id?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          is_first_blood?: boolean | null
          points_awarded?: number
          solved_at?: string
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solves_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solves_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          challenge_id: string
          id: string
          ip_address: string | null
          is_correct: boolean | null
          submitted_at: string
          submitted_flag: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          ip_address?: string | null
          is_correct?: boolean | null
          submitted_at?: string
          submitted_flag: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          ip_address?: string | null
          is_correct?: boolean | null
          submitted_at?: string
          submitted_flag?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      team_chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_chat_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          captain_id: string | null
          created_at: string
          description: string | null
          id: string
          invite_code: string | null
          is_public: boolean | null
          max_members: number | null
          name: string
          score: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          captain_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invite_code?: string | null
          is_public?: boolean | null
          max_members?: number | null
          name: string
          score?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          captain_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invite_code?: string | null
          is_public?: boolean | null
          max_members?: number | null
          name?: string
          score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      token_usage: {
        Row: {
          id: string
          token_id: string | null
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          token_id?: string | null
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          token_id?: string | null
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "registration_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      unlocked_hints: {
        Row: {
          hint_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          hint_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          hint_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocked_hints_hint_id_fkey"
            columns: ["hint_id"]
            isOneToOne: false
            referencedRelation: "challenge_hints"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_challenge_points: {
        Args: {
          p_decay_rate: number
          p_max_points: number
          p_min_points: number
          p_solve_count: number
        }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      use_registration_token: {
        Args: { p_token: string; p_user_id: string }
        Returns: boolean
      }
      validate_registration_token: {
        Args: { p_token: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      challenge_category:
        | "web"
        | "crypto"
        | "pwn"
        | "forensic"
        | "osint"
        | "misc"
      challenge_difficulty: "easy" | "medium" | "hard" | "insane"
      invite_status: "pending" | "accepted" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      challenge_category: ["web", "crypto", "pwn", "forensic", "osint", "misc"],
      challenge_difficulty: ["easy", "medium", "hard", "insane"],
      invite_status: ["pending", "accepted", "rejected"],
    },
  },
} as const
