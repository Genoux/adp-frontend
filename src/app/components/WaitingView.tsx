import { roomStore } from "@/app/stores/roomStore";
import HeroPool from "./HeroPool";

const WaitingView = () => {
  const { room } = roomStore();

  if (!room) {
    return null;
  }

  return ( <HeroPool /> );
};

export default WaitingView;
