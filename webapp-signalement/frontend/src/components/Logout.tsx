import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

export default function ButtonLogout() {
    const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include", 
    });
  } finally {
    window.location.href = "/auth";
  }
};

return (
  <button 
    onClick={handleLogout} 
    className="group relative flex items-center gap-3 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:shadow-[0_15px_30px_rgba(239,68,68,0.2)] transition-all duration-300 active:scale-95"
  >
    {/* Icône de sortie qui s'anime au survol */}
    <FontAwesomeIcon 
      icon={faPowerOff} 
      className="text-slate-400 group-hover:text-white transition-colors duration-300" 
    />
    
    <span className="relative z-10">
      Déconnexion
    </span>

    {/* Effet de reflet interne discret */}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
  </button>
);
}