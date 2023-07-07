import { roomStore } from "@/app/stores/roomStore";
import HeroGrid from "./HeroGrid";
import useFetchTeam from "@/app/hooks/useFetchTeam";
interface FinishViewProps {
  roomid: string;
}

const FinishView: React.FC<FinishViewProps> = ({ roomid }) => {
  const { rooms } = roomStore();
  const room = rooms[roomid];

  const { data: blue } = useFetchTeam(room.blue);
  const { data: red } = useFetchTeam(room.red);

  if (!blue || !red) return null;

  return (
    <div className="text-center">
    <h1 className="my-12 text-3xl font-medium">
      The room has finished
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {[blue, red].map((team) => (
        <div key={team.name}>
          <h1 className={`text-left text-3xl font-semibold mb-4 bg-${team.color}-600 bg-opacity-10 px-4 py-2 rounded-sm`}>{team.name}</h1>
          <div className="grid grid-cols-5 gap-2">
            {team.heroes_selected.map((hero: any, index: number) => (
              <div
                key={index}
                className="h-96 w-full overflow-hidden relative"
              >
                {hero.name && (
                  <div>
                    <p className="absolute z-50 w-full h-full flex justify-center items-end pb-6 font-medium">
                      {hero.name}
                    </p>
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
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default FinishView;
