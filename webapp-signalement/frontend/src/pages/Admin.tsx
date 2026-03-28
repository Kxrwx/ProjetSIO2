import { useEffect, useState, useMemo } from "react"; // Ajout de useMemo pour la performance
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faFileLines, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Navigation from "./Navigation";
import GraphStatut from "../components/GraphStatut";
import "../styles/Admin.css";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [signalements, setSignalements] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

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
        }
      } catch (error) {
        console.error("Erreur connexion:", error);
      }
    };
    fetchSignalements();
  }, []);

 
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    signalements.forEach((sign) => {
      const categoryName = sign.categorie?.nameCategorie || "Sans catégorie";
      counts[categoryName] = (counts[categoryName] || 0) + 1;
    });
    return Object.keys(counts).map((name) => ({
      name,
      value: counts[name],
    }));
  }, [signalements]);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <Navigation />

      <main className="p-8 flex flex-row gap-8">
        {/* SECTION GAUCHE : LISTE DE TOUS LES SIGNALEMENTS */}
        <div className="w-2/3">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Tous les Signalements ({signalements.length}) :
          </h3>

          <ul className="space-y-4">
            {signalements.map((sign) => {
                // Déterminer la couleur en fonction du statut
                const statusColor = 
                  sign.statut?.idStatut === 1 ? "border-blue-500" : // Nouveau
                  sign.statut?.idStatut === 2 ? "border-amber-500" : // En cours
                  sign.statut?.idStatut === 3 ? "border-emerald-500" : // Terminé
                  "border-gray-300"; // Autre

                return (
                  <li 
                    key={sign.idSignalement} 
                    className={`p-5 border-l-4 ${statusColor} rounded-lg shadow-md bg-white flex flex-col gap-2 transition-transform hover:scale-[1.01]`}
                  >
                  <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">{sign.title}</p>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                      {sign.statut?.nameStatut} 
                    </span>
                    <Link to={`/admin/signalement/detail/${sign.idSignalement}`}>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm">
                        Détails
                      </button>
                    </Link>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <p><strong>Catégorie :</strong> {sign.categorie?.nameCategorie}</p>
                  <p><strong>Priorité :</strong> {sign.priorite?.namePriorite}</p>
                  <p><strong>ID :</strong> #{sign.idSignalement}</p>
                </div>
              </li>
              );
            })}

            {signalements.length === 0 && (
              <p className="text-gray-500 italic">Aucun signalement pour le moment.</p>
            )}
          </ul>
        </div>

      {/* SECTION DROITE : GRAPHIQUE & NAVIGATION */}
      <aside className="w-1/3 sticky top-8 h-fit space-y-6">
        
        {/* BLOC GRAPHIQUE */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h4 className="text-center font-bold mb-4 text-gray-700 uppercase text-xs tracking-wider">
            Répartition par catégorie
          </h4>
          <GraphStatut data={chartData} />
        </div>

          {/* BLOC NAVIGATION RAPIDE */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h4 className="font-bold mb-4 text-gray-700 border-b pb-2">Gestion signalements</h4>
            <div className="flex flex-col gap-3">
              
              {/* Bouton page nouveaux */}
              <Link 
                to="/admin/signalement/nouveaux" 
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-500 rounded-xl transition-all group"
              >
                <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-500">Gestion des nouveaux signalements</span>
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-blue-600">
                  <FontAwesomeIcon icon={faArrowLeft} className="rotate-180 text-xs" />
                </div>
              </Link>

              {/* Bouton page en cours */}
              <Link 
                to="/admin/signalement/encours" 
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-500 rounded-xl transition-all group"
              >
                <span className="text-sm font-semibold text-slate-600 group-hover:text-amber-500">Gestion des signalements en cours</span>
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-amber-600">
                  <FontAwesomeIcon icon={faSyncAlt} className="text-xs" /> {/* Remplace par faUsers si tu l'as importé */}
                </div>
              </Link>

              {/* Bouton page archivés */}
              <Link 
                to="/admin/signalement/archives" 
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-xl transition-all group"
              >
                <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-500">Gestion des signalements archivés</span>
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-emerald-600">
                  <FontAwesomeIcon icon={faFileLines} className="text-xs" />
                </div>
              </Link>

            </div>
          </div>

          {/* PETIT RAPPEL DE SÉCURITÉ (Optionnel) */}
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-[10px] text-emerald-700 font-bold uppercase text-center tracking-widest">
              Session Administrateur Sécurisée
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}