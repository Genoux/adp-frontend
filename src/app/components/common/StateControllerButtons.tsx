import {
  setDraft,
  setFinish,
  setPlanning,
  setWaiting,
  userTrigger,
} from '@/app/utils/stateController';
import { useEffect, useState } from 'react';

const StateControllerButtons = ({ roomID }: { roomID: number }) => {
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
          setWaiting(roomID);
          break;
        case '2':
          setPlanning(roomID);
          break;
        case '3':
          setDraft(roomID);
          break;
        case '4':
          userTrigger(roomID);
          break;
        case '5':
          setFinish(roomID);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, roomID]);

  if (!isVisible) return null;

  return (
    <div className="hidden flex-row gap-4">
      <button className="btn btn-primary" onClick={() => setWaiting(roomID)}>
        Set Waiting
      </button>
      <button className="btn btn-primary" onClick={() => setPlanning(roomID)}>
        Set Planning
      </button>
      <button className="btn btn-primary" onClick={() => setDraft(roomID)}>
        Set Ban
      </button>
      <button className="btn btn-primary" onClick={() => userTrigger(roomID)}>
        Trigger select
      </button>
      <button className="btn btn-primary" onClick={() => setFinish(roomID)}>
        Set Finish
      </button>
    </div>
  );
};

export default StateControllerButtons;
