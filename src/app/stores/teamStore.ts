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
  currentSelection: string | null;
  fetchTeams: (roomID: number) => Promise<void>;
  setCurrentTeamID: (teamID: number) => Promise<void>;
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

  const subscribeToTeams = async (teams: Team[]): Promise<void> => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds

    const subscribeWithRetry = async (team: Team, retries = 0): Promise<void> => {
      try {
        return new Promise((resolve, reject) => {
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
                console.error(`.subscribe - err TEAM (attempt ${retries + 1}):`, err);
                if (retries < MAX_RETRIES) {
                  setTimeout(() => subscribeWithRetry(team, retries + 1), RETRY_DELAY);
                } else {
                  reject(err);
                }
              } else {
                subscriptions[team.id] = () => channel.unsubscribe();
                resolve();
              }
            });
        });
      } catch (error) {
        console.error(`Failed to subscribe to team ${team.id} after ${MAX_RETRIES} attempts:`, error);
        throw error;
      }
    };

    await Promise.all(teams.map(team => subscribeWithRetry(team)));
  };

  return {
    teams: [],
    currentTeamID: null,
    isLoading: false,
    error: null,
    currentSelection: null,

    fetchTeams: async (roomID) => {
      set({ isLoading: true, error: null });
      try {
        const { data: teams } = await supabase
          .from('teams')
          .select('*')
          .eq('room_id', roomID);
        if (teams) {
          await subscribeToTeams(teams);
          set({ teams, isLoading: false });
        }
      } catch (error) {
        throw new Error('Error fetching teams');
      }
    },

    setCurrentTeamID: async (teamID) => {
      try {
        const { data } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamID)
          .single();

        if (data) {
          set({ currentTeamID: data.id, isLoading: false });
        }
      } catch (error) {
        throw new Error('Error finding team for this room');
      }
    },

    updateTeam: async (teamID, updates: Partial<Team>) => {
      try {
        const { data } = await supabase
          .from('teams')
          .update(updates)
          .eq('id', teamID)
          .select('*')
          .single();
        if (data && data.is_turn) {
          handleTeamUpdate({ new: { id: teamID, ...updates } as Team } as RealtimePostgresUpdatePayload<Team>);
        }
      } catch (error) {
        throw new Error('Error updating team');
      }
    },

    unsubscribe: () => {
      Object.values(subscriptions).forEach((unsubscribe) => unsubscribe());
      subscriptions = {};
    },

    setCurrentSelection: (heroID: string | null) => set({ currentSelection: heroID }),
  };
});

export default useTeamStore;