import useTeamStore from '@/app/stores/teamStore';
import { useMemo } from 'react';

const useTeam = () => {
  const { teams, currentTeamId } = useTeamStore();

  const currentTeam = useMemo(() => {
    return teams?.find(
      (team: { id: number }) => team.id.toString() === currentTeamId
    );
  }, [teams, currentTeamId]);

  const otherTeam = useMemo(() => {
    return teams?.find(
      (team: { id: number }) => team.id.toString() !== currentTeamId
    );
  }, [teams, currentTeamId]);

  const redTeam = useMemo(() => {
    return teams?.find((team) => team.color === 'red');
  }, [teams]);

  const blueTeam = useMemo(() => {
    return teams?.find((team) => team.color === 'blue');
  }, [teams]);

  return { currentTeam, otherTeam, redTeam, blueTeam, teams };
};

export default useTeam;
