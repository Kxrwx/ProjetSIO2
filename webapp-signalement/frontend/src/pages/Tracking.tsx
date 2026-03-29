import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFileLines, faSearch, faLock } from "@fortawesome/free-solid-svg-icons";
import ChatBox from "../components/ChatBoxNoAdmin";

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState("");
  const [password, setPassword] = useState("");
  const [signalement, setSignalement] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/signalements/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: trackingCode.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Identifiants invalides.");
        return;
      }
      setSignalement(data);
    } catch (err) {
      setError("Connexion au serveur impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full relative flex flex-col items-center pt-20 pb-12 px-4">
      
      {/* Bouton retour — reste en absolute */}
      <div className="absolute px-4 py-2 top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour
          </button>
        </Link>
      </div>

      <div className="max-w-[440px] w-full mx-auto">
        {!signalement && (
          <div className="form-container bg-white border border-gray-200 shadow-2xl rounded-sm overflow-hidden relative animate-in fade-in zoom-in duration-500">
            
            {/* Ligne de décoration supérieure (Bleue) */}
            <div className="h-[3px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            
            <div className="p-8">
              {/* Header du Dossier */}
              <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-green-500/10">
                <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-800 mt-1">
                  Dossier
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Groupe Input : Code Suivi */}
                <div className="group relative flex items-center gap-4 bg-gray-50 border border-gray-200 p-3 transition-all focus-within:border-green-500 focus-within:bg-white focus-within:translate-x-1">
                  {/* Barre latérale animée */}
                  <div className="absolute top-0 left-0 w-[3px] h-0 bg-green-500 transition-all duration-300 group-focus-within:h-full"></div>
                  
                  <div className="w-10 h-10 flex-shrink-0 bg-white border border-gray-200 flex items-center justify-center group-focus-within:border-green-500 transition-colors">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 group-focus-within:text-green-500" />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 group-focus-within:text-green-500">
                      Numéro de suivi
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: SIG-XXXX"
                      className="w-full bg-transparent border-none outline-none text-gray-800 text-sm placeholder:text-gray-300"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                    />
                  </div>
                </div>

                {/* Groupe Input : Mot de passe */}
                <div className="group relative flex items-center gap-4 bg-gray-50 border border-gray-200 p-3 transition-all focus-within:border-green-500 focus-within:bg-white focus-within:translate-x-1">
                  <div className="absolute top-0 left-0 w-[3px] h-0 bg-green-500 transition-all duration-300 group-focus-within:h-full"></div>
                  
                  <div className="w-10 h-10 flex-shrink-0 bg-white border border-gray-200 flex items-center justify-center group-focus-within:border-green-500 transition-colors">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400 group-focus-within:text-green-500" />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 group-focus-within:text-green-500">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent border-none outline-none text-gray-800 text-sm placeholder:text-gray-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-[11px] font-bold text-center bg-red-50 py-2 rounded border border-red-100 uppercase tracking-tighter">{error}</p>}

                {/* Bouton Sign In Style "Dossier" */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 mt-2 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <span className="text-[11px] uppercase tracking-[0.2em]">Accéder au dossier</span>
                  <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                </button>
              </form>

              <p className="text-center text-[11px] text-gray-400 mt-6 uppercase tracking-widest">
                Portail de suivi confidentiel
              </p>
            </div>
          </div>
        )}

        {/* --- VUE DU SIGNALEMENT (Thème Clair) --- */}
        {signalement && (
          <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="bg-white border border-gray-200 shadow-xl rounded-sm p-8 md:p-12 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-8">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">{signalement.title}</h2>
                    <p className="font-mono text-green-600 text-xs font-bold tracking-widest">DOSSIER_REF: {signalement.trackingCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                      {signalement.statut?.nameStatut || "En cours"}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl mb-10">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileLines} /> Description initiale
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap italic">
                    "{signalement.description}"
                  </p>
                </div>

                <div className="mt-10 pt-10 border-t border-gray-100">
                  <ChatBox 
                    idSignalement={signalement.idSignalement} 
                    messages={signalement.messagesDechiffres || []}
                    trackingCode={trackingCode} 
                    password={password}
                    onRefresh={() => handleSubmit({ preventDefault: () => {} } as any)} 
                  />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}