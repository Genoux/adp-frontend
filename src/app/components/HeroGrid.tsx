interface HeroGridProps {
  team?: any;
  room?: any;
  color: string;
  useTiles?: boolean;
}

const HeroGrid: React.FC<HeroGridProps> = ({ team, room, color, useTiles }) => {
  if (!team) return null; // return null when team is null

  return (
    <>
      <div
        className={`font-semibold uppercase text-xs w-full py-1 ${
          team.isTurn
            ? `bg-${team.color}-600`
            : "text-2xl font-semibold bg-zinc-900 opacity-30"
        }`}>
        {team.name}
      </div>

      <div
        className={`grid grid-cols-5 gap-2 mt-6 ${
          team.isTurn ? `opacity-100` : "opacity-30"
        }`}>
        {team.heroes_selected.map((hero: any, index: number) => (
          <div
            key={index}
            className={`h-60 w-full overflow-hidden relative ${
              hero.name ? "" : "border border-white border-opacity-10"
            }`}>
            {hero.name && (
              <div>
                <p className="absolute z-50 w-full h-full flex justify-center items-end pb-6 font-medium">
                  {hero.name}
                </p>
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black via-transparent to-transparent bg-clip-content z-40"></div>
                <div
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/images/champions/splash/${hero.name
                      .replace(/\s/g, "")
                      .toLowerCase()}.jpg')`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default HeroGrid;
