'use client';

import { Suspense } from 'react';
import AddWatchContent from './AddWatchContent';

export default function AddWatchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-xl text-zinc-700 dark:text-zinc-300">
          Chargement...
        </div>
      </div>
    }>
      <AddWatchContent />
    </Suspense>
  );
}
