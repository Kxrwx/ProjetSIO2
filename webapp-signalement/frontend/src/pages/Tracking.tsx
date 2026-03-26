import { useState , useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faShieldAlt, faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import ChatBox from "../components/ChatBoxNoAdmin";
import {motion} from "framer-motion"

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

  // Fonction fetch extraite pour être réutilisée par le polling et ChatBox
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
        if (!isPolling) setError(data.error || "Erreur de récupération.");
        return;
      }
      setSignalement(data);
    } catch (err) {
      console.error(err);
      if (!isPolling) setError("Connexion au serveur impossible.");
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [trackingCode, password]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");
    fetchSignalement();
  };

return (
  <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-indigo-100 flex flex-col pt-12 pb-20">
    
    {/* BOUTON RETOUR CONTEXTUEL */}
    <div className="max-w-4xl mx-auto w-full px-4 mb-10">
      <Link to="/" className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
        <FontAwesomeIcon icon={faArrowLeft} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
        <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Retour à l'accueil</span>
      </Link>
    </div>

    <div className="max-w-4xl mx-auto w-full px-4">
      
      {/* HEADER DE LA PAGE */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 rounded-full px-4 py-1.5 mb-6 border border-indigo-100">
          <FontAwesomeIcon icon={faShieldAlt} className="text-[10px]" />
          <span className="text-[10px] font-black tracking-widest uppercase">Espace de suivi sécurisé</span>
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Consulter mon dossier</h1>
      </header>

      {/* 1. FORMULAIRE D'ACCÈS (Affiché si aucun signalement n'est chargé) */}
      {!signalement && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(79,70,229,0.05)] border border-indigo-50 overflow-hidden p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-indigo-400 ml-1 tracking-widest">Référence du dossier</label>
                <input
                  type="text" required placeholder="Ex: SIG-XXXXXXXX"
                  value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all font-mono text-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-indigo-400 ml-1 tracking-widest">Mot de passe de suivi</label>
                <input
                  type="password" required placeholder="Votre clé de sécurité"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <span className="text-lg">⚠️</span> {error}
              </motion.div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200"
            >
              {loading ? "Authentification..." : "Accéder au dossier"}
              {!loading && <FontAwesomeIcon icon={faArrowRight} />}
            </button>
          </form>
        </motion.div>
      )}

      {/* 2. DÉTAILS DU SIGNALEMENT (Affiché après validation) */}
      {signalement && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* CARTE INFO RÉCAP */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden p-8 md:p-10">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">Dossier validé</span>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{signalement.title}</h2>
              </div>
              <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                signalement.statut?.nameStatut === 'Traité' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {signalement.statut?.nameStatut}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-slate-50 text-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Référence</p>
                <p className="text-sm font-mono font-bold text-indigo-600">{signalement.trackingCode}</p>
              </div>
              <div className="md:border-x border-slate-100 px-4">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Priorité</p>
                <p className="text-sm font-bold text-slate-700">{signalement.priorite?.namePriorite}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Catégorie</p>
                <p className="text-sm font-bold text-slate-700">{signalement.categorie?.nameCategorie}</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Description des faits</p>
              <div className="p-6 bg-slate-50 rounded-2xl text-slate-600 leading-relaxed text-sm font-medium border border-slate-100">
                {signalement.description}
              </div>
            </div>
          </div>

          {/* ESPACE D'ÉCHANGE (ChatBox) */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-indigo-50 overflow-hidden">
            <div className="bg-indigo-600 p-6 flex items-center justify-between">
               <h3 className="text-white font-black text-sm uppercase tracking-widest">Espace d'échange sécurisé</h3>
               <button onClick={() => fetchSignalement(true)} className="text-indigo-200 hover:text-white transition-colors">
                  <FontAwesomeIcon icon={faCheckCircle} />
               </button>
            </div>
            <div className="p-2 md:p-6">
              <ChatBox 
                idSignalement={signalement.idSignalement} 
                messages={signalement.messagesDechiffres || []}
                onRefresh={() => fetchSignalement(true)} 
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* FOOTER DISCRET */}
      <p className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        <FontAwesomeIcon icon={faLock} className="mr-2 text-indigo-300" />
        Canal de communication chiffré AES-256
      </p>
    </div>
  </div>
);
}