import { useEffect, useState, useMemo } from "react"; // Ajout de useMemo pour la performance
import { useNavigate, Link } from "react-router-dom";
import Navigation from "./Navigation";
import GraphStatut from "../components/GraphStatut";
import NaviAdmin from "../components/NaviAdmin";
import TinyBarChart from "../components/TinyBarChart";
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
          console.log("Signalements récupérés:", result);
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

  // Formatage des données pour Recharts (TinyBarChart)
  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};

    signalements.forEach((sign) => {
      const priorityName = sign.priorite?.namePriorite || "Non définie";
      counts[priorityName] = (counts[priorityName] || 0) + 1;
    });

    // 1. On définit l'ordre idéal ici (doit correspondre exactement aux noms de ton API)
    const order = ["Modéré", "Haute", "Critique"];

    return Object.keys(counts)
      .map((key) => ({
        name: key,
        total: counts[key],
      }))
      // 2. ON TRIE ICI
      .sort((a, b) => {
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
  }, [signalements]);



  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <Navigation />

      <main className="p-8 flex flex-row gap-8">
        {/* SECTION GAUCHE : LISTE DE TOUS LES SIGNALEMENTS */}
        <div className="w-2/3 gap-6 flex flex-col">
        {/* GRAPHIQUE RECHARTS EN HAUT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Priorité des Signalements</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Signalements déposés</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 block leading-none">{signalements.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Dossiers</span>
              </div>
            </div>
            
            <TinyBarChart data={priorityData} />
          </div>
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Tous les Signalements ({signalements.length}) :
          </h3>

          <ul className="space-y-4">
            {signalements.map((sign) => {
                // Déterminer la couleur en fonction du statut
                const statusColor = 
                  sign.statut?.idStatut === 1 ? "border-blue-500 bg-blue-100 text-blue-700" : // Nouveau
                  sign.statut?.idStatut === 2 ? "border-amber-500 bg-amber-100 text-amber-700" : // En cours
                  sign.statut?.idStatut === 3 ? "border-emerald-500 bg-emerald-100 text-emerald-700" : // Terminé
                  "border-gray-300"; // Autre

                return (
                  <li 
                    key={sign.idSignalement} 
                    className={`p-5 border-l-4 ${statusColor} rounded-lg shadow-md bg-white flex flex-col gap-2 transition-transform hover:scale-[1.01]`}
                  >
                  <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">{sign.title}</p>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 ${statusColor} rounded-full text-sm font-bold`}>
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
            <NaviAdmin />
        </aside>
      </main>
    </div>
  );
}