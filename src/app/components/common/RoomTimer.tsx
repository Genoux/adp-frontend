import { useState, useCallback, useEffect } from "react";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import SocketContext from "@/app/context/SocketContext";

interface TimerProps {
  className?: string;
}
const Timer: React.FC<TimerProps> = ({ className }) => {
  const [timer, setTimer] = useState<string>("");

  const socket = useEnsureContext(SocketContext);

  const handleSocketEvents = useCallback((event: string) => {
    setTimer(event);
  }, []);

  useEffect(() => {
    socket?.on("TIMER", handleSocketEvents);

    return () => {
      socket?.off("TIMER", handleSocketEvents);
    };
  }, [handleSocketEvents, socket]);

  return (
    <div className={className}>
      <h1 className="font-bold text-3xl w-fit mx-auto ">
        {timer || "00:00"}
      </h1>
    </div>
  );
};

export default Timer;
