import ChampionsPool from '@/app/components/common/ChampionsPool';
import Timer from '@/app/components/common/RoomTimer';
import useTeams from '@/app/hooks/useTeams';
import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';

type PlanningViewProps = {
  className?: string;
};

export const PlanningView = ({ className }: PlanningViewProps) => {
  const { room } = roomStore();
  const { blueTeam, redTeam } = useTeams();
  const teamNameStyle = 'text-3xl uppercase font-extrabold  px-4 py-3  w-fit  bg-opacity-10'

  if (!room) {
    return null;
  }

  return (
    <div className={clsx('mx-auto flex max-w-screen-2xl flex-col items-center justify-center gap-6 px-12', className)} style={{ height: 'calc(100vh - 124px)' }}>

      <div className="grid grid-cols-3 w-full items-end">
        <div className='flex justify-start'>
          <h1 className={clsx('border-l-8 border-blue-600 bg-blue-700 text-lef', teamNameStyle)}>{blueTeam?.name}</h1>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Timer className="w-full" size="large" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Phase de planification</h1>
            <p className="text-base text-[#737373]">
              {'Analyse de la sélection de champions'}
            </p>
          </div>
        </div>
        <div className='flex justify-end'>
          <h1 className={clsx('border-r-8 border-red-600 bg-red-700  text-right', teamNameStyle)}>{redTeam?.name}</h1>
        </div>
      </div>
      <ChampionsPool />
    </div>
  );
};

export default PlanningView;
