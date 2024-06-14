interface LoaderProps {
  variant?: string;
  size?: string;
  color?: string;
}

const CircleLoader: React.FC<LoaderProps> = ({
  variant = '',
  size = 'w-6 h-6',
  color = '#D9D9D9',
}) => (
  <svg className={`circle-loader ${variant} ${size}`} viewBox="0 0 50 50">
    <circle
      className="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

export default CircleLoader;
