// components/ExtendedImage.tsx
import Image, { ImageProps } from 'next/image';
import React from 'react';
//https://imagedelivery.net/obj8qQ0FaKD6VU0bck1DVA/caitlyn-tiles/w=150
const baseURL = 'https://imagedelivery.net/obj8qQ0FaKD6VU0bck1DVA'; // Set your base URL for images

const formatImageName = (name: string): string => {
  return name.toLowerCase().replace(/[\s\W_]+/g, '');
};

interface ExtendedImageProps extends ImageProps {
  src: string;
  type: string;
  variant?: string;
  alt: string;
}

const ExtendedImage: React.FC<ExtendedImageProps> = ({ src, type, variant, alt, ...props }) => {
  const parts = src.split('/');
  const fileName = parts.pop();
  const formattedFileName = formatImageName(fileName as string);
  const imageUrl = `${baseURL}/${formattedFileName}-${type}/${variant}`;

  return (
    <Image
      src={imageUrl}
      placeholder='blur'
      blurDataURL={imageUrl}
      alt={alt}
      {...props}
    />
  );
};

export default React.memo(ExtendedImage);
