import React, { useState } from "react";
import "../styles/Report.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Report() {
  const [showInput, setShowInput] = useState(true);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [categorie, setCategorie] = useState("");
  const [priorite, setPriorite] = useState("Modéré");

  const handleAnonymeChange = () => {
    setShowInput(prev => !prev);
    // Reset name and contact when user chooses anonyme
    if (showInput) {
      setName("");
      setContact("");
    }
  };

  return (
    <div className="container-report">
      <div className="container-btn-main">
        <Link to="/">
          <button><FontAwesomeIcon icon={faArrowLeft} /></button>  
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

      <form>
        <div className="container-nmr-suivi">
          <label className="label-suivi">Numero de suivi : </label>
          <label className="label-nmr-suivi">#Numero de suivi</label>
        </div>

        <div className="container-title-input"> 
          <label>
            <input id="titre" type="text" placeholder="Entrez le titre du signalement" required />*
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
                  id="name"
                  className="name-enter-input"
                  type="text"
                  placeholder="Entrez votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />*
              </label>
              <input
                id="contact"
                className="contact-enter-input"
                type="email"
                placeholder="Entrez votre contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="container-date-loc">
          <label>Lieu de l'incident <input id="lieu" type="text" /></label>
          <label>Date de l'incident <input id="date" type="date" /></label>
        </div>

        <div className="container-cm">
          <label>
            Catégorie *
            <select
              id="categorie"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
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
              value={priorite}
              onChange={(e) => setPriorite(e.target.value)}
            >
              <option value="Modéré">Modéré</option>
              <option value="Haute">Haute</option>
              <option value="Critique">Critique</option>
            </select>
          </label>
        </div>

        <div className="container-input-desc">
          <label><textarea id="description" rows={5} placeholder="Description de l'incident" required />*</label>
        </div>

        <div className="container-password">
          <label>
            Mot de passe *
            <input id="password" type="password" required />
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
