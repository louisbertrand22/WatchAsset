'use client';

import { Suspense } from 'react';
import MarketContent from './MarketContent';

export default function MarketPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-xl text-zinc-700 dark:text-zinc-300">
          Chargement...
        </div>
      </div>
    }>
      <MarketContent />
    </Suspense>
  );
}
