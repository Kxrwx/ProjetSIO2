import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch, faLock, faFileLines } from "@fortawesome/free-solid-svg-icons";
import ChatBox from "../components/ChatBoxNoAdmin";

interface Signalement {
  idSignalement: number;
  trackingCode: string;
  title: string;
  statut?: { nameStatut: string };
  priorite?: { namePriorite: string };
  categorie?: { nameCategorie: string };
  description: string; 
  messagesDechiffres: any[]; 
}

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState("");
  const [password, setPassword] = useState("");
  const [signalement, setSignalement] = useState<Signalement | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSignalement = useCallback(async (isPolling = false) => {
    if (!trackingCode || !password) return;
    if (!isPolling) setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/signalements/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: trackingCode.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (!isPolling) setError(data.error || "Identifiants invalides.");
        return;
      }
      setSignalement(data);
    } catch (err) {
      if (!isPolling) setError("Connexion au serveur impossible.");
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [trackingCode, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    fetchSignalement();
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full relative flex flex-col items-center pt-20 pb-12 px-4">
      
      {/* Bouton Retour */}
      <div className="absolute top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white border-2 border-black transition-all flex items-center gap-2 text-sm font-medium">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour
          </button>
        </Link>
      </div>

      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Espace sécurisé
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Suivi de votre dossier
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Saisissez vos identifiants pour consulter l'avancement et échanger avec nos services.
          </p>
        </div>

        {/* Formulaire de connexion (masqué si connecté) */}
        {!signalement && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-xs" />
                    Numéro de suivi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: SIG-ZWXN78GU"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all bg-gray-50"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400 text-xs" />
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all bg-gray-50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {loading ? "Vérification..." : "Accéder au dossier"}
              </button>
            </form>
          </div>
        )}

        {/* Détails du signalement */}
        {signalement && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{signalement.title}</h2>
                  <p className="text-sm font-mono text-gray-400">Réf: {signalement.trackingCode}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                    {signalement.statut?.nameStatut || "En cours"}
                  </span>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-full border border-gray-100">
                    {signalement.categorie?.nameCategorie}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faFileLines} className="text-gray-400" />
                  Description initiale
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {signalement.description}
                </p>
              </div>

              {/* Chatbox intégrée dans la carte ou dessous selon ton envie */}
              <div className="mt-10 border-t border-gray-100 pt-10">
                <ChatBox 
                  idSignalement={signalement.idSignalement} 
                  messages={signalement.messagesDechiffres || []}
                  onRefresh={() => fetchSignalement(true)} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}