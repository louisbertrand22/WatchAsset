"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WatchCard;
const jsx_runtime_1 = require("react/jsx-runtime");
// frontend/components/WatchCard.tsx
function WatchCard({ watch }) {
    const lastPrice = watch.prices[watch.prices.length - 1]?.price;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-amber-500 transition-all", children: [(0, jsx_runtime_1.jsx)("img", { src: watch.imageUrl, alt: watch.model, className: "w-full h-48 object-cover rounded-lg mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-zinc-400 text-xs uppercase tracking-widest", children: watch.brand }), (0, jsx_runtime_1.jsx)("p", { className: "text-white font-bold text-lg", children: watch.model }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-amber-500 font-mono text-xl", children: [lastPrice, " \u20AC"] }), (0, jsx_runtime_1.jsx)("button", { className: "bg-white text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-zinc-200", children: "+ Ajouter" })] })] }));
}
//# sourceMappingURL=WatchCard.js.map