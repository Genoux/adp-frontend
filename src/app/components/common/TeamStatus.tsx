import { CheckIcon } from 'lucide-react';

type TeamStatusProps ={
  team: {
    ready: boolean;
    [key: string]: any;
  };
  showReadyState?: boolean;
}

const TeamStatus: React.FC<TeamStatusProps> = ({ team, showReadyState }) => {
  return (
    <>
      {team.ready && showReadyState ? (
        <div className="flex h-6 items-center gap-1 border border-green-500 bg-green-500 bg-opacity-10 px-2 py-1">
          <CheckIcon className="h-3 w-3 text-green-500" />
          <p className="-mt-0.5 pr-0.5 text-xs font-medium">prêt</p>
        </div>
      ) : (
        <div className="flex h-6 items-center gap-1 border border-gray-700 px-2 py-1 opacity-70">
          <div className="mr-1 h-2 w-2 bg-zinc-600"></div>
          <p className="-mt-0.5 pr-0.5 text-xs font-light">{`pas prêt`}</p>
        </div>
      )}
    </>
  );
};

export default TeamStatus;
