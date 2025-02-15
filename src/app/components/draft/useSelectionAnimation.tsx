import { Database } from '@/app/types/supabase';

type Team = Database['public']['Tables']['teams']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];
type Hero = Database['public']['CompositeTypes']['hero'];

export const useSelectionAnimation = (
  room: Room | null,
  team: Team | null,
  selectionType: 'select' | 'ban'
) => {
  const getCurrentIndex = () => {
    if (
      room?.status !== selectionType ||
      !team ||
      !team.is_turn ||
      !team.can_select
    ) {
      return null;
    }
    const heroes =
      selectionType === 'select' ? team.heroes_selected : team.heroes_ban;
    return (heroes as Hero[]).findIndex((hero) => !hero.selected);
  };

  const isCurrentSlot = (hero: Hero, index: number) => {
    const currentIndex = getCurrentIndex();
    return index === currentIndex && !hero.selected;
  };

  return { isCurrentSlot };
};
