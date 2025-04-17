export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      community_members: {
        Row: {
          id: string
          issue_id: number | null
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          issue_id?: number | null
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          issue_id?: number | null
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_members_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "JusticeIssue"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          issue_id: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          issue_id?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          issue_id?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "JusticeIssue"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_community_members: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          issue_id: number | null
          name: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          issue_id?: number | null
          name: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          issue_id?: number | null
          name?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_community_members_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "JusticeIssue"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_documents: {
        Row: {
          created_at: string | null
          id: string
          issue_id: number | null
          name: string
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          issue_id?: number | null
          name: string
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          issue_id?: number | null
          name?: string
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_documents_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "JusticeIssue"
            referencedColumns: ["id"]
          },
        ]
      }
      justice_champions: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          issue_id: number | null
          name: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          issue_id?: number | null
          name: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          issue_id?: number | null
          name?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "justice_champions_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "JusticeIssue"
            referencedColumns: ["id"]
          },
        ]
      }
      JusticeIssue: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          doclink1_of_issue: string | null
          doclink2_of_issue: string | null
          downvotes: number | null
          id: number
          image_url: string | null
          issue_desc: string | null
          issue_title: string | null
          issue_video_problem_statement: string | null
          latitude_of_issue: number | null
          longitude_of_issue: number | null
          severity: Database["public"]["Enums"]["issue_severity"] | null
          solution_of_issue: string | null
          tags: string[] | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          doclink1_of_issue?: string | null
          doclink2_of_issue?: string | null
          downvotes?: number | null
          id?: number
          image_url?: string | null
          issue_desc?: string | null
          issue_title?: string | null
          issue_video_problem_statement?: string | null
          latitude_of_issue?: number | null
          longitude_of_issue?: number | null
          severity?: Database["public"]["Enums"]["issue_severity"] | null
          solution_of_issue?: string | null
          tags?: string[] | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          doclink1_of_issue?: string | null
          doclink2_of_issue?: string | null
          downvotes?: number | null
          id?: number
          image_url?: string | null
          issue_desc?: string | null
          issue_title?: string | null
          issue_video_problem_statement?: string | null
          latitude_of_issue?: number | null
          longitude_of_issue?: number | null
          severity?: Database["public"]["Enums"]["issue_severity"] | null
          solution_of_issue?: string | null
          tags?: string[] | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      issue_severity: "critical" | "moderate" | "minor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      issue_severity: ["critical", "moderate", "minor"],
    },
  },
} as const
