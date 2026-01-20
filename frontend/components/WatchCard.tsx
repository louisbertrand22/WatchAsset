// frontend/components/WatchCard.tsx
export default function WatchCard({ watch }: { watch: any }) {
  const lastPrice = watch.prices[watch.prices.length - 1]?.price;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-amber-500 transition-all">
      <img src={watch.imageUrl} alt={watch.model} className="w-full h-48 object-cover rounded-lg mb-4" />
      <h3 className="text-zinc-400 text-xs uppercase tracking-widest">{watch.brand}</h3>
      <p className="text-white font-bold text-lg">{watch.model}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-amber-500 font-mono text-xl">{lastPrice} €</span>
        <button className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-zinc-200">
          + Ajouter
        </button>
      </div>
    </div>
  );
}