interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  text = 'Connection en cours',
}) => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <div className="flex gap-1">
      <p>{text}</p>
      <div className="sending-animation">
        <span className="sending-animation-dot">.</span>
        <span className="sending-animation-dot">.</span>
        <span className="sending-animation-dot">.</span>
      </div>
    </div>
  </div>
);

export default LoadingScreen;
