import { useEffect, useState } from "react";
import { useNavigate, Link, data } from "react-router-dom"; 
import Navigation from "./Navigation";
import GraphStatut from "../components/GraphStatut";
import { motion } from 'framer-motion'; // Pour les animations de liste
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faShieldHalved, 
  faLock, 
  faCircle, 
  faFilter,
  faTriangleExclamation 
} from '@fortawesome/free-solid-svg-icons';



export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [signalements, setSignalements] = useState<any[]>([]);
  const navigate = useNavigate();

  // 1. Charger l'utilisateur au démarrage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 2. Appel automatique des signalements au chargement de la page
  useEffect(() => {
    const fetchSignalements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/signalement', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok) {
          setSignalements(result);
          console.log("Signalements récupérés:", result);

        } else {
          console.error("Erreur API:", result.error || "Impossible de récupérer les données");
        }
      } catch (error) {
        console.error("Erreur connexion:", error);
      }
    };

    fetchSignalements();
  }, []); // Le tableau vide [] assure que l'appel ne se fait qu'une seule fois
  const prepareChartData = () => {
  const counts: Record<string, number> = {};

  signalements.forEach((sign) => {
    // On récupère le nom de la catégorie (ou sign.statut.nameStatut si tu préfères)
    const categoryName = sign.categorie.nameCategorie;
    counts[categoryName] = (counts[categoryName] || 0) + 1;
  });
  //Filtre pour les statut = nouveau /Nouveaux signalements 
  const nouveauxSignalements = signalements.filter(
  (sign) => sign.statut?.nameStatut === "Nouveau"
  );
  // On transforme l'objet en tableau formaté pour Recharts
  return Object.keys(counts).map((name) => ({
      name,
      value: counts[name],
    }));
  };
  
  const chartData = prepareChartData();

return (
    <div className="w-full bg-slate-50 font-sans selection:bg-indigo-100 flex flex-col min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto w-full p-6 md:p-10 flex flex-col lg:flex-row gap-10">
        
        {/* SECTION GAUCHE : LISTE (2/3) */}
        <div className="lg:w-2/3">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">
                SIGNALEMENTS 
                <span className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded-xl text-sm not-italic shadow-lg shadow-indigo-200">
                  {signalements.length}
                </span>
              </h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                Flux de données sécurisé
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-500 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-indigo-400 hover:text-indigo-600 transition-all group">
              <FontAwesomeIcon icon={faFilter} className="group-hover:rotate-180 transition-transform" />
              Trier les dossiers
            </div>
          </header>

          <ul className="space-y-6">
  {signalements.map((sign, index) => (
    <motion.li 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, ease: "easeOut" }}
      key={sign.idSignalement || index} 
      className="group relative p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(79,70,229,0.1)] hover:border-indigo-200 transition-all duration-500 flex flex-col gap-6 overflow-hidden"
    >
      {/* Liseré de priorité dynamique : plus épais pour le côté pro */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${
        sign.priorite?.namePriorite === 'Haute' 
          ? 'bg-gradient-to-b from-red-500 to-orange-400' 
          : 'bg-gradient-to-b from-slate-200 to-slate-300 group-hover:from-indigo-400 group-hover:to-indigo-600'
      } transition-all duration-500`} />

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        
        {/* BLOC INFOS GAUCHE */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border shadow-sm ${
              sign.priorite?.namePriorite === 'Haute' 
                ? 'bg-red-50 text-red-600 border-red-100' 
                : 'bg-slate-50 text-slate-500 border-slate-100 font-bold'
            }`}>
              {sign.priorite?.namePriorite === 'Haute' && <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1.5" />}
              Priorité {sign.priorite?.namePriorite}
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 bg-slate-50/50 px-3 py-1.5 rounded-full border border-slate-100">
              Réf: #{sign.idSignalement}
            </span>
          </div>

          <h4 className="font-black text-2xl text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
            {sign.title}
          </h4>
          
          <p className="text-slate-500 text-sm font-medium line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity italic">
            Cliquez pour consulter l'intégralité du témoignage et les pièces jointes.
          </p>
        </div>

        {/* BLOC ACTIONS DROITE */}
        <div className="flex items-center gap-4 self-end md:self-start">
          <div className="flex flex-col items-end gap-1">
            <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm transition-all ${
              sign.statut?.nameStatut === 'Nouveau' 
                ? 'bg-white text-amber-500 border-amber-100 group-hover:bg-amber-500 group-hover:text-white' 
                : 'bg-white text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              {sign.statut?.nameStatut}
            </span>
          </div>
          
          <Link to={`/admin/signalement/detail/${sign.idSignalement}`}>
            <button className="w-14 h-14 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 group-hover:rotate-[-5deg] group-hover:scale-110 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-indigo-200">
              <FontAwesomeIcon icon={faArrowRight} className="text-lg" />
            </button>
          </Link>
        </div>
      </div>
      
      {/* FOOTER DE CARTE : GRID INFO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100/60">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catégorie</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{sign.categorie?.nameCategorie}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de dépôt</p>
          <p className="text-xs font-bold text-slate-600">24 Mars 2026</p>
        </div>

        <div className="space-y-1 hidden md:block">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Émetteur</p>
          <p className="text-xs font-bold text-slate-600">Anonyme</p>
        </div>

        <div className="space-y-1 text-right">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Protocole</p>
          <p className="text-[10px] font-mono font-bold text-slate-400">AES-256</p>
        </div>
      </div>

      {/* Background décoratif discret au survol */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-50/30 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-700" />
    </motion.li>
  ))}
</ul>
        </div>

        {/* SECTION DROITE : STATISTIQUES (1/3) */}
        <aside className="lg:w-1/3">
          <div className="sticky top-10 space-y-6">
            
{/* CARTE GRAPHIQUE ACTIVE - ULTRA LARGE */}
<div className="bg-white p-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden h-full flex flex-col justify-between">
  {/* Déco indigo en coin */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-40 -mr-8 -mt-8" />
  
  <div className="relative z-10 text-center flex flex-col h-full">
    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center justify-center gap-3">
       <FontAwesomeIcon icon={faCircle} className="text-[6px] text-indigo-500 animate-pulse" />
       Analytique Temps Réel
    </h4>
    
    {/* ZONE DU GRAPHIQUE OPTIMISÉE POUR L'ESPACE */}
    <div className="relative flex-1 w-full flex items-center justify-center bg-slate-50/50 rounded-[2rem] border border-slate-50 overflow-hidden group min-h-[400px]">
      
      {/* On utilise des marges négatives pour forcer le graphique à toucher les bords de son parent */}
      <div className="absolute inset-0 -m-6 transform group-hover:scale-110 transition-transform duration-1000 ease-out flex items-center justify-center">
         <GraphStatut data={chartData} />
      </div>

    </div>

    {/* LÉGENDE RAPIDE OU STATS */}
    <div className="mt-8 grid grid-cols-2 gap-3 relative z-20">
       <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col items-center justify-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dossiers</p>
          <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{signalements.length}</p>
       </div>
    </div>
  </div>
</div>

            {/* CARTE SÉCURITÉ ADMIN */}
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                  <FontAwesomeIcon icon={faShieldHalved} size="6x" />
               </div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4 text-indigo-400">
                    <FontAwesomeIcon icon={faLock} />
                    <p className="text-[10px] font-black uppercase tracking-widest tracking-[0.3em]">Vault Protocol</p>
                  </div>
                  <p className="text-xs font-medium leading-relaxed opacity-60 mb-8">
                    Chaque consultation de dossier est enregistrée. Votre adresse IP est actuellement liée à cette session.
                  </p>
                  <div className="h-[1px] w-full bg-white/10 mb-6" />
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">Statut Serveur</span>
                     <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Opérationnel</span>
                  </div>
               </div>
            </div>
            
          </div>
        </aside>

      </main>
    </div>
  );
}