import useTeams from "@/app/hooks/useTeams";
import { defaultTransition } from '@/app/lib/animationConfig'
import { motion } from "framer-motion";
import Image from "next/image";

interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

export const FinishView = () => {
  const { redTeam, blueTeam } = useTeams();

  if (!redTeam || !blueTeam) return null;

  return (
    <div className="px-6 h-screen flex flex-col items-center">
      <motion.div
        initial={{ y: "-10px", opacity: 0 }}  // start at half the size
        animate={{ y: "0px", opacity: 1 }}    // animate to full size
        transition={defaultTransition}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mt-8">{"Draft terminé!"}</h1>
      </motion.div>
      <div className="flex items-center gap-6 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: .25 }}
          transition={defaultTransition}
          className="bg-gradient-to-r from-blue to-transparent absolute left-0 top-0 h-full w-1/2 opacity-25"></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1 className={`text-md py-1 w-fit px-8 uppercase mb-4 rounded-full text-center bg-${blueTeam.color}`}> {blueTeam.name}</h1>
          <div className="flex h-96 gap-2">
            {(blueTeam.heroes_selected as unknown as Hero[]).map((hero: Hero, index: number) => (
              <div
                key={index}
              >
                <div className="relative h-full">
                  <h1 className="bg-gradient-to-t from-[#000000f5] via-transparent absolute top-0 left-0 flex items-end pb-12 bg-black bg-opacity-20 justify-center w-full h-full">{hero.name}</h1>
                  <Image className="h-full object-cover rounded-sm overflow-hidden" width={1024} height={1024} src={`/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`} alt={""} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
        >
          <p className="font-bold text-lg">VS</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: .25 }}
          transition={defaultTransition}
          className="bg-gradient-to-r from-transparent to-red absolute right-0 top-0 h-full w-1/2 opacity-25"
        >
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1 className={`text-md py-1 w-fit px-8 uppercase mb-4 rounded-full text-center ml-auto bg-${redTeam.color}`}> {redTeam.name}</h1>
          <div className="flex h-96 gap-2">
            {(redTeam.heroes_selected as unknown as Hero[]).map((hero: Hero, index: number) => (
              <div
                key={index}
              >
                <div className="relative h-full">
                  <h1 className="bg-gradient-to-t from-[#000000f5] via-transparent absolute top-0 left-0 flex items-end pb-12 bg-black bg-opacity-20 justify-center w-full h-full">{hero.name}</h1>
                  <Image className="h-full object-cover rounded-sm overflow-hidden" width={1024} height={1024} src={`/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`} alt={""} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
