import TeamPicks from "@/app/components/team/TeamPicks";
import TeamBans from "@/app/components/team/TeamBans";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";

const RoomInfo = () => {
  const { blue, red } = useTeams(teamStore);

  return (
    <>

      <div className="flex flex-col justify-center items-stretch">
        <div className="flex flex-row justify-between w-full gap-96">
          <TeamBans team={blue} />
          <TeamBans team={red} />
        </div>

        <div className="flex flex-row justify-between w-full h-full gap-24 mt-4">
          <TeamPicks team={blue} />
          <TeamPicks team={red} />
        </div>
      </div>

    </>
  );
};

export default RoomInfo;
