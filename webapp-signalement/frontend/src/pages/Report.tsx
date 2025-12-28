import React, { useState } from "react";
import "../styles/Report.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Report() {
  const [showInput, setShowInput] = useState(true);
  const [formData, setFormData] = useState({
    titre: "",
    nom: "",
    contact: "",
    lieu: "",
    date: "",
    categorie: "harcelement",
    priorite: "Modéré",
    description: "",
    password: ""
  });

  const handleAnonymeChange = () => {
    setShowInput(prev => !prev);
    if (showInput) {
      setFormData(prev => ({ ...prev, nom: "", contact: "" }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      // Si anonyme est coché, on envoie nom/contact vides
      nom: showInput ? formData.nom : "",
      contact: showInput ? formData.contact : "",
    };

    try {
      const response = await fetch('http://localhost:5000/api/signalements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Signalement créé :', result);
        alert('Signalement envoyé avec succès !');
        // Réinitialiser le formulaire
        setFormData({
          titre: "",
          nom: "",
          contact: "",
          lieu: "",
          date: "",
          categorie: "harcelement",
          priorite: "Modéré",
          description: "",
          password: ""
        });
      } else {
        alert('Erreur lors de l\'envoi du signalement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="container-report">
      <div className="container-btn-main">
        <Link to="/">
          <button className="text-black"><FontAwesomeIcon icon={faArrowLeft} /></button>  
        </Link>
      </div>    

      <div className="container-title">
        <h1>Signalement harcèlement professionnel</h1>
      </div>

      <div className="container-desc">
        <h3>
          Avant d'envoyer votre signalement, sachez que vous etes en sécurité ici, que votre voix compte et que nous vous protégeons avec la plus strict confidentialité
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container-nmr-suivi">
          <label className="label-suivi">Numero de suivi : </label>
          <label className="label-nmr-suivi">#Numero de suivi</label>
        </div>

        <div className="container-title-input"> 
          <label >
            <input 
              id="titre"
              type="text" 
              placeholder="Entrez le titre du signalement" 
              value={formData.titre}
              onChange={handleChange}
              required 
              className="text-black"
            />*
          </label>
        </div>

        <div className="container-name">
          <label className="label-name-set-input">
            Signalement Anonyme
            <input
              className="name-set-input"
              type="checkbox"
              checked={!showInput}
              onChange={handleAnonymeChange}
              
            />
          </label>

          {showInput && (
            <div className="container-enter-name-contact">               
              <label>
                <input
                  id="nom"
                  className="name-enter-input text-black"
                  type="text"
                  placeholder="Entrez votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  
                />*
              </label>
              <input
                id="contact"
                className="contact-enter-input text-black"
                type="email"
                placeholder="Entrez votre contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <div className="container-date-loc">
          <label>Lieu de l'incident 
            <input 
              id="lieu" 
              type="text" 
              value={formData.lieu}
              onChange={handleChange}
              className="text-black"
            />
          </label>
          <label>Date de l'incident 
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
            >
              <option value="harcelement">Harcèlement</option>
              <option value="discrimination">Discrimination</option>
              <option value="violence">Violence</option>
            </select>
          </label>
          <label>
            Priorité *
            <select
              id="priorite"
              value={formData.priorite}
              onChange={handleChange}
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
              placeholder="Description de l'incident" 
              value={formData.description}
              onChange={handleChange}
              required 
              className="text-black"
            />*
          </label>
        </div>

        <div className="container-password">
          <label>
            Mot de passe *
            <input 
              id="password" 
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required 
              className="text-black"
            />
            <p>Ce mot de passe permet de suivre votre suivi</p>
          </label>
        </div>

        <div className="container-submit">
          <button type="submit">Valider et envoyer</button>
        </div>
      </form>

      <div className="container-footer">
        <p>
          Votre signalement est pris très au sérieux; vous n'êtes pas responsable de ce que vous subissez et nous ferons tout notre possible pour vous accompagner en toute confidentialité.
        </p>
      </div>
    </div>
  );
}