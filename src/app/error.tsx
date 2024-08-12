// app/error.tsx
'use client';

import { Button } from '@/app/components/ui/button';
import { Frown } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Frown size={32} />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div>
          <p className="text-lg font-normal">
            {'Oups! Une erreur est survenue.'}
          </p>
          <p className="text-sm opacity-50">
            {'Si elle persiste, veuillez contacter un administrateur.'}
          </p>
        </div>
        <pre className="text-sm text-red-600 opacity-60">{error.message}</pre>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href="/">
          <Button variant="outline">Accueil</Button>
        </Link>
        <Button variant="secondary" onClick={() => reset()}>
          Rafraîchir
        </Button>
      </div>
    </div>
  );
}
