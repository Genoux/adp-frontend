import supabase from '@/app/services/supabase';
import { Database } from '@/app/types/supabase';
import { create } from 'zustand';

type Team = Database['public']['Tables']['teams']['Row'];

interface TeamState {
  teams: Team[] | null;
  currentTeamId: string | null;
  isLoading: boolean;
  error: Error | null;
  fetchTeams: (roomid: string) => Promise<void>;
  setCurrentTeamId: (teamId: string) => void;
  handleTeamUpdate: (payload: any) => void;
}

const useTeamStore = create<TeamState>((set, get) => ({
  teams: null,
  currentTeamId: null,
  isLoading: false,
  error: null,

  fetchTeams: async (roomid: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: teams, error } = await supabase
        .from('teams')
        .select('*')
        .eq('room', roomid);

      if (error) throw error;

      set({ teams });

      // Set up real-time subscriptions for all teams in the room
      teams?.forEach((team: { id: string }) => {
        supabase
          .channel(team.id)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'teams',
              filter: `id=eq.${team.id}`,
            },
            (payload) => get().handleTeamUpdate(payload)
          )
          .subscribe((status, err) => {
            if (err) console.error('.subscribe - err TEAM:', err);
          });
      });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentTeamId: (teamId: string) => {
    set({ currentTeamId: teamId });
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
