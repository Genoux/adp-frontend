export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
  public: {
    Tables: {
      rooms: {
        Row: {
          blue: number | null
          created_at: string | null
          cycle: number | null
          discussion_round: boolean | null
          heroes_pool: Json | null
          id: number
          name: string | null
          nextTimestamp: string | null
          ready: boolean | null
          red: number | null
          safeGate: boolean | null
          status: string | null
          timer: string | null
        }
        Insert: {
          blue?: number | null
          created_at?: string | null
          cycle?: number | null
          discussion_round?: boolean | null
          heroes_pool?: Json | null
          id?: number
          name?: string | null
          nextTimestamp?: string | null
          ready?: boolean | null
          red?: number | null
          safeGate?: boolean | null
          status?: string | null
          timer?: string | null
        }
        Update: {
          blue?: number | null
          created_at?: string | null
          cycle?: number | null
          discussion_round?: boolean | null
          heroes_pool?: Json | null
          id?: number
          name?: string | null
          nextTimestamp?: string | null
          ready?: boolean | null
          red?: number | null
          safeGate?: boolean | null
          status?: string | null
          timer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_blue_fkey"
            columns: ["blue"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_red_fkey"
            columns: ["red"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          color: string | null
          created_at: string | null
          heroes_pool: Json | null
          heroes_selected: Json | null
          id: number
          isTurn: boolean | null
          name: string | null
          number_of_pick: number | null
          ready: boolean | null
          room: number | null
          selected_hero: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          heroes_pool?: Json | null
          heroes_selected?: Json | null
          id?: number
          isTurn?: boolean | null
          name?: string | null
          number_of_pick?: number | null
          ready?: boolean | null
          room?: number | null
          selected_hero?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          heroes_pool?: Json | null
          heroes_selected?: Json | null
          id?: number
          isTurn?: boolean | null
          name?: string | null
          number_of_pick?: number | null
          ready?: boolean | null
          room?: number | null
          selected_hero?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_room_fkey"
            columns: ["room"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

