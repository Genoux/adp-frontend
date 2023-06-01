export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          blue: number | null
          created_at: string | null
          id: number
          name: string | null
          ready: boolean | null
          red: number | null
          timer: number | null
        }
        Insert: {
          blue?: number | null
          created_at?: string | null
          id?: number
          name?: string | null
          ready?: boolean | null
          red?: number | null
          timer?: number | null
        }
        Update: {
          blue?: number | null
          created_at?: string | null
          id?: number
          name?: string | null
          ready?: boolean | null
          red?: number | null
          timer?: number | null
        }
      }
      teams: {
        Row: {
          color: string | null
          heroes_pool: Json | null
          heroes_selected: Json | null
          id: number
          isTurn: boolean | null
          number_of_pick: number | null
          ready: boolean | null
          room: number | null
        }
        Insert: {
          color?: string | null
          heroes_pool?: Json | null
          heroes_selected?: Json | null
          id?: number
          isTurn?: boolean | null
          number_of_pick?: number | null
          ready?: boolean | null
          room?: number | null
        }
        Update: {
          color?: string | null
          heroes_pool?: Json | null
          heroes_selected?: Json | null
          id?: number
          isTurn?: boolean | null
          number_of_pick?: number | null
          ready?: boolean | null
          room?: number | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
