import React from 'react';

interface TeamNameProps {
  color: string;
  name: string;
}

const TeamName: React.FC<TeamNameProps> = ({ name, color }) => {
  return (
    <>
      {color === 'blue' ? (
        <div
          className={`flex h-7 w-fit items-center gap-2 border border-blue-500 border-opacity-40 bg-blue-600 bg-opacity-25 px-2`}
        >
          <div className={`h-2.5 w-2.5 bg-blue-600 text-sm font-medium`}></div>
          {name}
        </div>
      ) : (
        <div
          className={`flex h-7 w-fit items-center gap-2 border border-red-500 border-opacity-40 bg-red-600 bg-opacity-25 px-2`}
        >
          <div className={`h-2.5 w-2.5 bg-red-600 text-sm font-medium`}></div>
          {name}
        </div>
      )}
    </>
  );
};

export default TeamName;
