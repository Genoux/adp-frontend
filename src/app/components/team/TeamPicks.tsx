import { roomStore } from "@/app/stores/roomStore";
import { motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig'
interface Team {
  [key: string]: any;
}

interface Hero {
  name: string;
  selected: boolean;
}

const TeamPicks = ({ team }: Team) => {

  const { room } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));
  
  const heightVariants = {
    collapsed: {y:100, height: "0px" },
    expanded: { y:-50, height: "210px" }
  };


  return (
    <>
      <motion.div
         initial="collapsed"
         animate="expanded"
         transition={defaultTransition}
         variants={heightVariants}
        className={`grid grid-cols-5 gap-2 h-full w-full ${team.isturn || room?.status === "done" ? `opacity-100` : "opacity-30"
          }`}>
        {(team.heroes_selected as unknown as Hero[]).map(
          (hero: Hero, index: number) => (
            <div
              key={index}
              className={`h-full w-full rounded-sm overflow-hidden relative ${hero.name ? "" : "border border-white border-opacity-10"
                }`}>
              {hero.name && (
                <div>
                  <p className="absolute z-50 w-full h-full flex justify-center items-end pb-6 font-medium">
                    {hero.name}
                  </p>
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black via-transparent to-transparent bg-clip-content z-40"></div>
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url("/images/champions/splash/${hero.name.toLowerCase().replace(/\s+/g, '')}.jpg")`,
                    }}
                  />
                  {hero.name.toLowerCase()}
                </div>
              )}
            </div>
          )
        )}
      </motion.div>
    </>
  );
};

export default TeamPicks;
