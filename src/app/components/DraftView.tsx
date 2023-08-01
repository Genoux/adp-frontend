import TeamPicks from "@/app/components/team/TeamPicks";
import TeamBans from "@/app/components/team/TeamBans";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";

const RoomInfo = () => {
  const { blue, red } = useTeams(teamStore);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-12 gap-6 justify-center">
        <div>
          <TeamBans team={blue} color="blue" />
          <TeamPicks team={blue} color="blue" />
        </div>
        <div className="relative">
          <TeamBans team={red} color="red" />
          <TeamPicks team={red} color="red" />
        </div>
      </div>
    </>
  );
};

export default RoomInfo;
