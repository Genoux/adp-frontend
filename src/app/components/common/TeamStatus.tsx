import { CheckIcon } from 'lucide-react'; // Update with your import path for CheckIcon
import React from 'react';

interface TeamStatusProps {
  team: {
    [key: string]: any;
  };
  showReadyState?: boolean; // if true, will show the 'ready' state if the team is ready
}

const TeamStatus: React.FC<TeamStatusProps> = ({
  team,
  showReadyState = true,
}) => {
  if (showReadyState && team.ready) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-green-500 bg-green-500 bg-opacity-10 px-2 py-1 transition-all h-6">
        <CheckIcon className="h-3 w-3 text-green-500" />
        <p className="-mt-0.5 text-xs font-medium pr-0.5">prêt</p>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1 rounded-full border border-gray-700 px-2 py-1 opacity-70 transition-all h-6">
        <div className="mr-1 h-2 w-2 rounded-full bg-zinc-600"></div>
        <p className="-mt-0.5 text-xs font-light pr-0.5">{`pas prêt`}</p>
      </div>
    );
  }
};

export default TeamStatus;
