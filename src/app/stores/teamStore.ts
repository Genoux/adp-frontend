import { supabase } from '@/app/lib/supabase/client';
import { create } from 'zustand';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { Database } from '@/app/types/supabase';

type Team = Database["public"]["Tables"]["teams"]["Row"];

interface TeamState {
  teams: Team[];
  currentTeamID: number | null;
  isLoading: boolean;
  error: Error | null;
  isSubscribed: boolean;
  currentSelection: string | null;
  fetchTeams: (roomID: number) => Promise<void>;
  setCurrentTeamID: (teamID: number) => void;
  updateTeam: (teamID: number, updates: Partial<Team>) => Promise<void>;
  unsubscribe: () => void;
  setCurrentSelection: (heroID: string | null) => void;
}

const useTeamStore = create<TeamState>((set) => {
  let subscriptions: Record<string, () => void> = {};

  const handleTeamUpdate = (payload: RealtimePostgresUpdatePayload<Team>) => {
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === payload.new.id ? { ...team, ...payload.new } : team
      ),
    }));
  };

  const subscribeToTeams = async (teams: Team[]) => {
    teams.forEach((team) => {
      if (!subscriptions[team.id]) {
        const channel = supabase
          .channel(team.id.toString())
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'teams',
              filter: `id=eq.${team.id}`,
            },
            handleTeamUpdate
          )
          .subscribe((status, err) => {
            if (err) {
              console.error('.subscribe - err TEAM:', err);
              set({ isSubscribed: false });
            } else {
              subscriptions[team.id] = () => channel.unsubscribe();
              set({ isSubscribed: true });
            }
          });
      }
    });
  };

  return {
    teams: [],
    currentTeamID: null,
    isLoading: false,
    error: null,
    isSubscribed: false,
    currentSelection: null,
    fetchTeams: async (roomID) => {
      set({ isLoading: true, error: null });
      try {
        const { data: teams, error } = await supabase
          .from('teams')
          .select('*')
          .eq('room_id', roomID);
        if (error) throw error;
        set({ teams });
        await subscribeToTeams(teams);
      } catch (error) {
        set({ error: error as Error });
      } finally {
        set({ isLoading: false });
      }
    },
    setCurrentTeamID: (teamID) => set({ currentTeamID: teamID }),
    updateTeam: async (teamID, updates: Partial<Team>) => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .update(updates)
          .eq('id', teamID).select('*').single();
        if (error) throw error;
        if(data && data.is_turn) {
          handleTeamUpdate({ new: { id: teamID, ...updates } as Team } as RealtimePostgresUpdatePayload<Team>);
        }
      } catch (error) {
        console.error('Error updating team:', error);
        set({ error: error as Error });
      }
    },
    unsubscribe: () => {
      Object.values(subscriptions).forEach((unsubscribe) => unsubscribe());
      subscriptions = {};
      set({ isSubscribed: false });
    },
    setCurrentSelection: (heroID: string | null) => set({ currentSelection: heroID }),
  };
});

export default useTeamStore;