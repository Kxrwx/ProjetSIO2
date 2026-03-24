import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Navigation from "../Navigation";


export default function InfoAdminAcc() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/user', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                });

                const result = await response.json();

                if (response.ok) {
                    setUser(result);
                    console.log("Données utilisateur récupérées:", result);
                } else {
                    console.error("Erreur API:", result.error);
                }
            } catch (error) {
                console.error("Erreur connexion:", error);
            }
        };

        fetchUser();
    }, []);

    // ← STOP ici si user est null, évite le crash
    if (!user) return <p className="p-4">Chargement...</p>;

    return (
        
            <div className="w-full min-h-screen flex flex-col">
                {/* Conteneur de la Navigation avec position relative */}
                <div className="relative">
                    <Navigation />
                    
                    {/* Bouton positionné en bas à gauche de la zone de navigation */}
                    <div className="absolute bottom-4 left-12 top-20">
                        <Link to="/Admin">
                            <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors shadow-sm">
                                <FontAwesomeIcon icon={faArrowLeft} /> Retour
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Contenu principal centré */}
                <div className="flex-grow flex items-center justify-center">
                    <div className="space-y-6">
                        <div className="font-bold text-xl">
                        Vous disposez d'un accès restreint, vous êtes {user.role.nameRole}.<br/>
                        Vous avez un accès de : {user.permission[0].nameRole}
                        </div>
                    <div className="p-8 bg-white rounded-xl shadow-lg shadow-blue-400 border border-gray-100 text-xl leading-relaxed hover:shadow-blue-300 ">
                        <p>
                            <strong className="text-gray-600">Nom :</strong> {user.user.surname}<br/>
                            <strong className="text-gray-600">Email :</strong> {user.user.email}<br/>
                            <strong className="text-gray-600">Rôle :</strong> {user.role.nameRole}<br/>
                            <strong className="text-gray-600">Permission :</strong> {user.permission[0].nameRole}
                        </p>
                    </div>
                    </div>
                </div>
            </div>
    );
}