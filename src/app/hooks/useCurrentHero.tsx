import { useMemo } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';

const useCurrentHero = () => {
  const { turnTeam } = useTeams();
  const { room } = useRoomStore();

  return useMemo(() => {
    if (!turnTeam || !room) return null;

    const currentArray = room.status === 'ban' ? turnTeam.heroes_ban : turnTeam.heroes_selected;
    
    const currentHero = currentArray.find(hero => hero && !hero.selected);

    return currentHero || null;
  }, [turnTeam, room]);
};

export default useCurrentHero;