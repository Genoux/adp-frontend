import React from 'react';

interface TeamNameProps {
  color: string; // Add the color property
  name: string; // Add the name property
}

const TeamName: React.FC<TeamNameProps> = ({
  name, // Use the name property
  color,
}) => {
  return (
    <>
      <div
        className={`bg-${color}-500 border bg-opacity-25 border-${color} flex h-7 w-fit items-center gap-2 rounded-md px-2`}
      >
        <div
          className={`h-2.5 w-2.5 rounded-full text-sm font-medium bg-${color}`}
        ></div>
        {name}
      </div>
    </>
  );
};

export default TeamName;
