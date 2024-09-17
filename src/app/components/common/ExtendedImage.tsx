'use client';

import blurHashes from '@/app/data/blurhashes.json';
import { useQuery } from '@tanstack/react-query';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Blurhash } from 'react-blurhash';

interface ExtendedImageProps {
  heroId: string;
  type: 'tiles' | 'centered';
  size: 'small' | 'medium' | 'large' | 'default';
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_BLURHASH = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';

const fetchImageData = async (heroId: string) => {
  const response = await fetch(`/api/image/${heroId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const ExtendedImage: React.FC<ExtendedImageProps> = ({
  heroId,
  type,
  size,
  alt,
  style,
  className,
}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['image', heroId],
    queryFn: () => fetchImageData(heroId),
    staleTime: Infinity,
  });

  const [isImageLoaded, setIsImageLoaded] = React.useState(false);

  const blurhash =
    (blurHashes as Record<string, { hash: string }>)[heroId]?.hash ||
    DEFAULT_BLURHASH;

  const imageData = data?.imageUrls?.[type]?.[size];
  const imageUrl = imageData?.url;

  return (
    <div
      className={`relative h-full w-full ${className || ''}`}
      style={{ ...style }}
    >
      {error ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-gray-500 bg-slate-700 px-2 opacity-25">
          <ImageOff size={12} className="text-2xl text-gray-300" />
          <p className="text-center text-[10px] text-gray-300">
            {error.message}
          </p>
        </div>
      ) : (
        <>
          <Blurhash
            hash={blurhash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={alt}
              fill
              style={{
                objectFit: 'cover',
                opacity: isImageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExtendedImage;
