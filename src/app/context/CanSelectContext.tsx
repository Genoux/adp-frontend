// import React, { createContext, ReactNode, useContext, useState } from 'react';

// interface CanSelectContextProps {
//   canSelect: boolean;
//   setCanSelect: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const CanSelectContext = createContext<CanSelectContextProps | undefined>(
//   undefined
// );

// interface CanSelectProviderProps {
//   children: ReactNode;
// }

// export const CanSelectProvider: React.FC<CanSelectProviderProps> = ({
//   children,
// }) => {
//   const [canSelect, setCanSelect] = useState<boolean>(true);

//   return (
//     <CanSelectContext.Provider value={{ canSelect, setCanSelect }}>
//       {children}
//     </CanSelectContext.Provider>
//   );
// };

// export const useCanSelect = () => {
//   const context = useContext(CanSelectContext);
//   if (context === undefined) {
//     throw new Error('useCanSelect must be used within a CanSelectProvider');
//   }
//   return context;
// };
