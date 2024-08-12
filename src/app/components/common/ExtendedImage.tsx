import blurData from '@/app/data/blurhashes.json';
import Image, { ImageProps } from 'next/image';
import React from 'react';

interface ExtendedImageProps extends Omit<ImageProps, 'src' | 'width' | 'height'> {
  src: string;
  type: 'tiles' | 'splash' | 'centered';
  alt: string;
  params?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL
const CDN_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion';

type BlurDataType = Record<string, { dataURL: string }>;

const ExtendedImage: React.FC<ExtendedImageProps> = ({
  src,
  type,
  alt,
  params = '',
  style,
  ...props
}) => {
  if (!src) return null;

  const imageUrl = `${BASE_URL}/${params}/${CDN_URL}/${type}/${src}_0.jpg`;

  const widthMatch = params.match(/w_(\d+)/);
  const heightMatch = params.match(/h_(\d+)/);
  const width = widthMatch ? parseInt(widthMatch[1]) : undefined;
  const height = heightMatch ? parseInt(heightMatch[1]) : undefined;

  const useFill = !width && !height;

  const champData = (blurData as BlurDataType)[src];

  return (
    <Image
      src={imageUrl}
      alt={alt}
      {...(useFill
        ? { fill: true }
        : { width: width || 100, height: height || 100 }
      )}
      style={{
        objectPosition: 'center',
        objectFit: 'cover',
        ...(useFill ? { position: 'absolute' } : {}),
        ...style
      }}
      placeholder={champData?.dataURL ? 'blur' : 'empty'}
      blurDataURL={champData?.dataURL}
      priority
      quality={80}
      {...props}
    />
  );
};

export default ExtendedImage;