import React, { useState } from "react";
import "../styles/Report.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Report() {
  const [showInput, setShowInput] = useState(true);
  const [categorie, setCategorie] = useState("");
  const [priorite, setPriorite]= useState("Modéré")

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
        <h3>Avant d'envoyer votre signalement, sachez que vous etes en sécurité ici, que votre voix compte et que nous vous protégeons avec la plus strict confidentialité</h3>
      </div>
        <form>
          <div className="container-nmr-suivi">
            <label className="label-suivi">Numero de suivi : </label>
            <label className="label-nmr-suivi">#Numero de suivi</label>
          </div>
          <span className="barre"></span>
          <div className="container-title-input"> 
            <label><input type="text" placeholder="Entrez le titre du signalement" required></input>*</label>
          </div>
          <div className="container-name">
            <label className="label-name-set-input">
              Signalement Anonyme
              <input
                className="name-set-input"
                type="checkbox"
                checked={!showInput}
                onChange={() => setShowInput(prev => !prev)}
              />{" "}
            </label>
            {showInput && (
              <div className="container-enter-name-contact">               
                <label><input  className="name-enter-input" type="text" placeholder="Entrez votre nom" required/>*</label>
                <input  className="contact-enter-input" type="email" placeholder="Entrez votre contact" />
              </div>
            )}
          </div>
          <div className="container-date-loc">
            <label>Lieu de l'incident <input type="text"></input></label>
            <label>Date de l'incident <input type="date"></input></label>
          </div>
          <div className="container-cm">
            <label>Catégorie *
            <select
              value={categorie}
      onChange={(e) => setCategorie(e.target.value)}
    >
      <option value="harcelement">Harcèlement</option>
      <option value="discrimination">Discrimination</option>
      <option value="violence">Violence</option>
    </select>
    </label>
    <label>Priorité *
    <select
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
            <label><textarea rows={5} placeholder="Description de l'incident" required></textarea>*</label>
          </div>
          <div className="container-password">
            <label>
              Mot de passe *
              <input type="password" required></input>
              <p>Ce mot de passe permet de suivre votre suivi</p>
              </label>
          </div>
          <div className="container-submit">
            <button type="submit">Valider et envoyer</button>
          </div>
        </form>
        <div className="container-footer">
        <p>
          Tous les signalements que vous nous adressez, quel que soit leur nature ou leur gravité apparente, sont traités avec le plus grand sérieux par notre équipe dédiée. Rien n'est considéré comme "pas grave" ou insignifiant à nos yeux ; chaque témoignage mérite une attention immédiate et une réponse adaptée pour vous protéger efficacement.
        </p>
      </div>
    </div>
  );
}
