import ChampionsPool from '@/app/components/common/ChampionsPool';
import Timer from '@/app/components/common/RoomTimer';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import clsx from 'clsx';

export const PlanningView = ({ className }: { className?: string }) => {
  const { room } = useRoomStore();
  const { blueTeam, redTeam } = useTeams();
  const teamNameStyle = 'text-xl uppercase font-extrabold px-4 py-3 w-64 bg-opacity-10 truncate'

  if (!room) {
    return null;
  }

  return (
    <div className={clsx('mx-auto flex max-w-screen-xl flex-col items-center justify-center px-4', className)}>
      <div className='w-full flex flex-col gap-6 items-center justify-center'>
        <div className="grid grid-cols-3 w-full items-end">
          <div className='flex justify-start'>
            <h1 className={clsx('border-l-8 border-blue-600 bg-blue-700 text-lef', teamNameStyle)}>{blueTeam?.name}</h1>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Timer className="text-5xl" />
            <div className="text-center">
              <h1 className="text-2xl font-bold w-full lg:text-3xl">Phase de planification</h1>
              <p className="text-sm lg:text-base text-[#737373]">
                {'Analyse de la sélection de champions'}
              </p>
            </div>
          </div>
          <div className='flex justify-end'>
            <h1 className={clsx('border-r-8 border-red-600 bg-red-700 text-right', teamNameStyle)}>{redTeam?.name}</h1>
          </div>
        </div>
        <ChampionsPool />
      </div>
    </div>
  );
};

export default PlanningView;
