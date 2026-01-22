'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Watch {
  id: string;
  brand: string;
  model: string;
  reference: string;
  imageUrl?: string;
  currentPrice?: number;
}

const BACKEND_URL = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL 
  ? process.env.NEXT_PUBLIC_BACKEND_URL 
  : 'http://localhost:3001';

export default function AddWatchContent() {
  const router = useRouter();
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWatch, setSelectedWatch] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
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
        const response = await fetch(`${BACKEND_URL}/watches`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch watches');
        }

        const data = await response.json();
        setWatches(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching watches:', err);
        setError('Erreur lors du chargement des montres');
        setLoading(false);
      }
    };

    fetchWatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWatch) {
      setError('Veuillez sélectionner une montre');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        router.push('/');
        return;
      }

      // Validate purchase price before sending
      let validatedPrice: number | null = null;
      if (purchasePrice) {
        const parsed = parseFloat(purchasePrice);
        if (isNaN(parsed) || parsed < 0) {
          setError('Le prix d\'achat doit être un nombre valide');
          setSubmitting(false);
          return;
        }
        validatedPrice = parsed;
      }

      const response = await fetch(`${BACKEND_URL}/user-watches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          watchId: selectedWatch,
          purchasePrice: validatedPrice,
          purchaseDate: purchaseDate || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add watch');
      }

      // Success - redirect to dashboard
      router.push('/dashboard?added=true');
    } catch (err: unknown) {
      console.error('Error adding watch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout de la montre';
      setError(errorMessage);
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <div className="text-xl text-zinc-700 dark:text-zinc-300">
          Chargement...
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
                Ajouter une Montre
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </button>
          
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            Ajouter une Montre à votre Collection
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Sélectionnez une montre et entrez les détails de votre achat
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Watch Selection */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <label className="block text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Sélectionner une montre *
            </label>
            
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {watches.map((watch) => (
                <button
                  key={watch.id}
                  type="button"
                  onClick={() => setSelectedWatch(watch.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedWatch === watch.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {/* Watch Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    {watch.imageUrl && !imageErrors.has(watch.id) ? (
                      <div className="w-full h-full rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <img
                          src={watch.imageUrl}
                          alt={`${watch.brand} ${watch.model}`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(watch.id)}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Watch Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate">
                      {watch.brand} {watch.model}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                      Réf: {watch.reference}
                    </p>
                    {watch.currentPrice && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        Prix actuel: {formatPrice(watch.currentPrice)}
                      </p>
                    )}
                  </div>
                  
                  {/* Selected Indicator */}
                  {selectedWatch === watch.id && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Purchase Details */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Détails de l&apos;Achat (Optionnel)
            </h3>
            
            <div className="space-y-4">
              {/* Purchase Price */}
              <div>
                <label htmlFor="purchasePrice" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Prix d&apos;Achat (€)
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Ex: 15000"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Purchase Date */}
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Date d&apos;Achat
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!selectedWatch || submitting}
              className="flex-1 rounded-full bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {submitting ? 'Ajout en cours...' : 'Ajouter à ma Collection'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-6 py-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
