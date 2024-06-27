import { useMemo } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import { Database } from '@/app/types/supabase';

type Hero = Database["public"]["CompositeTypes"]["hero"];

const useCurrentHero = () => {
  const { turnTeam } = useTeams();
  const { room } = useRoomStore();

  return useMemo(() => {
    if (!turnTeam || !room) return null;

    const currentArray: Hero[] = room.status === 'ban' 
      ? (turnTeam.heroes_ban as Hero[]) 
      : (turnTeam.heroes_selected as Hero[]);
    
    const currentHero = currentArray.find((hero: Hero) => hero && !hero.selected);

    return currentHero || null;
  }, [turnTeam, room]);
};

export default useCurrentHero;