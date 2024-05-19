import React from 'react';
interface TeamNameProps {
  color: string;
  name: string;
}

const TeamName: React.FC<TeamNameProps> = ({
  name,
  color,
}) => {
  return (
    <>
      {color === 'blue' ? (
        <div className={`bg-blue-600 border bg-opacity-25 border-blue-500 border-opacity-40 flex h-7 w-fit items-center gap-2 px-2`}>
          <div className={`h-2.5 w-2.5 text-sm font-medium bg-blue-600`}></div>{name}
        </div>
      ) : (
        <div className={`bg-red-600 border bg-opacity-25 border-red-500 border-opacity-40 flex h-7 w-fit items-center gap-2 px-2`}>
          <div className={`h-2.5 w-2.5 text-sm font-medium bg-red-600`}></div>
          {name}
        </div>
      )}

    </>
  );
};

export default TeamName;
