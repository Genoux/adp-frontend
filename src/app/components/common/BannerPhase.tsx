import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';

import SocketContext from "../../context/SocketContext";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import { roomStore } from "@/app/stores/roomStore";

interface BannerPhaseProps {
  roomStatus: "ban" | "select" | string | null | undefined;
  onBannerVisibleChange?: (visible: boolean) => void;
}

const BannerPhase: React.FC<BannerPhaseProps> = ({ roomStatus, onBannerVisibleChange }) => {
    type AnimationState = {
        zIndex: number;
        opacity: number;
    };

    const [animationState, setAnimationState] = useState<AnimationState>({
        zIndex: 50,
        opacity: 0
    });

  const isBanPhase = roomStatus === 'ban';
  
  const socket = useEnsureContext(SocketContext);

  const { room, error, isLoading } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

    useEffect(() => {
      let opacityTimeout: NodeJS.Timeout | null = null;
      let zIndexTimeout: NodeJS.Timeout | null = null;
  
      if (roomStatus === "ban" || roomStatus === "select") {
        setAnimationState({ opacity: 1, zIndex: 50 });
       // socket?.emit("STOP_TIMER", { roomid: room?.id });
          onBannerVisibleChange && onBannerVisibleChange(true);  // Banner becomes visible
  
          opacityTimeout = setTimeout(() => {
              setAnimationState(prev => ({ ...prev, opacity: 0 }));
  
              zIndexTimeout = setTimeout(() => {
                  setAnimationState(prev => ({ ...prev, zIndex: 0 }));
                onBannerVisibleChange && onBannerVisibleChange(false);  // Banner hides
            //    socket?.emit("START_TIMER", { roomid: room?.id });
              }, 300);
          }, 2000);
      } else {
          setAnimationState({ opacity: 0, zIndex: 0 });
          onBannerVisibleChange && onBannerVisibleChange(false);
          if (opacityTimeout) clearTimeout(opacityTimeout);
          if (zIndexTimeout) clearTimeout(zIndexTimeout);
      }
  
      return () => {
          if (opacityTimeout) clearTimeout(opacityTimeout);
          if (zIndexTimeout) clearTimeout(zIndexTimeout);
      };
  }, [roomStatus]);
  
  

    return (
        <motion.div
            exit="exit"
            initial={{ x: 0, opacity: 0, zIndex: 50 }}
            animate={animationState}
            transition={{
                delay: .5,
                duration: 0.3,
                ease: [0.585, 0.535, 0.230, 0.850]
            }}
        className="absolute top-0 left-0 w-full h-full bg-gray-950 bg-opacity-50">
            <div className="flex items-center justify-center h-full w-full">
                <div className={`w-full rounded-sm shadow-xl py-12 font-bold text-center ${isBanPhase ? 'bg-red-600 text-red-950' : 'bg-yellow text-yellow-text'}`}>
                    <h1 className="text-8xl font-bold">{isBanPhase ? 'BAN PHASE' : 'PICK PHASE'}</h1>
                </div>
            </div>
        </motion.div>
    );
}

export default BannerPhase;
