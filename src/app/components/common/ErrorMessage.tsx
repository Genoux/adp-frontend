import { Button } from '@/app/components/ui/button';
import { ServerCrash } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const handleRefresh: () => void = () => {
  window.location.reload();
};

const ErrorMessage: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <ServerCrash size={48} />
      <div className="flex flex-col items-center gap-1">
        <p className="px-24 text-2xl font-bold">
          Impossible de se connecter au serveur.
        </p>
        <p className="text-sm opacity-60">
          Veuillez réessayer plus tard ou essayer de rafraîchir.
        </p>
      </div>
      <div className="flex gap-2">
        <Link href="/">
          <Button variant="outline">Accueil</Button>
        </Link>
        <Button variant="secondary" onClick={handleRefresh}>
          Rafraîchir
        </Button>
      </div>
    </div>
  );
};

export default ErrorMessage;
