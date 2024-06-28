import Image, { ImageProps } from 'next/image';
import React, { useMemo } from 'react';
import { decode } from 'blurhash';
import blurhashes from '@/app/data/blurhashes.json';

const baseURL = 'https://ddragon.leagueoflegends.com/cdn/img/champion';

interface ExtendedImageProps extends ImageProps {
  src: string;
  type: 'tiles' | 'splash' | 'centered';
  alt: string;
}

const ExtendedImage: React.FC<ExtendedImageProps> = React.memo(({ src, type, alt, width, height, ...props }) => {
  const imageUrl = `${baseURL}/${type}/${src}_0.jpg`;
  const blurHash = (blurhashes as Record<string, string>)[src] || '';
  const blurDataURL = useMemo(() => {
    if (!blurHash) return undefined;

    const pixels = decode(blurHash, 32, 32);
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const imageData = ctx.createImageData(32, 32);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }, [blurHash]);

  if (!src) return null;
  
  if(!blurDataURL) {
    
  };

  return (
    <Image
      src={imageUrl}
      placeholder={'blur'}
      blurDataURL={blurDataURL}
      alt={alt}
      width={width}
      height={height}
      sizes='100vw'
      quality={80}
      {...props}
    />
  );
});

ExtendedImage.displayName = 'ExtendedImage';

export default React.memo(ExtendedImage);