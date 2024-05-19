import ConfirmButton from '@/app/components/common/ConfirmButton';
import TeamBans from '@/app/components/team/TeamBans';
import TeamPicks from '@/app/components/team/TeamPicks';
import useTeams from '@/app/hooks/useTeams';
import clsx from 'clsx';
interface DraftViewProps {
  className?: string | '';
}

const DraftView: React.FC<DraftViewProps> = ({ className }) => {
  const { redTeam, blueTeam } = useTeams();

  return (
    <div className={clsx('flex h-full flex-col justify-evenly gap-4 border border-[#8f8f8f] border-opacity-5 bg-neutral-950 bg-opacity-40 p-4', className)}>
      <div className="grid w-full min-h-[100px] max-h-[100px] grid-cols-3 items-center">
        <TeamBans team={blueTeam} />
        <ConfirmButton />
        <TeamBans team={redTeam} />
      </div>
      <div className="grid h-full w-full grid-cols-2 gap-12">
        <TeamPicks team={blueTeam} />
        <TeamPicks team={redTeam} />
      </div>
    </div>
  );
};

export default DraftView;
