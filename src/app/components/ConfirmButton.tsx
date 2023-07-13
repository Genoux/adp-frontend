import { Button } from "@/app/components/ui/button";
import clsx from "clsx";
import { Database } from "../types/supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"];


function getOppositeColor(color: string) {
  if (color.toLowerCase() === "red") {
    return "blue";
  } else if (color.toLowerCase() === "blue") {
    return "red";
  } else {
    return "Unknown color"; // or you may throw an error here
  }
}

const ConfirmButton = ({
  team,
  selectedChampion,
  canSelect,
  handleConfirmSelection,
}: {
  team: Team;
  selectedChampion: string;
  canSelect: boolean;
  handleConfirmSelection: () => void;
}) => {
  return (
    <div className="py-10">
      {team.isTurn ? (
        <Button
          size="lg"
          className={clsx("py-2 px-4", {
            "pointer-events-none": !selectedChampion || !canSelect,
          })}
          onClick={handleConfirmSelection}
          disabled={!selectedChampion || !canSelect}>
          Confirm Selection
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="lg"
          className={clsx({
            "pointer-events-none":
              !selectedChampion || !canSelect || !team.isTurn,
          })}>
          <p className="pr-0.5 text-xl">{`It's ${getOppositeColor(
            team.color?.toLowerCase() || ""
          )} team to pick`}</p>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </Button>
      )}
    </div>
  );
};

export default ConfirmButton;