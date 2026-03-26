
import ButtonLogout from "../components/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
export default function Navigation() {
    return (
  <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center selection:bg-indigo-100">
    
    {/* LOGO / TITRE DASHBOARD */}
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-slate-200 group-hover:shadow-indigo-100">
        <FontAwesomeIcon icon={faShieldHalved} className="text-white text-sm" />
      </div>
      <div className="flex flex-col">
        <a 
          href="/infoadminaccount" 
          className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-800 group-hover:text-indigo-600 transition-colors"
        >
          Console Utilisateur
        </a>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Système Sécurisé
        </span>
      </div>
    </div>

    {/* ACTIONS DROITE */}
    <div className="flex items-center gap-8">

      {/* TON BOUTON LOGOUT */}
      <div className="pl-6 border-l border-slate-100">
        <ButtonLogout />
      </div>
    </div>
  </nav>
);
};
