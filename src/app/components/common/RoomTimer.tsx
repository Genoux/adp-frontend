import { useState, useCallback, useEffect } from "react";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import SocketContext from "@/app/context/SocketContext";

const Timer = () => {
  const [timer, setTimer] = useState<string>("");

  const socket = useEnsureContext(SocketContext);

  const handleSocketEvents = useCallback((event: string, msg: any) => {
    setTimer(event);
  }, []);

  useEffect(() => {
    socket?.on("TIMER", handleSocketEvents);

    return () => {
      socket?.off("TIMER", handleSocketEvents);
    };
  }, [handleSocketEvents, socket]);

  return (
    <h1 className="font-bold text-3xl border w-fit mx-auto px-4 py-2 mb-6 rounded-sm">
      {timer || "00:00"}
    </h1>
  );
};

export default Timer;
