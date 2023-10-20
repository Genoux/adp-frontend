import { motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from "@/app/stores/roomStore";
import { useState, useEffect } from 'react';

interface Team {
  [key: string]: any;
}

interface Hero {
  name: string;
  selected: boolean;
}

const TeamBans = ({ team }: Team) => {
  const heightVariants = {
    collapsed: { y: 0, height: "0px", opacity: 0 },
    expanded: { y: -50, height: "70px", opacity: 1 }
  };

  const { room } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn && room?.status === 'ban') {
      const firstUnselectedHeroIndex = (team.heroes_ban as unknown as Hero[]).findIndex(hero => !hero.selected);
      setBorderIndex(firstUnselectedHeroIndex);
    } else {
      setBorderIndex(null); // Remove the border when it's not the team's turn
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team.isturn]);

  return (
    <>
      <motion.div
        initial="collapsed"
        animate="expanded"
        transition={defaultTransition}
        variants={heightVariants}
        className="flex gap-2 w-full overflow-hidden"
      >
        {(team.heroes_ban as unknown as Hero[]).map((hero: Hero, index: number) => (
          <div
            key={index}
            className={`h-full w-full transition-all relative overflow-hidden rounded-md ${hero.selected && "bg-transparent"} ${!team.isturn && "opacity-50"} ${(index === borderIndex && !hero.selected) ? "border border-red-600 ease-in-out animate-pulse bg-red-500 bg-opacity-20 border-opacity-70" : "bg-[#161620] border border-white border-opacity-0"}`}
          >
            {
              hero && hero.selected ? (
                hero.name === null ? (
                  <div className="flex items-center justify-center h-full">
                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M32.2811 3.52929C33.0886 2.72192 33.0886 1.4129 32.2811 0.605529C31.4739 -0.201843 30.1647 -0.201843 29.3576 0.605529L16.8867 13.0763L4.41604 0.605529C3.60863 -0.201843 2.29962 -0.201843 1.49225 0.605529C0.684876 1.4129 0.684876 2.72192 1.49225 3.52929L13.963 16L1.49225 28.4707C0.684876 29.2783 0.684876 30.5871 1.49225 31.3946C2.29962 32.2018 3.60863 32.2018 4.41604 31.3946L16.8867 18.9238L29.3576 31.3946C30.1647 32.2018 31.4739 32.2018 32.2811 31.3946C33.0886 30.5871 33.0886 29.2783 32.2811 28.4707L19.8105 16L32.2811 3.52929Z" fill="#302F3D" />
                    </svg>
                  </div>
                ) : (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: .1,
                        duration: .5,
                        ease: "easeInOut"
                      }}
                      className="absolute z-50 w-full h-full flex justify-center items-center font-medium">
                      {hero.name}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: .1,
                        duration: .2,
                        ease: "easeInOut"
                      }}

                      className="absolute top-0 left-0 w-full h-full bg-cover bg-center grayscale"
                      style={{
                        backgroundImage: `url("/images/champions/splash/${hero.name.toLowerCase().replace(/\s+/g, '')}.jpg")`,
                      }}
                    >
                    </motion.div>
                  </div>
                )
              ) : null
            }
          </div>
        ))}
      </motion.div>
    </>
  );
};

export default TeamBans;
