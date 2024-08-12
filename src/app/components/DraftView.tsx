import ConfirmButton from '@/app/components/common/ConfirmButton';
import TeamBans from '@/app/components/draft/TeamBans';
import TeamPicks from '@/app/components/draft/TeamPicks';
import useTeams from '@/app/hooks/useTeams';
import clsx from 'clsx';

const DraftView = ({ className }: { className?: string }) => {
  const { redTeam, blueTeam } = useTeams();

  return (
    <div
      className={clsx(
        'flex h-full flex-col justify-evenly gap-4 border border-[#8f8f8f] border-opacity-5 bg-black bg-opacity-25 p-4',
        className
      )}
    >
      <div className="grid max-h-[100px] min-h-[80px] w-full grid-cols-3 items-center">
        <TeamBans team={blueTeam!} />
        <ConfirmButton />
        <TeamBans team={redTeam!} />
      </div>
      <div className="grid h-full w-full grid-cols-2 gap-12">
        <TeamPicks team={blueTeam!} />
        <TeamPicks team={redTeam!} />
      </div>
    </div>
  );
};

export default DraftView;
