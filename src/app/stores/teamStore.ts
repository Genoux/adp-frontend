import { supabase } from '@/app/lib/supabase/client';
import { create } from 'zustand';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';

type Team = {
  id: string;
  isturn: boolean;
  name: string | null;
  clicked_hero: string | null;
  room: string;
  ready: boolean;
  color: string | null;
  canSelect: boolean;
};

interface TeamState {
  teams: Team[];
  currentTeamId: string | null;
  isLoading: boolean;
  error: Error | null;
  isSubscribed: boolean;
  fetchTeams: (roomid: string) => Promise<void>;
  setCurrentTeamId: (teamId: string) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  unsubscribe: () => void;
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
              schema: 'aram_draft_pick',
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
    currentTeamId: null,
    isLoading: false,
    error: null,
    isSubscribed: false,
    fetchTeams: async (roomid: string) => {
      set({ isLoading: true, error: null });
      try {
        const { data: teams, error } = await supabase
          .from('teams')
          .select('*')
          .eq('room', roomid);
        if (error) throw error;
        set({ teams });
        await subscribeToTeams(teams);
      } catch (error) {
        set({ error: error as Error });
      } finally {
        set({ isLoading: false });
      }
    },
    setCurrentTeamId: (teamId: string) => set({ currentTeamId: teamId }),
    updateTeam: async (teamId: string, updates: Partial<Team>) => {
      try {
        const { error } = await supabase
          .from('teams')
          .update(updates)
          .eq('id', teamId);
        if (error) throw error;
        handleTeamUpdate({ new: { id: teamId, ...updates } as Team } as RealtimePostgresUpdatePayload<Team>);
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
  };
});

export default useTeamStore;