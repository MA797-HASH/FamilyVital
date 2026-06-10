"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, email, password, familyName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      router.push("/family");
    } catch {
      setError("Erreur réseau.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-green-800 text-center mb-1">🌿 FamilyVital</h1>
        <p className="text-center text-green-600 text-sm mb-8 uppercase tracking-wider font-medium">
          La santé de votre famille
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            ⚠ {error}
          </div>
        )}

        {mode === "signup" && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Nom de famille</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-green-50" value={familyName} onChange={e => setFamilyName(e.target.value)} placeholder="ex: Famille Berrahmani" />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Email</label>
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-green-50" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Mot de passe</label>
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-green-50" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {mode === "signup" && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Confirmer le mot de passe</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-green-50" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" />
          </div>
        )}

        <button onClick={handle} disabled={loading} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl mt-2 transition-colors disabled:opacity-60">
          {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span className="text-green-700 font-bold cursor-pointer underline" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </span>
        </p>
      </div>
    </div>
  );
}
