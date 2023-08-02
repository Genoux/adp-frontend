interface Team {
  [key: string]: any;
}

interface Hero {
  name: string;
  selected: boolean;
}

const TeamBans = ({ team }: Team) => {
  return (
    <>
      <div
        className={`grid grid-cols-5 gap-2 mt-6 h-full w-full border`}>
        {(team.heroes_ban as unknown as Hero[]).map(
          (hero: Hero, index: number) => (
            <div
              key={index}
              className={`h-full w-full overflow-hidden relative rounded-md ${
                hero && hero.selected ? "bg-draftEmpty" : "border border-green-500 border-opacity-10"
                }`}>
              {hero && hero.name && (
                <div>
                  <p className="absolute z-50 w-full h-full flex justify-center items-end pb-6 font-medium">
                    {hero.name}
                  </p>
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center grayscale"
                    style={{
                      backgroundImage: `url('/images/champions/splash/${hero.name}.jpg')`,
                    }}
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default TeamBans;
