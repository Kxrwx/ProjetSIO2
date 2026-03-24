import React, { useState, useEffect } from "react";
import "../styles/Report.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Report() {
  const [trackingCode, setTrackingCode] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    nom: "",
    contact: "",
    lieu: "",
    date: "",
    categorie: "Harcèlement",  
    priorite: "Modéré",        
    description: "",
    password: ""
  });

  // Génération du tracking code au chargement
  useEffect(() => {
    const generateTrackingCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'SIG-';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };
    setTrackingCode(generateTrackingCode());
  }, []);

  const handleAnonymousToggle = () => {
    setIsAnonymous(prev => !prev);
    // Si on passe en anonyme, vide nom et contact
    if (!isAnonymous) {
      setFormData(prev => ({ ...prev, nom: "", contact: "" }));
    }
  };

  const handleChange = (e : any) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    


    // Prépare les données pour le backend
    const dataToSend = {
      titre: formData.titre,
      nom: isAnonymous ? null : formData.nom || null,
      contact: isAnonymous ? null : formData.contact || null,
      lieu: formData.lieu || null,
      date: formData.date || null,
      categorie: formData.categorie,      // "Harcèlement", "Discrimination", "Violence"
      priorite: formData.priorite,        // "Modéré", "Haute", "Critique"
      description: formData.description,
      password: formData.password,
      trackingCode: trackingCode
    };

    console.log("DONNÉES ENVOYÉES AU BACKEND:", JSON.stringify(dataToSend, null, 2));

    try {
      const response = await fetch('http://localhost:5000/api/signalements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log("RÉPONSE DU BACKEND:", result);

      if (response.ok) {
        alert(`Signalement créé avec succès !\n\nCode de suivi : ${result.trackingCode}\n\nGardez ce code pour consulter votre signalement.`);
        // Optionnel : rediriger vers une page de confirmation
        // window.location.href = `/suivi/${result.trackingCode}`;
      } else {
        alert(`Erreur : ${result.error}\n\nDétails : ${result.details || 'Aucun détail'}`);
      }
    } catch (error) {
      console.error("ERREUR RÉSEAU:", error);
      alert("Erreur de connexion au serveur. Vérifiez que le backend est démarré sur le port 5000.");
    }
  };

  return (
    <div className="container-report">
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

      <div className="container-desc">
        <h3>
          Avant d'envoyer votre signalement, sachez que vous êtes en sécurité ici, 
          que votre voix compte et que nous vous protégeons avec la plus stricte confidentialité.
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        {/* TRACKING CODE GÉNÉRÉ ET AFFICHÉ */}
        <div className="container-nmr-suivi">
          <label className="label-suivi">Numéro de suivi : </label>
          <label className="label-nmr-suivi">#{trackingCode}</label>
        </div>

        <div className="container-title-input"> 
          <label>
            <input 
              id="titre"
              type="text" 
              placeholder="Entrez le titre du signalement *" 
              value={formData.titre}
              onChange={handleChange}
              required 
              className="text-black"
            />
          </label>
        </div>

        <div className="container-name">
          <label className="label-name-set-input">
            Signalement Anonyme
            <input
              className="name-set-input"
              type="checkbox"
              checked={isAnonymous}
              onChange={handleAnonymousToggle}
            />
          </label>

          {!isAnonymous && (
            <div className="container-enter-name-contact">               
              <label>
                <input
                  id="nom"
                  className="name-enter-input text-black"
                  type="text"
                  placeholder="Entrez votre nom *"
                  value={formData.nom}
                  onChange={handleChange}
                  required={!isAnonymous}
                />
              </label>
              <input
                id="contact"
                className="contact-enter-input text-black"
                type="email"
                placeholder="Entrez votre contact (email)"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <div className="container-date-loc">
          <label>
            Lieu de l'incident
            <input 
              id="lieu" 
              type="text" 
              value={formData.lieu}
              onChange={handleChange}
              className="text-black"
            />
          </label>
          <label>
            Date de l'incident
            <input 
              id="date" 
              type="date" 
              value={formData.date}
              onChange={handleChange}
              className="text-black"
            />
          </label>
        </div>

        <div className="container-cm">
          <label>
            Catégorie *
            <select
              id="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
            >
              <option value="Harcèlement">Harcèlement</option>
              <option value="Discrimination">Discrimination</option>
              <option value="Violence">Violence</option>
            </select>
          </label>
          <label>
            Priorité *
            <select
              id="priorite"
              value={formData.priorite}
              onChange={handleChange}
              required
            >
              <option value="Modéré">Modéré</option>
              <option value="Haute">Haute</option>
              <option value="Critique">Critique</option>
            </select>
          </label>
        </div>

        <div className="container-input-desc">
          <label>
            <textarea 
              id="description" 
              rows={5} 
              placeholder="Description détaillée de l'incident *" 
              value={formData.description}
              onChange={handleChange}
              required 
              className="text-black"
            />
          </label>
        </div>

        <div className="container-password">
          <label>
            Mot de passe de suivi *
            <input 
              id="password" 
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required 
              className="text-black"
            />
            <p>Ce mot de passe vous permettra de consulter votre signalement</p>
          </label>
        </div>

        <div className="container-submit">
          <button type="submit">Valider et envoyer</button>
        </div>
      </form>

      <div className="container-footer">
        <p>
          Votre signalement est pris très au sérieux. Vous n'êtes pas responsable 
          de ce que vous subissez et nous vous accompagnerons en toute confidentialité.
        </p>
      </div>
    </div>
  );
}