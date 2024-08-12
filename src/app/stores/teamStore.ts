import { supabase } from '@/app/lib/supabase/client';
import { Database } from '@/app/types/supabase';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { create } from 'zustand';

type Team = Database['public']['Tables']['teams']['Row'];

interface TeamState {
  teams: Team[];
  currentTeamID: number | null;
  isLoading: boolean;
  error: Error | null;
  notFoundError: string | null;
  currentSelection: string | null;
  isSpectator: boolean;
  fetchTeams: (roomID: number) => Promise<void>;
  setCurrentTeamID: (teamID: number) => Promise<void>;
  setIsSpectator: (isSpectator: boolean) => void;
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

    const subscribeWithRetry = async (
      team: Team,
      retries = 0
    ): Promise<void> => {
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
                console.error(
                  `.subscribe - err TEAM (attempt ${retries + 1}):`,
                  err
                );
                if (retries < MAX_RETRIES) {
                  setTimeout(
                    () => subscribeWithRetry(team, retries + 1),
                    RETRY_DELAY
                  );
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
        console.error(
          `Failed to subscribe to team ${team.id} after ${MAX_RETRIES} attempts:`,
          error
        );
        throw error;
      }
    };

    await Promise.all(teams.map((team) => subscribeWithRetry(team)));
  };

  return {
    teams: [],
    currentTeamID: null,
    isLoading: false,
    error: null,
    notFoundError: null,
    currentSelection: null,
    isSpectator: false,

    fetchTeams: async (roomID) => {
      set({ isLoading: true, error: null, notFoundError: null });
      try {
        const { data: teams, error } = await supabase
          .from('teams')
          .select('*')
          .eq('room_id', roomID);

        if (error) throw error;

        if (teams && teams.length > 0) {
          await subscribeToTeams(teams);
          set({ teams, isLoading: false, notFoundError: null });
        } else {
          set({ isLoading: false, notFoundError: 'Room or teams not found' });
        }
      } catch (error) {
        set({
          error:
            error instanceof Error ? error : new Error('Error fetching teams'),
          isLoading: false,
        });
      }
    },

    setCurrentTeamID: async (teamID) => {
      set({ isLoading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamID)
          .single();

        if (error) throw error;

        if (data) {
          set({ currentTeamID: data.id, isLoading: false });
        } else {
          set({ isLoading: false, notFoundError: 'Team not found' });
        }
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error
              : new Error('Error finding team for this room'),
          isLoading: false,
        });
      }
    },

    setIsSpectator: (isSpectator) => set({ isSpectator }),

    updateTeam: async (teamID, updates: Partial<Team>) => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .update(updates)
          .eq('id', teamID)
          .select('*')
          .single();

        if (error) throw error;

        if (data && data.is_turn) {
          handleTeamUpdate({
            new: { id: teamID, ...updates } as Team,
          } as RealtimePostgresUpdatePayload<Team>);
        }
      } catch (error) {
        set({
          error:
            error instanceof Error ? error : new Error('Error updating team'),
        });
      }
    },

    unsubscribe: () => {
      Object.values(subscriptions).forEach((unsubscribe) => unsubscribe());
      subscriptions = {};
    },

    setCurrentSelection: (heroID: string | null) =>
      set({ currentSelection: heroID }),
  };
});

export default useTeamStore;
