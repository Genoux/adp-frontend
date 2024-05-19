import {
  setDraft,
  setFinish,
  setPlanning,
  setWaiting,
  userTrigger,
} from '@/app/utils/stateController';
import { useEffect, useState } from 'react';

interface StateControllerButtonsProps {
  roomid: string;
}

const StateControllerButtons: React.FC<StateControllerButtonsProps> = ({
  roomid,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'F1') {
        setIsVisible(!isVisible);
        return;
      }

      if (!isVisible) return;

      switch (event.key) {
        case '1':
          setWaiting(roomid);
          break;
        case '2':
          setPlanning(roomid);
          break;
        case '3':
          setDraft(roomid);
          break;
        case '4':
          userTrigger(roomid);
          break;
        case '5':
          setFinish(roomid);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, roomid]);

  if (!isVisible) return null;

  return (
    <div className="hidden flex-row gap-4">
      <button className="btn btn-primary" onClick={() => setWaiting(roomid)}>
        Set Waiting
      </button>
      <button className="btn btn-primary" onClick={() => setPlanning(roomid)}>
        Set Planning
      </button>
      <button className="btn btn-primary" onClick={() => setDraft(roomid)}>
        Set Ban
      </button>
      <button className="btn btn-primary" onClick={() => userTrigger(roomid)}>
        Trigger select
      </button>
      <button className="btn btn-primary" onClick={() => setFinish(roomid)}>
        Set Finish
      </button>
    </div>
  );
};

export default StateControllerButtons;
