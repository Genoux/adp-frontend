import { useEffect } from 'react';
import { champions } from '@/app/utils/champions';

type Champions = {
  id: string
  name: string
  selected: boolean
}

const PreloadImages = () => {
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    champions.forEach((champion: Champions) => {
      const imageName = champion.name.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '');
      preloadImage(`/images/champions/splash/${imageName}.webp`);
      preloadImage(`/images/champions/tiles/${imageName}.webp`);
      preloadImage(`/images/champions/floatingSplash/${imageName}.webp`);
    });
  }, []);

  return null;
};

export default PreloadImages;
