import { useContext } from 'react';

export default function useEnsureContext<T>(
  Context: React.Context<T | null>
): T {
  const contextValue = useContext(Context);

  if (contextValue === null) {
    throw new Error(
      'Context value is null. Ensure that a provider is used in a parent component.'
    );
  }

  return contextValue;
}
