import ChampionsPool from '@/app/components/common/ChampionsPool';
import Timer from '@/app/components/common/RoomTimer';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import clsx from 'clsx';
import TeamName from './common/TeamName';

export const PlanningView = ({ className }: { className?: string }) => {
  const { room } = useRoomStore();
  const { blueTeam, redTeam } = useTeams();

  if (!room || !blueTeam || !redTeam) {
    return null;
  }

  return (
    <div
      className={clsx(
        'mx-auto flex max-w-screen-xl flex-col items-center justify-center px-4',
        className
      )}
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="grid w-full grid-cols-3 items-end">
          <div className="flex justify-start">
            <TeamName name={blueTeam.name} color={blueTeam.color} />
          </div>
          <div className="flex flex-col items-center gap-2 pb-4">
            <Timer className="text-4xl" />
            <div className="text-center">
              <h1 className="w-full text-2xl font-bold lg:text-3xl">
                Phase de planification
              </h1>
              <p className="text-sm text-[#737373] lg:text-base">
                {'Analyse de la sélection de champions'}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <TeamName name={redTeam.name} color={redTeam.color} />
          </div>
        </div>
        <ChampionsPool />
      </div>
    </div>
  );
};

export default PlanningView;
