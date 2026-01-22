'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  id: string;
  username?: string;
}

const BACKEND_URL = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL 
  ? process.env.NEXT_PUBLIC_BACKEND_URL 
  : 'http://localhost:3001';

export default function SettingsContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      return mappedUser;
    } catch (error) {
      console.error('Error fetching user info from backend:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        
        if (storedToken) {
          try {
            await fetchUserInfo(storedToken);
            setLoading(false);
          } catch (e) {
            console.error('Token is invalid or expired:', e);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } catch (e) {
        console.error('Error initializing user:', e);
        setError('Erreur lors de la récupération des informations utilisateur.');
        setLoading(false);
      }
    };

    initializeUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <div className="text-xl text-zinc-700 dark:text-zinc-300">
          Chargement...
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              >
                Tableau de bord
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Paramètres
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Gérez votre compte et vos préférences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6 mb-8">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-xl flex-shrink-0">
                  <span className="text-4xl font-bold text-white">
                    {getInitials(user.name)}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                    {user.name}
                  </h4>
                  {user.username && (
                    <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                      @{user.username}
                    </p>
                  )}
                  <p className="text-zinc-500 dark:text-zinc-500 text-sm">
                    ID: {String(user.id || '').substring(0, 16)}...
                  </p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Nom complet
                    </label>
                    <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-zinc-900 dark:text-zinc-100">
                      {user.name}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Email
                    </label>
                    <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-zinc-900 dark:text-zinc-100">
                      {user.email}
                    </div>
                  </div>

                  {/* Username Field */}
                  {user.username && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Nom d&apos;utilisateur
                      </label>
                      <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-zinc-900 dark:text-zinc-100">
                        @{user.username}
                      </div>
                    </div>
                  )}

                  {/* User ID Field */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Identifiant utilisateur
                    </label>
                    <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                      {user.id}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Les informations de profil sont gérées via le système SSO et ne peuvent pas être modifiées ici.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="rounded-2xl bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Compte
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Account Status */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Compte actif
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Votre compte est en bon état
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session Info */}
                <div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Informations de session
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            Authentification SSO
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            Session sécurisée via Single Sign-On
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        Actif
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Actions */}
                <div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Sécurité
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <div className="text-left">
                          <p className="font-medium text-zinc-900 dark:text-zinc-50">
                            Se déconnecter
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Terminer votre session en toute sécurité
                          </p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  À propos de vos paramètres
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  WatchAsset utilise un système d&apos;authentification SSO (Single Sign-On) pour gérer vos informations de compte. 
                  Pour modifier vos informations personnelles ou votre mot de passe, veuillez contacter votre administrateur système.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
