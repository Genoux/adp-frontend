import { useMemo } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';

const useCurrentHero = () => {
  const { currentTeam } = useTeams();
  const { room } = useRoomStore();

  return useMemo(() => {
    if (!currentTeam || !room) return null;

    const currentArray = room.status === 'ban' ? currentTeam.heroes_ban : currentTeam.heroes_selected;
    
    // Find the first non-selected hero in the array
    const currentHero = currentArray.find(hero => hero && !hero.selected);

    return currentHero || null;
  }, [currentTeam, room]);
};

export default useCurrentHero;