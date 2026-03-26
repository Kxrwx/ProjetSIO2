import { useState , useCallback } from "react";
import "../styles/Tracking.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ChatBox from "../components/ChatBoxNoAdmin";

interface Signalement {
  idSignalement: number;
  trackingCode: string;
  title: string;
  statut?: { nameStatut: string };
  priorite?: { namePriorite: string };
  categorie?: { nameCategorie: string };
  description: string; 
  messagesDechiffres: any[]; 
}

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState("");
  const [password, setPassword] = useState("");
  const [signalement, setSignalement] = useState<Signalement | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fonction fetch extraite pour être réutilisée par le polling et ChatBox
  const fetchSignalement = useCallback(async (isPolling = false) => {
    if (!trackingCode || !password) return;
    
    if (!isPolling) setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/signalements/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: trackingCode.trim(), password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        if (!isPolling) setError(data.error || "Erreur de récupération.");
        return;
      }
      setSignalement(data);
    } catch (err) {
      console.error(err);
      if (!isPolling) setError("Connexion au serveur impossible.");
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [trackingCode, password]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");
    fetchSignalement();
  };

  return (
    <div className="container-tracking">
      <div className="absolute px-4 py-2 top-4 left-4">
        <Link to="/">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour      
          </button>
        </Link>
      </div>   

      <div className="container-title">
        <h1>Signalement harcèlement professionnel</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container-input-code">
          <label>Numéro de suivi
            <input
              type="text"
              required
              placeholder="Ex: SIG-XXXXXXXX"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
          </label>
          <label>Mot de passe
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        {error && <p className="tracking-error">{error}</p>}
        <div className="container-submit">
          <button type="submit" disabled={loading}>
            {loading ? "Chargement..." : "Valider"}
          </button>
        </div>
      </form>

      {signalement && (
        <div className="container-signalement-detail">
          <h2>Votre signalement</h2>
          <p><strong>Code :</strong> {signalement.trackingCode}</p>
          <p><strong>Titre :</strong> {signalement.title}</p>
          <p><strong>Statut :</strong> {signalement.statut?.nameStatut}</p>
          <p><strong>Priorité :</strong> {signalement.priorite?.namePriorite}</p>
          <p><strong>Catégorie :</strong> {signalement.categorie?.nameCategorie}</p>
          <p><strong>Description :</strong> {signalement.description}</p>
          
          <ChatBox 
            idSignalement={signalement.idSignalement} 
            messages={signalement.messagesDechiffres || []}
            onRefresh={() => fetchSignalement(true)} 
          />
        </div>
      )}
    </div>
  );
}