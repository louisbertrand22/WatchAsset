'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  id: string;
}

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const userParam = searchParams.get('user');
    const tokenParam = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Erreur d\'authentification. Veuillez réessayer.');
      return;
    }

    if (userParam && tokenParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        setUser(userData);
        setToken(tokenParam);
        
        // Stocker le token dans le localStorage pour les futures requêtes
        localStorage.setItem('access_token', tokenParam);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (e) {
        console.error('Erreur lors du parsing des données utilisateur:', e);
        setError('Erreur lors de la récupération des informations utilisateur.');
      }
    } else {
      // Vérifier si l'utilisateur est déjà connecté via localStorage
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Erreur lors du parsing des données stockées:', e);
          // Nettoyer le localStorage si les données sont corrompues
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          router.push('/');
        }
      } else {
        // Rediriger vers la page de connexion si non connecté
        router.push('/');
      }
    }
  }, [searchParams, router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">{error}</p>
          <a
            href="/"
            className="inline-block rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-xl text-zinc-700 dark:text-zinc-300">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-700">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard WatchAsset
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Bienvenue, {user.name}!
          </h2>
          <div className="space-y-2 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
            <p className="text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold">ID:</span> {user.id}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Authentification réussie
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Vous êtes maintenant connecté à WatchAsset. Votre session est active et vous pouvez
            accéder aux fonctionnalités de l'application.
          </p>
        </div>
      </div>
    </div>
  );
}
