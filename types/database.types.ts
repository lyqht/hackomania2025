export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      challenges: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          metadata: Json | null;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          metadata?: Json | null;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          metadata?: Json | null;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      main_event_registrations: {
        Row: {
          approved_by: string | null;
          created_at: string;
          email: string;
          first_name: string;
          github_profile_url: string | null;
          has_team: boolean;
          id: string;
          last_name: string;
          linkedin_profile_url: string | null;
          team_name: string | null;
          ticket_email: string | null;
          updated_at: string;
        };
        Insert: {
          approved_by?: string | null;
          created_at?: string;
          email: string;
          first_name: string;
          github_profile_url?: string | null;
          has_team: boolean;
          id?: string;
          last_name: string;
          linkedin_profile_url?: string | null;
          team_name?: string | null;
          ticket_email?: string | null;
          updated_at?: string;
        };
        Update: {
          approved_by?: string | null;
          created_at?: string;
          email?: string;
          first_name?: string;
          github_profile_url?: string | null;
          has_team?: boolean;
          id?: string;
          last_name?: string;
          linkedin_profile_url?: string | null;
          team_name?: string | null;
          ticket_email?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      pre_event_registrations: {
        Row: {
          answers: Json[] | null;
          attendee_id: string;
          cell_phone: string | null;
          checked_in: boolean;
          created_at: string;
          email: string;
          event_id: string;
          first_name: string;
          gender: string | null;
          id: string;
          last_name: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          answers?: Json[] | null;
          attendee_id: string;
          cell_phone?: string | null;
          checked_in?: boolean;
          created_at?: string;
          email: string;
          event_id: string;
          first_name: string;
          gender?: string | null;
          id?: string;
          last_name: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          answers?: Json[] | null;
          attendee_id?: string;
          cell_phone?: string | null;
          checked_in?: boolean;
          created_at?: string;
          email?: string;
          event_id?: string;
          first_name?: string;
          gender?: string | null;
          id?: string;
          last_name?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      team: {
        Row: {
          challengeId: string | null;
          createdAt: string;
          id: string;
          leaderId: string | null;
          name: string;
          updatedAt: string;
        };
        Insert: {
          challengeId?: string | null;
          createdAt?: string;
          id?: string;
          leaderId?: string | null;
          name: string;
          updatedAt?: string;
        };
        Update: {
          challengeId?: string | null;
          createdAt?: string;
          id?: string;
          leaderId?: string | null;
          name?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_challengeId_challenges_id_fk";
            columns: ["challengeId"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_leaderId_user_id_fk";
            columns: ["leaderId"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      team_members: {
        Row: {
          role: string;
          teamId: string;
          userId: string;
        };
        Insert: {
          role: string;
          teamId: string;
          userId: string;
        };
        Update: {
          role?: string;
          teamId?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_teamId_team_id_fk";
            columns: ["teamId"];
            isOneToOne: false;
            referencedRelation: "team";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_members_userId_user_id_fk";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      user: {
        Row: {
          createdAt: string;
          email: string;
          firstName: string | null;
          githubUsername: string;
          id: string;
          lastName: string | null;
          role: string | null;
        };
        Insert: {
          createdAt?: string;
          email: string;
          firstName?: string | null;
          githubUsername: string;
          id?: string;
          lastName?: string | null;
          role?: string | null;
        };
        Update: {
          createdAt?: string;
          email?: string;
          firstName?: string | null;
          githubUsername?: string;
          id?: string;
          lastName?: string | null;
          role?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
