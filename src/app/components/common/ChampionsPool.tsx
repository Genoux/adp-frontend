import { roomStore } from '@/app/stores/roomStore';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface Hero {
  name: string;
  id: string;
  selected: boolean;
  clicked_hero: boolean;
}

interface HeroPoolProps {
  team?: Database['public']['Tables']['teams']['Row'];
  selectedChampion?: string;
  canSelect?: boolean;
  handleClickedHero?: (hero: Hero) => void;
}

const ChampionsPool: React.FC<HeroPoolProps> = ({
  team,
  selectedChampion,
  canSelect,
  handleClickedHero = () => { },
}) => {
  const { room } = roomStore();


  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <div className="flex flex-col px-6 lg:px-24">
      <div className="grid cursor-pointer grid-cols-10 gap-2">
        {(room.heroes_pool as unknown as Hero[]).map(
          (hero: Hero, index: number) => {
            const isActive =
              (hero.name === selectedChampion && team?.isturn);
            const isturnAvailable = team ? team.isturn : true;
            const shouldFade = hero.selected || (team && !isturnAvailable);
            return (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: shouldFade ? 0.7 : 1 }}
                transition={{ duration: .1, ease: [0.4, 0.0, 0.2, 1] }}
                key={index}
                whileTap={hero.name !== selectedChampion && canSelect
                  ? {
                    scale: 0.9,
                    zIndex: 50,
                  }
                  : {}}
                whileHover={
                  hero.name !== selectedChampion || !canSelect
                    ? {
                      scale: 1.05,
                      zIndex: 50,
                    }
                    : {}
                }
                className={clsx('z-10 overflow-hidden rounded-md', {
                  'bg-gray-800': isActive,
                  grayscale: hero.selected,
                  'pointer-events-none': hero.selected || !isturnAvailable,
                  'glow-yellow z-50 overflow-hidden rounded-xl border border-yellow border-opacity-100 bg-transparent p-1':
                    hero.name === selectedChampion && team?.isturn,
                })}
                onClick={canSelect ? () => handleClickedHero(hero) : undefined}
              >
                <motion.div className="relative z-10 overflow-hidden rounded-lg transition-all">
                  <Image
                    priority
                    src={`/images/champions/tiles/${hero.id
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .replace(/[\W_]+/g, '')}.jpg`}
                    alt={hero.name}
                    sizes="100vw"
                    width={500}
                    height={500}
                  />

                  <div className="my-auto flex items-center justify-center overflow-hidden">
                    <AnimatePresence>
                      <motion.div
                        transition={{ duration: .2, ease: [0.4, 0.0, 0.2, 1] }}
                        whileHover={
                          hero.name !== selectedChampion || !canSelect
                            ? {
                              opacity: 1,
                            }
                            : { opacity: 0 }
                        } className='absolute z-50 top-0 justify-center text-center w-full h-full flex items-center opacity-0'>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.1,
                            ease: [0.4, 0.0, 0.2, 1],
                          }}
                          className="absolute left-0 top-0 z-50 h-full w-full overflow-hidden rounded-lg bg-gradient-to-t from-yellow to-transparent bg-clip-content"
                        ></motion.div>
                        <p className="text-sm font-bold text-white z-10">{hero.name}</p>
                        <Image
                          src={`/images/champions/splash/${hero.id
                            .toLowerCase()
                            .replace(/\s+/g, '')
                            .replace(/[\W_]+/g, '')}.jpg`}
                          alt={hero.name}
                          width={500}
                          height={500}
                          className="h-full w-full object-cover scale-110 absolute"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <AnimatePresence>
                      {isActive && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.4, 0.0, 0.2, 1],
                            }}
                            className="absolute left-0 top-0 z-50 h-full w-full overflow-hidden rounded-lg bg-gradient-to-t from-yellow to-transparent bg-clip-content"
                          ></motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.4, 0.0, 0.2, 1],
                            }}
                            className={`absolute top-0 z-50 flex h-full items-center text-center text-sm font-bold text-white`}
                          >
                            <p className="z-50">{hero.name}</p>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            whileHover={{ scale: 1 }}
                            exit={{ scale: 1, opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ duration: 0, ease: [0.4, 0.0, 0.2, 1] }}
                            className="absolute left-0 top-0 mx-auto h-full w-full object-cover"
                          >
                            <Image
                              src={`/images/champions/splash/${hero.id
                                .toLowerCase()
                                .replace(/\s+/g, '')
                                .replace(/[\W_]+/g, '')}.jpg`}
                              alt={hero.name}
                              width={500}
                              height={500}
                              priority
                              className="h-full w-full object-cover"
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ChampionsPool;
