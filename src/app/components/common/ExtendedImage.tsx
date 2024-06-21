// components/ExtendedImage.tsx
import Image, { ImageProps } from 'next/image';
import React from 'react';

const baseURL = 'http://ddragon.leagueoflegends.com/cdn/img/champion'; // Set your base URL for images

interface ExtendedImageProps extends ImageProps {
  src: string;
  type: 'tiles' | 'splash' | 'centered';
  alt: string;
}

const ExtendedImage: React.FC<ExtendedImageProps> = React.memo(({ src, type, alt, ...props }) => {
  const imageUrl = `${baseURL}/${type}/${src}_0.jpg`;
  return (
    <Image
      src={imageUrl}
      placeholder='blur'
      blurDataURL={imageUrl}
      alt={alt}
      sizes='100%'
      quality={80}
      {...props}
    />
  );
});

ExtendedImage.displayName = 'ExtendedImage';

export default React.memo(ExtendedImage);
