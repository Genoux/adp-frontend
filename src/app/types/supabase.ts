export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  aram_draft_pick: {
    Tables: {
      rooms: {
        Row: {
          blue: number | null
          created_at: string | null
          cycle: number
          heroes_pool: Json | null
          id: number
          name: string | null
          ready: boolean | null
          red: number | null
          status: string | null
          timer: string | null
        }
        Insert: {
          blue?: number | null
          created_at?: string | null
          cycle?: number
          heroes_pool?: Json | null
          id?: number
          name?: string | null
          ready?: boolean | null
          red?: number | null
          status?: string | null
          timer?: string | null
        }
        Update: {
          blue?: number | null
          created_at?: string | null
          cycle?: number
          heroes_pool?: Json | null
          id?: number
          name?: string | null
          ready?: boolean | null
          red?: number | null
          status?: string | null
          timer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_blue_fkey"
            columns: ["blue"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_red_fkey"
            columns: ["red"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          clicked_hero: string | null
          color: string | null
          connected: boolean | null
          created_at: string | null
          heroes_ban: Json | null
          heroes_selected: Json | null
          id: number
          isturn: boolean | null
          name: string | null
          nb_turn: number | null
          ready: boolean | null
          room: number | null
          selected_hero: string | null
          socketid: string | null
        }
        Insert: {
          clicked_hero?: string | null
          color?: string | null
          connected?: boolean | null
          created_at?: string | null
          heroes_ban?: Json | null
          heroes_selected?: Json | null
          id?: number
          isturn?: boolean | null
          name?: string | null
          nb_turn?: number | null
          ready?: boolean | null
          room?: number | null
          selected_hero?: string | null
          socketid?: string | null
        }
        Update: {
          clicked_hero?: string | null
          color?: string | null
          connected?: boolean | null
          created_at?: string | null
          heroes_ban?: Json | null
          heroes_selected?: Json | null
          id?: number
          isturn?: boolean | null
          name?: string | null
          nb_turn?: number | null
          ready?: boolean | null
          room?: number | null
          selected_hero?: string | null
          socketid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_room_fkey"
            columns: ["room"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

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
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
