import { useMemo } from 'react';

const useTeams = (teamStore: () => { teams: any; currentTeam: any }) => {
  const { teams, currentTeam } = teamStore();

  const blue = useMemo(() => {
    return teams?.find((team: { color: string; }) => team.color === 'blue');
  }, [teams]);

  const red = useMemo(() => {
    return teams?.find((team: { color: string; }) => team.color === 'red');
  }, [teams]);

  const current = useMemo(() => {
    return teams?.find((team: { id: any; }) => team.id === currentTeam.id);
  }, [currentTeam.id, teams]);

  const other = useMemo(() => {
    return teams?.find((team: { id: any; }) => team.id !== currentTeam.id);
  }, [currentTeam.id, teams]);

  return { current, other, blue, red };
};
export default useTeams;