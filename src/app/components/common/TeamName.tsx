import clsx from 'clsx';

type TeamNameProps = {
  color: string;
  name: string;
  className?: string;
};

const TeamName: React.FC<TeamNameProps> = ({ name, color, className }) => {
  const commonCSS = `uppercase flex w-fit items-center gap-2 border border-opacity-20 bg-opacity-20 px-2 truncate`;
  return (
    <>
      {color === 'blue' ? (
        <div
          className={clsx(commonCSS, `border-blue-500 bg-blue-600`, className)}
        >
          <div className={`h-2.5 w-2.5 bg-blue-600 text-sm font-medium`}></div>
          {name}
        </div>
      ) : (
        <div
          className={clsx(commonCSS, `border-red-500 bg-red-600`, className)}
        >
          <div className={`h-2.5 w-2.5 bg-red-600 text-sm font-medium`}></div>
          {name}
        </div>
      )}
    </>
  );
};

export default TeamName;
