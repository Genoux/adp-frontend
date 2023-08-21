import { useState, useEffect } from "react";
import { setWaiting, setPlanning, setBan, setSelect, setFinish } from "@/app/utils/stateController";

interface StateControllerButtonsProps {
  roomid: string;
}


const StateControllerButtons: React.FC<StateControllerButtonsProps> = ({ roomid }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'F1') {
        setIsVisible(!isVisible);
        return;
      }

      if (!isVisible) return;

      switch (event.key) {
        case "1":
          setWaiting(roomid);
          break;
        case "2":
          setPlanning(roomid);
          break;
        case "3":
          setBan(roomid);
          break;
        case "4":
          setSelect(roomid);
          break;
        case "5":
          setFinish(roomid);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, roomid]);

  if (!isVisible) return null;

  return (
    <div className="flex flex-row gap-4 hidden">
      <button className="btn btn-primary" onClick={() => setWaiting(roomid)}>
        Set Waiting
      </button>
      <button className="btn btn-primary" onClick={() => setPlanning(roomid)}>
        Set Planning
      </button>
      <button className="btn btn-primary" onClick={() => setBan(roomid)}>
        Set Ban
      </button>
      <button className="btn btn-primary" onClick={() => setSelect(roomid)}>
        Set Select
      </button>
      <button className="btn btn-primary" onClick={() => setFinish(roomid)}>
        Set Finish
      </button>
    </div>
  );
};

export default StateControllerButtons;
