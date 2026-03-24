import { useEffect, useState } from "react";
import { useNavigate, Link, data } from "react-router-dom"; // Imports regroupés
import Navigation from "./Navigation";
import InfoAdminAcc from "./InfoAdmin/InfoAdminAcc";
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

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
        <Navigation/>

      <main className="admin-content">
        

        <div className="">
        <h3 className="text-xl font-bold mb-4">Signalements ({signalements.length}) :</h3>
        
        <ul className="space-y-4">
          {signalements.map((sign, index) => (
            // On utilise un seul <li> par signalement
            <li key={sign.id || index} className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-1">
              <div className="flex justify-between items-center space-x-6">
                <p><strong>Titre :</strong> {sign.title}</p>
                <p><strong>Catégorie :</strong> {sign.categorie.nameCategorie}</p>
                <p><strong>Priorité :</strong> {sign.priorite.namePriorite}</p>
                <p><strong>Statut :</strong> {sign.statut.nameStatut}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      </main>
    </div>
  );
}