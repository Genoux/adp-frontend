import { roomStore } from "@/app/stores/roomStore";
import { motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig';
import { useState, useEffect } from 'react';
import MyImage from '@/app/components/common/MyImage';
interface Team {
  [key: string]: any;
}

interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

const TeamPicks = ({ team }: Team) => {

  const { room } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  const heightVariants = {
    initial: { y: 0, height: 0, originY: 0 },
    notDone: { height: "250px", y: -45 },
    done: { height: "300px", y: 0 }
  };

  const isDone = room?.status === "done";

  const [borderIndex, setBorderIndex] = useState<number | null>(null);


  useEffect(() => {
    if (team.isturn && room?.status === 'select' && team.nb_turn > 0) {
      const firstUnselectedHeroIndex = (team.heroes_selected as unknown as Hero[]).findIndex(hero => !hero.selected);
      setBorderIndex(firstUnselectedHeroIndex);
    } else {
      setBorderIndex(null); // Remove the border when it's not the team's turn
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.status, team.nb_turn]);

  return (
    <motion.div
      initial="initial"
      animate={isDone ? "done" : "notDone"}
      transition={defaultTransition}
      variants={heightVariants}
      className={`grid grid-cols-5 gap-2 h-full w-full ${team.isturn || isDone ? `opacity-100` : "opacity-60"}`}>
      {(team.heroes_selected as unknown as Hero[]).map((hero: Hero, index: number) => (
        <div
          key={index}
          className={`h-full w-full rounded-md overflow-hidden transition-all relative ${hero.name ? "" : (index === borderIndex ? "border ease-in-out animate-pulse bg-yellow-300 bg-opacity-10 border-yellow glow-yellow" : "border border-white border-opacity-10")}`}>
          {hero.name && (
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: .1,
                  duration: .5,
                  ease: "easeInOut"
                }}
                className="absolute z-50 w-full h-full flex justify-center items-center font-medium opacity-0">
                {hero.name}
              </motion.div>
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black via-transparent to-transparent bg-clip-content z-40"></div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: .1,
                  duration: .2,
                  ease: "easeInOut"
                }}
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url("/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg")`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default TeamPicks;
