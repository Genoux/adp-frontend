import AnimatedDot from '@/app/components/common/AnimatedDot';

interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  text = 'Connection en cours',
}) => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <div className="flex gap-1">
      <p>{text}</p>
      <AnimatedDot />
    </div>
  </div>
);

export default LoadingScreen;
