import { useMemo } from 'react';
import useTeamStore from '@/app/stores/teamStore';

const useTeams = () => {
  const { teams, currentTeamId } = useTeamStore();

  return useMemo(() => {
    const currentTeam = teams.find((team) => team.id.toString() === currentTeamId);
    const otherTeam = teams.find((team) => team.id.toString() !== currentTeamId);
    const redTeam = teams.find((team) => team.color === 'red');
    const blueTeam = teams.find((team) => team.color === 'blue');
    const turnTeam = teams.find((team) => team.isturn);

    return {
      currentTeam,
      otherTeam,
      redTeam,
      blueTeam,
      teams,
      turnTeam
    };
  }, [teams, currentTeamId]);
};

export default useTeams;