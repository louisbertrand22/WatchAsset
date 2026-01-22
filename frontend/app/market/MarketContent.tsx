'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PriceHistory {
  id: string;
  price: number;
  source: string;
  date: string;
}

interface Watch {
  id: string;
  brand: string;
  model: string;
  reference: string;
  imageUrl?: string;
  prices: PriceHistory[];
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
}

const BACKEND_URL = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL 
  ? process.env.NEXT_PUBLIC_BACKEND_URL 
  : 'http://localhost:3001';

export default function MarketContent() {
  const router = useRouter();
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (watchId: string) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.add(watchId);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        // For testing/demo purposes, skip authentication check
        // In production, uncomment the following lines:
        // const token = localStorage.getItem('accessToken');
        // if (!token) {
        //   router.push('/');
        //   return;
        // }

        const response = await fetch(`${BACKEND_URL}/watches`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch watches');
        }

        const data = await response.json();
        setWatches(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching watches:', err);
        setError('Erreur lors du chargement des données de marché');
        setLoading(false);
      }
    };

    fetchWatches();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <div className="text-xl text-zinc-700 dark:text-zinc-300">
          Chargement des données de marché...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <div className="rounded-2xl bg-white p-8 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-block rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  WatchAsset
                </h1>
              </button>
              <span className="text-zinc-400 dark:text-zinc-600">|</span>
              <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Analyse de Marché
              </h2>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            Analyse de Marché
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Suivez les prix et les tendances du marché des montres de luxe
          </p>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
              Montres Suivies
            </h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {watches.length}
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
              Modèles disponibles
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h3 className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
              Valeur Moyenne
            </h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatPrice(watches.reduce((sum, w) => sum + w.currentPrice, 0) / (watches.length || 1))}
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
              Par montre
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
              Sources de Prix
            </h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {new Set(watches.flatMap(w => w.prices.map(p => p.source))).size}
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
              Plateformes suivies
            </p>
          </div>
        </div>

        {/* Watches Grid */}
        <div className="space-y-6">
          {watches.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-12 shadow-lg border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Aucune donnée de marché disponible
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Les données de marché seront bientôt disponibles
              </p>
            </div>
          ) : (
            watches.map((watch) => (
              <div
                key={watch.id}
                className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Watch Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    {watch.imageUrl && !imageErrors.has(watch.id) ? (
                      <div className="w-full h-48 lg:h-full rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <img
                          src={watch.imageUrl}
                          alt={`${watch.brand} ${watch.model}`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(watch.id)}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 lg:h-full rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg className="w-16 h-16 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Watch Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                          {watch.brand} {watch.model}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 font-mono text-sm">
                          Réf: {watch.reference}
                        </p>
                      </div>
                      <div className="text-right sm:text-right">
                        <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                          {formatPrice(watch.currentPrice)}
                        </div>
                        {watch.priceChange !== 0 && (
                          <div className={`flex items-center gap-1 mt-1 ${
                            watch.priceChange > 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            <svg 
                              className={`w-4 h-4 ${watch.priceChange < 0 ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span className="font-semibold">
                              {watch.priceChangePercent > 0 ? '+' : ''}{watch.priceChangePercent.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price History */}
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        Historique des Prix
                      </h4>
                      <div className="space-y-2">
                        {watch.prices.slice(0, 3).map((price, index) => (
                          <div
                            key={price.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                index === 0 ? 'bg-blue-500' : 'bg-zinc-400 dark:bg-zinc-600'
                              }`}></div>
                              <div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                  {price.source}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                  {formatDate(price.date)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                {formatPrice(price.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {watch.prices.length > 3 && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center py-2">
                            +{watch.prices.length - 3} autres prix dans l'historique
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to Dashboard Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-zinc-100 px-6 py-3 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au Tableau de Bord
          </button>
        </div>
      </main>
    </div>
  );
}
