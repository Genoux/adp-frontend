import { create } from 'zustand'
import supabase from "@/app/services/supabase";
import { Database } from "@/app/types/supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"];

interface TeamState {
  teams: Team[] | null;
  currentTeam: Team | null;
  otherTeam: Team | null;
  isLoading: boolean;
  error: Error | null;
  fetchTeams: (roomid: string, teamid: string) => Promise<void>;
  handleTeamUpdate: (payload: any, teamId: string) => void;
  getCurrent: (teamId: string) => Team | undefined;
  getOther: (teamId: string) => Team | undefined;

}

// Define handleTeamUpdate outside of the store
const handleTeamUpdate = (set: any, get: any) => (payload: any, teamId: string) => {
  // Update the team data in your state based on the payload
  let updatedTeams = get().teams?.map((team: { id: string; }) => {
    if (team.id === teamId) {
      return { ...team, ...payload.new }; // This assumes the payload includes the updated team data
    }
    return team;
  });

  set({ teams: updatedTeams });

  // Also update the currentTeam or otherTeam if needed
  if (get().currentTeam?.id === teamId) {
    set({ currentTeam: { ...get().currentTeam, ...payload.new } });
  } else if (get().otherTeam?.id === teamId) {
    set({ otherTeam: { ...get().otherTeam, ...payload.new } });
  }
};

export const teamStore = create<TeamState>((set, get) => ({
  teams: null,
  currentTeam: null,
  otherTeam: null,
  isLoading: false,
  error: null,
  handleTeamUpdate: handleTeamUpdate(set, get),
  fetchTeams: async (roomid: string, teamid: string) => {
    set({ isLoading: true, error: null });
    try {
      let { data: teams, error } = await supabase
        .from('teams')
        .select('*')
        .eq('room', roomid);

      if (error) {
        throw error;
      }

      // Set the fetched teams data
      set({ teams });

      // Set the current and other teams
      const currentTeam = teams?.find((team: { id: number; }) => team.id === parseInt(teamid));
      const otherTeam = teams?.find((team: { id: number; }) => team.id !== parseInt(teamid));

      set({ currentTeam, otherTeam });

      if (!currentTeam) {
        throw new Error(`Current team with ID ${teamid} not found`);
      }
      // Setting up subscriptions for both teams
      teams?.forEach((team: { id: string; }) => {
        const subscription = supabase
          .channel(team.id)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'teams',
              filter: `id=eq.${team.id}`,
            },
            (payload) => {
              get().handleTeamUpdate(payload, team.id);
            })
          .subscribe((status, err) => {
            if (!err) {
              console.log('Received event TEAM:: ', status);
            } else {
              console.log(".subscribe - err TEAM:", err);
            }
          });
      });

    } catch (error) {
      set({ error } as any);
    } finally {
      set({ isLoading: false });
    }
  },

  getCurrent: (teamId: string) => {
    const teams = get().teams;
    const currentTeam = teams?.find((team: { id: number; }) => team.id === parseInt(teamId));

    if (!currentTeam) {
      throw new Error(`Current team with ID ${teamId} not found`);
    }

    return currentTeam;
  },
  getOther: (teamId: string) => {
    const teams = get().teams;
    const otherTeam = teams?.find((team: { id: number; }) => team.id !== parseInt(teamId));
    if (!otherTeam) {
      throw new Error(`Other team with ID ${teamId} not found`);
    }

    return otherTeam;
  },
}));
