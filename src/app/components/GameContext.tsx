import React from 'react';

export const GameContext = React.createContext({
  selectedChampion: "",
  setSelectedChampion: (_: string) => {}, // Accepts a string, but does nothing
  canSelect: true,
  setCanSelect: (_: boolean) => {}, // Accepts a boolean, but does nothing
  handleSocketTimer: (_: any) => {} // Accepts any, but does nothing
});