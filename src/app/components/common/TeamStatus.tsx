import React from 'react';
import { CheckIcon } from 'lucide-react'; // Update with your import path for CheckIcon

interface TeamStatusProps {
  team: {
    connected: boolean;
    ready: boolean;
    name: string;
  };
  showReadyState?: boolean; // if true, will show the 'ready' state if the team is ready
}

const TeamStatus: React.FC<TeamStatusProps> = ({ team, showReadyState = true }) => {
  if (team.connected) {
    if (showReadyState && team.ready) {
      return (
        <div className="flex gap-1 items-center px-2 py-1 border rounded-full bg-opacity-10 transition-all border-green-500 bg-green-500">
          <CheckIcon className="w-3 h-3 text-green-500" />
          <p className="text-xs font-medium -mt-0.5">prêt</p>
        </div>
      );
    }
    return (
      <div className={`flex gap-1 items-center px-2 py-1 border rounded-full bg-opacity-10 transition-all bg-yellow-200 bg-yellow-transparent border-yellow`}>
        <div className="animate-pulse h-2 w-2 rounded-full bg-gradient-to-t from-yellowSecond to-yellow"></div>
        <p className="text-xs font-medium -mt-0.5">connecté</p>
      </div>
    );
  } else {
    return (
      <div className="flex gap-1 items-center px-2 py-1 border border-gray-700 rounded-full opacity-70 transition-all">
        <div className="h-2 w-2 rounded-full bg-gray-700"></div>
        <p className="text-xs font-medium -mt-0.5">{`déconnecté`}</p>
      </div>
    );
  }
}

export default TeamStatus;
