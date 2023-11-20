import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

export const FinishView = () => {
  const { redTeam, blueTeam } = useTeams();

  if (!redTeam || !blueTeam) return null;

  return (
    <div className="flex h-screen flex-col items-center px-6">
      <motion.div
        initial={{ y: '-10px', opacity: 0 }} // start at half the size
        animate={{ y: '0px', opacity: 1 }} // animate to full size
        transition={defaultTransition}
        className="text-center"
      >
        <h1 className="mt-8 text-4xl font-bold">{'Draft terminé!'}</h1>
      </motion.div>
      <div className="flex w-full items-center gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={defaultTransition}
          className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-blue to-transparent opacity-25"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1
            className={`text-md mb-4 w-fit rounded-full px-8 py-1 text-center uppercase bg-${blueTeam.color}`}
          >
            {' '}
            {blueTeam.name}
          </h1>
          <div className="flex h-96 gap-2">
            {(blueTeam.heroes_selected as unknown as Hero[]).map(
              (hero: Hero, index: number) => (
                <div key={index}>
                  <div className="relative h-full">
                    <h1 className="absolute left-0 top-0 flex h-full w-full items-end justify-center bg-black bg-opacity-20 bg-gradient-to-t from-[#000000f5] via-transparent pb-12">
                      {hero.name}
                    </h1>
                    <Image
                      className="h-full overflow-hidden rounded-sm object-cover"
                      width={1024}
                      height={1024}
                      src={`/images/champions/splash/${hero.id
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[\W_]+/g, '')}.jpg`}
                      alt={''}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
        >
          <p className="text-lg font-bold">VS</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={defaultTransition}
          className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-r from-transparent to-red opacity-25"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1
            className={`text-md mb-4 ml-auto w-fit rounded-full px-8 py-1 text-center uppercase bg-${redTeam.color}`}
          >
            {' '}
            {redTeam.name}
          </h1>
          <div className="flex h-96 gap-2">
            {(redTeam.heroes_selected as unknown as Hero[]).map(
              (hero: Hero, index: number) => (
                <div key={index}>
                  <div className="relative h-full">
                    <h1 className="absolute left-0 top-0 flex h-full w-full items-end justify-center bg-black bg-opacity-20 bg-gradient-to-t from-[#000000f5] via-transparent pb-12">
                      {hero.name}
                    </h1>
                    <Image
                      className="h-full overflow-hidden rounded-sm object-cover"
                      width={1024}
                      height={1024}
                      src={`/images/champions/splash/${hero.id
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[\W_]+/g, '')}.jpg`}
                      alt={''}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
