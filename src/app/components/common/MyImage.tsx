import Image from 'next/image';
import { useImages } from '@/app/context/ImageContext';  // Import the useImages hook

const MyImage: React.FC<{ src: string, alt: string }> = ({ src, alt }) => {
  const { loadedImages, markAsLoaded } = useImages();

  return (
    <div>
     Is Image Loaded: {String(loadedImages[src])}
      <Image
        src={src}
        alt={alt}
        width={500}
        height={500}
        onLoad={() => markAsLoaded(src)}
      />
    </div>
  );
};

export default MyImage;
