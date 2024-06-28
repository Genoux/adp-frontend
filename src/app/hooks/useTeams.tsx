import { useMemo } from 'react';
import useTeamStore from '@/app/stores/teamStore';

class TeamsNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamsNotFoundError";
  }
}

const useTeams = () => {
  const { teams, currentTeamID } = useTeamStore();

  return useMemo(() => {
    const currentTeam = teams.find((team) => team.id === currentTeamID);
    const otherTeam = teams.find((team) => team.id !== currentTeamID);
    const redTeam = teams.find((team) => team.color === 'red');
    const blueTeam = teams.find((team) => team.color === 'blue');
    const turnTeam = teams.find((team) => team.is_turn);

    if (!currentTeam || !otherTeam || !redTeam || !blueTeam) {
      throw new TeamsNotFoundError("One or more required teams not found");
    }

    return {
      currentTeam,
      otherTeam,
      redTeam,
      blueTeam,
      teams,
      turnTeam
    };
  }, [teams, currentTeamID]);
};

export default useTeams;