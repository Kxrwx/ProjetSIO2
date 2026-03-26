//Page Main

//Import
import { Link } from "react-router-dom";
import { faArrowRight, faLock, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {motion} from "framer-motion"


//Bloc HTML
export default function Main() {
  return (
  <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-indigo-100 flex flex-col">
    
    {/* BARRE HAUTE : ACCÈS ADMIN */}
    <div className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-end">
      <Link to="/auth">
        <button className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
          Accès administration 
          <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>

    <main className="flex-grow flex flex-col items-center justify-center px-6 pb-20">
      
      {/* HEADER : TITRE & RASSURANCE */}
      <div className="max-w-3xl w-full text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 mb-8 shadow-sm border border-indigo-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest uppercase">Plateforme Sécurisée & Anonyme</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight mb-6">
          Signalement harcèlement professionnel
        </h1>
        
        <p className="text-lg text-slate-500 font-medium leading-relaxed italic">
          "Avant d'envoyer votre signalement, sachez que vous êtes en sécurité ici, que votre voix compte et que nous vous protégeons avec la plus stricte confidentialité."
        </p>
      </div>

      {/* GRILLE DE CHOIX : ACTIONS PRINCIPALES */}
<div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
  
  {/* OPTION : CRÉATION */}
  <Link to="/report" className="group relative">
    <motion.div 
      whileHover={{ y: -8 }}
      className="h-full p-10 bg-white rounded-[2.5rem] border border-indigo-50 shadow-[0_40px_100px_rgba(79,70,229,0.04)] hover:border-indigo-200 transition-all overflow-hidden relative"
    >
      {/* Background décoratif (Maintenant sur les deux) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full group-hover:bg-indigo-100/50 transition-colors" />
      
      <div className="relative flex flex-col h-full z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-6">Action 01</span>
        <h2 className="text-3xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
          Créer un <br />signalement
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          Déposez un témoignage de manière anonyme ou nominative. Vos données sont chiffrées de bout en bout dès l'envoi.
        </p>
        
        <div className="mt-auto flex items-center gap-3 text-[11px] font-black tracking-widest text-indigo-600 uppercase">
          COMMENCER LE DOSSIER
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-200 transition-all">
             <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>

  {/* OPTION : SUIVI */}
<Link to="/tracking" className="group relative">
  <motion.div 
    whileHover={{ y: -8 }}
    className="h-full p-10 bg-white rounded-[2.5rem] border border-indigo-50 shadow-[0_40px_100px_rgba(79,70,229,0.04)] hover:border-indigo-200 transition-all overflow-hidden relative"
  >
    {/* Background décoratif identique au modèle */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full group-hover:bg-indigo-100/50 transition-colors" />
    
    <div className="relative flex flex-col h-full z-10">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-6">Action 02</span>
      <h2 className="text-3xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
        Suivre mon <br />dossier
      </h2>
      <p className="text-slate-500 font-medium leading-relaxed mb-10">
        Accédez à votre espace d'échange sécurisé pour consulter l'avancement et discuter avec l'administration.
      </p>
      
      <div className="mt-auto flex items-center gap-3 text-[11px] font-black tracking-widest text-indigo-600 uppercase">
        VÉRIFIER L'ÉTAT
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-200 transition-all">
           <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>
    </div>
  </motion.div>
</Link>
</div>

      {/* FOOTER : NOTE DE CONFIANCE */}
      <footer className="max-w-4xl mt-20 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-slate-100/50 rounded-3xl border border-slate-200/50">
          <p className="text-[11px] md:text-xs text-slate-500 font-bold leading-relaxed">
            <span className="text-indigo-600 mr-1 font-black">NOTE :</span>
            Tous les signalements sont traités avec le plus grand sérieux. Rien n'est considéré comme "pas grave". 
            Chaque témoignage mérite une attention immédiate pour vous protéger efficacement.
          </p>
        </div>
        
        <div className="mt-8 flex justify-center gap-6 opacity-30">
           <FontAwesomeIcon icon={faLock} className="text-sm" />
           <FontAwesomeIcon icon={faShieldAlt} className="text-sm" />
        </div>
      </footer>
    </main>
  </div>
);
}
    