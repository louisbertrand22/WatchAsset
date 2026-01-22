'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  id: string;
  username?: string;
}

// Use environment variable for backend URL, fallback to localhost for development
const BACKEND_URL = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL 
  ? process.env.NEXT_PUBLIC_BACKEND_URL 
  : 'http://localhost:3001';

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch user information from backend API (which uses SSOService)
  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/userinfo`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user information: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();
      
      // Map the SSO response to our User interface
      const mappedUser: User = {
        email: userData.email,
        name: userData.name || userData.username || userData.email,
        id: userData.sub || userData.id,
        username: userData.username,
      };

      setUser(mappedUser);
      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(mappedUser));
      return mappedUser;
    } catch (error) {
      console.error('Error fetching user info from backend:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check for error in URL params
        const errorParam = searchParams.get('error');
        if (errorParam) {
          setError('Erreur d\'authentification. Veuillez réessayer.');
          setLoading(false);
          return;
        }

        // Check for token in URL params (after redirect from SSO)
        const tokenParam = searchParams.get('token');
        
        if (tokenParam) {
          // New login: Store token and fetch user info from SSO
          setToken(tokenParam);
          localStorage.setItem('accessToken', tokenParam);
          
          // Fetch user info from SSO API
          await fetchUserInfo(tokenParam);
          setLoading(false);
        } else {
          // Check if user is already logged in via localStorage
          const storedToken = localStorage.getItem('accessToken');
          
          if (storedToken) {
            setToken(storedToken);
            
            // Fetch fresh user info from SSO API
            try {
              await fetchUserInfo(storedToken);
              setLoading(false);
            } catch (e) {
              // If token is invalid, clear storage and redirect to login
              console.error('Token is invalid or expired:', e);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              router.push('/');
            }
          } else {
            // No token found, redirect to login
            router.push('/');
          }
        }
      } catch (e) {
        console.error('Error initializing user:', e);
        setError('Erreur lors de la récupération des informations utilisateur.');
        setLoading(false);
      }
    };

    initializeUser();
  }, [searchParams, router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <div className="rounded-2xl bg-white p-8 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">{error}</p>
          <a
            href="/"
            className="inline-block rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <div className="text-xl text-zinc-700 dark:text-zinc-300">
          Chargement...
        </div>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name || name.trim().length === 0) {
      return 'U';
    }
    const names = name.trim().split(' ').filter(n => n.length > 0);
    if (names.length >= 2 && names[0].length > 0 && names[names.length - 1].length > 0) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    if (names.length > 0 && names[0].length >= 2) {
      return names[0].substring(0, 2).toUpperCase();
    }
    if (names.length > 0 && names[0].length === 1) {
      return names[0][0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                WatchAsset
              </h1>
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
        {/* Welcome Section with User Profile */}
        <div className="mb-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                  <span className="text-3xl font-bold text-white">
                    {getInitials(user.name)}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    Bienvenue, {user.name}!
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {user.email}
                  </p>
                  {user.username && (
                    <p className="text-blue-100/90 text-sm mt-1">
                      @{user.username}
                    </p>
                  )}
                  <p className="text-blue-100/80 text-sm mt-1">
                    ID: {String(user.id || '').substring(0, 8)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Watches */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
              Total Montres
            </h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              0
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
              Aucune montre ajoutée
            </p>
          </div>

          {/* Portfolio Value */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
              Valeur du Portfolio
            </h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              €0
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
              Valeur totale estimée
            </p>
          </div>

          {/* Account Status */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
              Statut du Compte
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              Actif
            </p>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
              Authentification réussie
            </p>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Activité Récente
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Connexion réussie
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Il y a quelques instants
                  </p>
                </div>
              </div>
              
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-500 text-sm">
                  Aucune autre activité récente
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Actions Rapides
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Ajouter une montre
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Commencer votre collection
                  </p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Voir les prix
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Analyser le marché
                  </p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Paramètres
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    Gérer votre compte
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Session Active
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Vous êtes maintenant connecté à WatchAsset. Votre session est sécurisée et vous avez accès à toutes les fonctionnalités de l'application.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
