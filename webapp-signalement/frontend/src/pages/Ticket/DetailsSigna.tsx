import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Navigation from "../Navigation";

export default function DetailsSigna() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState(null);

  // Utilise useEffect pour charger les données automatiquement
  useEffect(() => {
    const fetchDetail = async () => {
      console.log("Appel API lancé pour l'ID:", id); // Pour vérifier que ça tourne

      try {
        const response = await fetch('http://localhost:5000/api/admin/signalement/detail', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({ idSignalement: Number(id) }), 
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Détail récupéré avec succès:", result);
          setData(result);
        } else {
          console.error("Erreur API:", result.message);
        }
      } catch (error) {
        console.error("Erreur connexion au serveur:", error);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]); // S'exécute dès que 'id' est disponible

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
                <div className="relative">
                    <Navigation />
                    
                    {/* Bouton positionné en bas à gauche de la zone de navigation */}
                    <div className="absolute bottom-4 left-12 top-20">
                        <Link to="/admin">
                            <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors shadow-sm">
                                <FontAwesomeIcon icon={faArrowLeft} /> Retour
                            </button>
                        </Link>
                    </div>
                </div>
      <h1 className="py-10 text-xl font-bold text-blue-600">Détails du signalement #{id}</h1>
      
    </div>
  );
}