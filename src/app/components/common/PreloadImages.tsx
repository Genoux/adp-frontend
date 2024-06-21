import { useEffect } from 'react';

const PreloadImages = ({ imageUrls }: { imageUrls: string[] }) => {
  console.log("PreloadImages - imageUrls:", imageUrls);
  useEffect(() => {
    imageUrls.forEach((url) => {
      console.log("imageUrls.forEach - url:", url);
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);

  return null;
};

export default PreloadImages;
