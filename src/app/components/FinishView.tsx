import TeamPicks from "./TeamPicks";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";

const FinishView = () => {
  const { blue, red } = useTeams(teamStore);

  return (
    <div className="text-center">
      <h1 className="my-12 text-3xl font-medium">The room has finished</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-96 w-full">
        <div>
          {blue?.name}
          <TeamPicks team={blue} color="blue" />
        </div>
        <div>
          {red?.name}
          <TeamPicks team={red} color="red" />
        </div>
      </div>
    </div>
  );
};

export default FinishView;
