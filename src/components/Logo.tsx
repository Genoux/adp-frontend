import * as React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  fill?: string;
}

const Logo: React.FC<LogoProps> = ({ size = '100', fill = 'currentColor', ...props }) => (
  <svg width={size} viewBox="0 0 512 512" {...props} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    <path d="M148.77 342.588C148.77 342.588 151.322 276.079 218.937 229.75C286.552 183.402 328.264 192.137 328.264 192.137C328.264 192.137 226.426 228.046 209.143 351.55C194.456 456.505 249.83 511.11 249.83 511.11C249.83 511.11 245.84 373.589 317.312 320.096C386.949 267.977 409.859 342.597 409.859 342.597C409.859 342.597 459.788 301.061 447.609 240.505C435.422 179.95 365.807 186.773 365.807 186.773L272.576 0C272.576 0 233.103 199.803 160.189 213.621C120.579 221.123 107.968 176.008 107.968 176.008C107.968 176.008 50.8761 220.08 64.6093 279.965C78.1129 338.899 148.761 342.588 148.761 342.588H148.77Z" fill={fill} />
  </svg>
);

export default Logo;