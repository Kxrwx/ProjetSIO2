import { useState } from "react";
import "../styles/Tracking.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface Signalement {
  trackingCode: string;
  title: string;
  statut?: { nameStatut: string };
  priorite?: { namePriorite: string };
  categorie?: { nameCategorie: string };
  descriptionEncrypted: string;
  messages?: Array<{
    id: number;
    createdAt: string;
    contenuEncrypted: string;
  }>;
}

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState("");
  const [password, setPassword] = useState("");
  const [signalement, setSignalement] = useState<Signalement | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setError("");
    setSignalement(null);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/signalements/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingCode: trackingCode.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Erreur lors de la récupération du signalement.");
        return;
      }
      setSignalement(data);
    } catch (err) {
      console.error(err);
      setError("Connexion au serveur impossible. Vérifiez que le backend est démarré sur le port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-tracking">
      <div className="container-btn-back">
        <Link to="/">
          <button className="btn-back">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour
          </button>
        </Link>
      </div> 
      <div className="container-title">
        <h1>Signalement harcèlement professionnel</h1>
      </div>
      <div className="container-desc">
        <h3>Avant d'envoyer votre signalement, sachez que vous etes en sécurité ici, que votre voix compte et que nous vous protégeons avec la plus strict confidentialité</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container-input-code">
          <label>Numéro de suivi
            <input
              id="trackingCode"
              type="text"
              required
              placeholder="Ex: SIG-XXXXXXXX"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
          </label>
          <label>Mot de passe
            <input
              id="password"
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
          <p><strong>Description :</strong> {signalement.descriptionEncrypted}</p>
          {(signalement.messages?.length ?? 0) > 0 && (
            <div className="container-messages">
              <h3>Conversation</h3>
              {signalement.messages?.map((msg) => (
                <div key={msg.id} className="message-item">
                  <span className="message-date">
                  {new Date(msg.createdAt).toLocaleString()}
                  </span>
                  <p>{msg.contenuEncrypted}</p>
                 </div>
            ))}
            </div>
          )}
        </div>
      )}

      <div className="container-footer">
        <p>Votre signalement est pris très au sérieux; vous n'êtes pas responsable de ce que vous subissez et nous ferons tout notre possible pour vous accompagner en toute confidentialité.</p>
      </div>
    </div>
  );
}