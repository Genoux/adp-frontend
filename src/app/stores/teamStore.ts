import { supabase } from '@/app/lib/supabase/client';
import { create } from 'zustand';

type Team = {
  id: number;
  isturn: boolean;
  name: string | null;
  clicked_hero: string | null;
  room: string;
  ready: boolean;
  color: string | null;
  canSelect: boolean;
};

interface TeamState {
  teams: Team[] | null;
  currentTeamId: string | null;
  isLoading: boolean;
  isSubscribed: boolean;
  subscriptions: Record<number, boolean>;
  error: Error | null;
  fetchTeams: (roomid: string) => Promise<void>;
  setCurrentTeamId: (teamId: string) => void;
  handleTeamUpdate: (payload: any) => void;
}

const useTeamStore = create<TeamState>((set, get) => ({
  teams: null,
  currentTeamId: null,
  isLoading: false,
  isSubscribed: false,
  subscriptions: {},
  error: null,

  fetchTeams: async (roomid: string) => {
    set({ isLoading: true, error: null, isSubscribed: false });
    try {
      const { data: teams, error } = await supabase
        .from('teams')
        .select('*')
        .eq('room', roomid);

      if (error) throw error;

      set({ teams });

      const subscriptionPromises = teams.map((team: Team) => {
        if (!get().subscriptions[team.id]) {
          return new Promise<void>((resolve, reject) => {
            supabase
              .channel(team.id.toString())
              .on(
                'postgres_changes',
                {
                  event: 'UPDATE',
                  schema: 'aram_draft_pick',
                  table: 'teams',
                  filter: `id=eq.${team.id}`,
                },
                (payload) => get().handleTeamUpdate(payload)
              )
              .subscribe((status, err) => {
                if (err) {
                  console.error('.subscribe - err TEAM:', err);
                  reject(err);
                } else {
                  set((state) => ({
                    subscriptions: { ...state.subscriptions, [team.id]: true },
                  }));
                  resolve();
                }
              });
          });
        }
        return Promise.resolve(); // Already subscribed
      });

      await Promise.all(subscriptionPromises);
      set({ isSubscribed: true });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentTeamId: (teamId: string) => {
    set({ currentTeamId: teamId });
    console.log('Set currentTeamId:', teamId); // Debugging
  },

  handleTeamUpdate: (payload) => {
    const currentTeams = get().teams;
    let updatedTeams = currentTeams;

    if (currentTeams) {
      updatedTeams = currentTeams.map((team) =>
        team.id === payload.new.id ? { ...team, ...payload.new } : team
      );
    }

    set({ teams: updatedTeams });

    // Also update the currentTeamId if needed
    if (get().currentTeamId === payload.new.id) {
      set({ currentTeamId: payload.new.id });
    }
  },
}));

export default useTeamStore;
