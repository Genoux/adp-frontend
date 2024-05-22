import { supabase } from '@/app/lib/supabase/client';
//import { Database } from '@/app/types/supabase';
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

      teams.forEach((team: Team) => {
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
            console.log('Channel status:', status);
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
