import { useMemo } from 'react';
import useTeamStore from '@/app/stores/teamStore';

const useTeams = () => {
  const { teams, currentTeamID } = useTeamStore();

  return useMemo(() => {
    const currentTeam = teams.find((team) => team.id === currentTeamID);
    const otherTeam = teams.find((team) => team.id !== currentTeamID);
    const redTeam = teams.find((team) => team.color === 'red');
    const blueTeam = teams.find((team) => team.color === 'blue');
    const turnTeam = teams.find((team) => team.is_turn);

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