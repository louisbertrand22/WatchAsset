// frontend/app/page.tsx
export default function Home() {
  const handleLogin = () => {
    // On redirige vers la route de login que nous avons créée dans le backend WatchAsset
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/auth/login`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-24">
      <h1 className="text-6xl font-serif mb-8 italic">WatchAsset</h1>
      <p className="text-zinc-400 mb-12 text-center max-w-md">
        Suivez la valeur de votre collection de montres en temps réel avec la précision d'un mouvement suisse.
      </p>
      <button 
        onClick={handleLogin}
        className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]"
      >
        Se connecter avec MySSO
      </button>
    </main>
  );
}