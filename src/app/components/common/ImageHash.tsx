import { blurHashToDataURL } from '@/app/lib/blurhash/blurHashToDataURL';
import Image from 'next/image';
import { useMemo } from 'react';

export default function ImageHash({
  blurhash,
  ...props
}: React.ComponentProps<typeof Image> & { blurhash?: string }) {
  const base64BlurHash = useMemo(() => {
    if (blurhash) {
      return blurHashToDataURL(blurhash);
    }
    return null;
  }, [blurhash]);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      placeholder="blur"
      blurDataURL={base64BlurHash || undefined}
      {...props}
    />
  );
}
