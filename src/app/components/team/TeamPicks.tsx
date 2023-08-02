import { roomStore } from "@/app/stores/roomStore";

interface Team {
  [key: string]: any;
}

interface Hero {
  name: string;
  selected: boolean;
}

const TeamPicks = ({ team }: Team) => {

  const { room } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  return (
    <>
      <div
        className={`grid grid-cols-5 gap-2 mt-6 h-full w-full border border-yellow-500 ${team.isTurn || room?.status === "done" ? `opacity-100` : "opacity-30"
          }`}>
        {(team.heroes_selected as unknown as Hero[]).map(
          (hero: Hero, index: number) => (
            <div
              key={index}
              className={`h-full w-full overflow-hidden relative ${hero.name ? "" : "border border-white border-opacity-10"
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

export default TeamPicks;
