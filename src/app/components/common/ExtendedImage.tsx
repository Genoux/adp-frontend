import blurData from '@/app/data/blurhashes.json';
import Image, { ImageProps } from 'next/image';
import React from 'react';

interface ExtendedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  type: 'tiles' | 'splash' | 'centered';
  alt: string;
}

const BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion';

const ExtendedImage: React.FC<ExtendedImageProps> = React.memo(
  ({ src, type, alt, width, height, ...props }) => {
    const imageUrl = `${BASE_URL}/${type}/${src}_0.jpg`;
    const champData = (
      blurData as unknown as Record<
        string,
        { blurhash: string; dataURL: string }
      >
    )[src];

    if (!src) return null;

    return (
      <Image
        src={imageUrl}
        placeholder={champData?.dataURL ? 'blur' : 'empty'}
        blurDataURL={champData?.dataURL}
        alt={alt}
        width={width}
        height={height}
        sizes="100vw"
        priority
        quality={80}
        {...props}
      />
    );
  }
);

ExtendedImage.displayName = 'ExtendedImage';
export default ExtendedImage;
