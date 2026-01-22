'use client';

export default function Home() {
  const handleLogin = () => {
    // Rediriger vers la route de login du backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/auth/login`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Bienvenue sur WatchAsset
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Gérez et suivez votre collection de montres de luxe en toute simplicité.
          </p>
          <ul className="max-w-md space-y-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-xl" aria-label="Icône de graphique" role="img">📊</span>
              <span>Suivez l'évolution des prix de vos montres en temps réel</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-xl" aria-label="Icône de diamant" role="img">💎</span>
              <span>Gérez votre portefeuille de montres de collection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-xl" aria-label="Icône de tendances" role="img">📈</span>
              <span>Consultez les tendances du marché horloger</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={handleLogin}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            Se connecter
          </button>
        </div>
      </main>
    </div>
  );
}
