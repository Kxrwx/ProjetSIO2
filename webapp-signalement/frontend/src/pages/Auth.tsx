import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Imports regroupés
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShieldHalved, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {motion} from "framer-motion"

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = { email, password };
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/admin");
      } else {
        alert(result.error || result.message || "Identifiants incorrects")
      }
    } catch (error) {
      console.error("Erreur connexion:", error);
      alert("Impossible de contacter le serveur.");
    }
  }; 

return (
  <div className="w-full bg-slate-50 font-sans selection:bg-indigo-100 flex flex-col min-h-screen pt-12 pb-20">
    
    {/* BOUTON RETOUR : Cohérent avec la page Tracking */}
    <div className="max-w-md mx-auto w-full px-4 mb-10">
      <Link to="/" className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
        <FontAwesomeIcon icon={faArrowLeft} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
        <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Retour accueil</span>
      </Link>
    </div>

    <div className="max-w-md mx-auto w-full px-4">
      {/* HEADER DE CONNEXION */}
      <header className="text-center mb-8">
        <div className="w-16 h-16 bg-white border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
           <FontAwesomeIcon icon={faShieldHalved} className="text-2xl text-indigo-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Espace Administration</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Accès restreint aux officiels</p>
      </header>

      {/* CARTE DE CONNEXION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(79,70,229,0.06)] border border-indigo-50 overflow-hidden p-8 md:p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-indigo-400 ml-1 tracking-widest">Identifiant pro</label>
            <input 
              required 
              type="email" 
              placeholder="admin@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-700"
            />
          </div>

          {/* MOT DE PASSE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-indigo-400 ml-1 tracking-widest">Mot de passe</label>
            <div className="relative group">
              <input 
                required 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 px-2 py-1 transition-colors"
              >
                {showPassword ? "Masquer" : "Voir"}
              </button>
            </div>
          </div>

          {/* NOTE DE SÉCURITÉ */}
          <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-4">
            <p className="text-[10px] leading-relaxed text-amber-700 font-medium italic text-center">
              "Contactez votre administrateur réseau si vous rencontrez des problèmes de connexion."
            </p>
          </div>

          {/* BOUTON SUBMIT */}
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
          >
            Se connecter au dashboard
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </button>

        </form>
      </motion.div>

      {/* FOOTER DISCRET */}
      <footer className="mt-12 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Session chiffrée & Logs d'activité activés
        </p>
      </footer>
    </div>
  </div>
);
}