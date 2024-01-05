'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface ImageContextProps {
  loadedImages: { [key: string]: boolean };
  markAsLoaded: (src: string) => void;
}

const ImageContext = createContext<ImageContextProps | undefined>(undefined);

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );

  const markAsLoaded = (src: string) => {
    setLoadedImages((prev) => ({ ...prev, [src]: true }));
  };

  return (
    <ImageContext.Provider value={{ loadedImages, markAsLoaded }}>
      {children}
    </ImageContext.Provider>
  );
};
