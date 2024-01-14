// BlurHashContext.js
import React, { createContext, useContext, useState } from 'react';

const BlurHashContext = createContext({});

export const useBlurHash = () => useContext(BlurHashContext);

export const BlurHashProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [blurHashes] = useState(() => {
    // Load from JSON file or initialize to empty object
    return require('@/app/data/blurhashes.json');
  });

  return (
    <BlurHashContext.Provider value={blurHashes}>
      {children}
    </BlurHashContext.Provider>
  );
};
