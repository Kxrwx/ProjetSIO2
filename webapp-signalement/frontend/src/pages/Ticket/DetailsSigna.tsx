import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faUser, faMapMarkerAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import Navigation from "../Navigation";
import Messages from "../Message/Messages";
import Loader from "../../components/Loader";

// 1. Définition du type pour ton JSON
interface SignalementDetail {
  idSignalement: number;
  trackingCode: string;
  title: string;
  description: string;
  lieu: string;
  dateEncrypted: string;
  victimName: string;
  victimContact: string;
  createdAt: string;
  updatedAt: string | null;
}

export default function DetailsSigna() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SignalementDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/signalement/detail', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
          body: JSON.stringify({ idSignalement: Number(id) }), 
        });

        const result = await response.json();
        if (response.ok) {
          console.log("Détail du signalement récupéré:", result);
          setData(result);
        } else {
          console.error("Erreur API:", result.message);
        }
      } catch (error) {
        console.error("Erreur connexion au serveur:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  // 2. Gestion de l'état de chargement
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  // 3. Gestion si aucune donnée n'est trouvée
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-xl font-bold text-red-500">Signalement introuvable</p>
        <Link to="/admin" className="mt-4 text-blue-600 underline">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="relative">
        <Navigation />
        <div className="absolute left-12 top-24">
          <Link to="/admin">
            <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white border-2 border-black transition-all shadow-md flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowLeft} /> Retour
            </button>
          </Link>
        </div>
      </div>

      <main className="px-12 py-24 max-w-6xl mx-auto w-full">
        {/* Header du dossier */}
        <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 pb-6">
          <div>
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-mono uppercase tracking-widest mb-2 inline-block">
              {data.trackingCode}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900">{data.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-blue-600 font-black text-xl">DOSSIER #{id}</p>
            <p className="text-sm text-gray-400">Statut : Nouveau</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : Description et Localisation */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              {/* On utilise flex justify-between pour écarter le titre et le bouton */}
              <div className="flex justify-between items-start mb-6"> 
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Détails de l'incident
                </h2>
                
                <Link to={`/admin/signalement/detail/${data.idSignalement}/messages`}>
                  <button className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm">
                    Voir les messages
                  </button>
                </Link>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg italic text-gray-700 leading-relaxed border-l-4 border-blue-500">
                "{data.description || "Aucune description fournie."}"
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Informations contextuelles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Lieu constaté</p>
                    <p className="font-semibold text-gray-800">{data.lieu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Date des faits</p>
                    <p className="font-semibold text-gray-800">
                      {data.dateEncrypted ? new Date(data.dateEncrypted).toLocaleDateString() : "Non fournie"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* COLONNE DROITE : Victime et Logs */}
          <div className="space-y-6">
            <section className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-red-500">
              <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-red-500" /> Identité de la victime
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Nom complet</p>
                  <p className="text-lg font-medium text-gray-900">{data.victimName || "Anonyme"} </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Canal de contact</p>
                  <p className="text-lg font-medium text-blue-600 flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                    {data.victimContact || "Contact anonyme"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-800 p-6 rounded-2xl shadow-inner text-gray-300">
              <h3 className="text-xs uppercase font-black tracking-widest text-gray-500 mb-4">Audit Trail</h3>
              <div className="space-y-2 text-sm">
                <p>Déposé le : <span className="text-white">{new Date(data.createdAt).toLocaleString()}</span></p>
                {data.updatedAt && (
                  <p>Mis à jour : <span className="text-white">{new Date(data.updatedAt).toLocaleString()}</span></p>
                )}
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}