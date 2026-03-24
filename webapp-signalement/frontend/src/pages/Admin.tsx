import { useEffect, useState } from "react";
import { useNavigate, Link, data } from "react-router-dom"; // Imports regroupés
import Navigation from "./Navigation";
import GraphStatut from "../components/GraphStatut";
import "../styles/Admin.css";



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
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <Navigation />

      <main className="p-8 flex flex-row gap-8">
        {/* SECTION GAUCHE : LISTE (2/3 de l'écran) */}
        <div className="w-2/3">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Signalements ({signalements.length}) :
          </h3>

          <ul className="space-y-4">
            {signalements.map((sign, index) => (
              <li key={sign.id || index} className="p-5 border-l-4 border-blue-500 rounded-lg shadow-md bg-white flex flex-col gap-2 transition-transform hover:scale-[1.01]">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">{sign.title}</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {sign.statut.nameStatut} 
                  </span>
                  <span>
                    <Link to={`/admin/signalement/detail/${sign.idSignalement}`}>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm">
                        Détails
                      </button>
                    </Link>
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <p><strong>Catégorie :</strong> {sign.categorie.nameCategorie}</p>
                  <p><strong>Priorité :</strong> {sign.priorite.namePriorite}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION DROITE : GRAPHIQUE (1/3 de l'écran) */}
        <aside className="w-1/3 sticky top-8 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="text-center font-bold mb-4 text-gray-700">Répartition des statuts</h4>
                <GraphStatut data={chartData} />
            </div>
        </aside>
      </main>
    </div>
  );
}