declare module 'react-blurhash' {
  import { FunctionComponent } from 'react';

  export interface BlurhashProps {
    hash: string;
    width?: number | string;
    height?: number | string;
    resolutionX?: number;
    resolutionY?: number;
    punch?: number;
  }

  const Blurhash: FunctionComponent<BlurhashProps>;

  export { Blurhash };
}
