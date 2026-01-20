"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const jsx_runtime_1 = require("react/jsx-runtime");
// frontend/app/page.tsx
function Home() {
    const handleLogin = () => {
        // On redirige vers la route de login que nous avons créée dans le backend WatchAsset
        window.location.href = "http://localhost:3001/auth/login";
    };
    return ((0, jsx_runtime_1.jsxs)("main", { className: "flex min-h-screen flex-col items-center justify-center bg-black text-white p-24", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-6xl font-serif mb-8 italic", children: "WatchAsset" }), (0, jsx_runtime_1.jsx)("p", { className: "text-zinc-400 mb-12 text-center max-w-md", children: "Suivez la valeur de votre collection de montres en temps r\u00E9el avec la pr\u00E9cision d'un mouvement suisse." }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogin, className: "bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]", children: "Se connecter avec MySSO" })] }));
}
//# sourceMappingURL=page.js.map