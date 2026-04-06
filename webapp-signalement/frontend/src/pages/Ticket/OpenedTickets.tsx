import { useEffect, useState, useMemo } from "react"; // Ajout de useMemo pour la performance
import { useNavigate, Link } from "react-router-dom";
import Navigation from "../Navigation";
import GraphStatut from "../../components/GraphStatut";
import NaviAdmin from "../../components/NaviAdmin";
import "../../styles/Admin.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiUrl } from "../../config/api";

export default function OpenedTickets() {
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
        const response = await fetch(apiUrl("/api/admin/signalement"), {
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

  // 1. Filtrer les signalements pour n'avoir que les "en cours"
  // On utilise useMemo pour éviter de recalculer à chaque rendu si 'signalements' ne change pas
  const seulementEnCours = useMemo(() => {
    return signalements.filter((sign: any) => sign.statut?.nameStatut === "En cours");
  }, [signalements]);

  // 2. Préparer les données du graphique seulement les EnCours 
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    seulementEnCours.forEach((sign) => {
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
      <div className="absolute top-20 left-4 z-50">
        <Link to="/admin">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour
          </button>
        </Link>
      </div>

      <main className="p-8 flex flex-row gap-8">
        {/* SECTION GAUCHE : LISTE DES EnCours SIGNALEMENTS */}
        <div className="w-2/3">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Signalements en cours ({seulementEnCours.length}) :
          </h3>

          <ul className="space-y-4">
            {seulementEnCours.map((sign) => (
              <li key={sign.idSignalement} className="p-5 border-l-4 border-blue-500 rounded-lg shadow-md bg-white flex flex-col gap-2 transition-transform hover:scale-[1.01]">
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
            ))}

            {seulementEnCours.length === 0 && (
              <p className="text-gray-500 italic">Aucun signalement en cours pour le moment.</p>
            )}
          </ul>
        </div>

        {/* SECTION DROITE : GRAPHIQUE */}
        <aside className="w-1/3 sticky top-8 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="text-center font-bold mb-4 text-gray-700">Répartition par catégorie</h4>
                <GraphStatut data={chartData} />
            </div>
            <NaviAdmin/>
        </aside>
      </main>
    </div>
  );
}