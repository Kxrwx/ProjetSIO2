import "../styles/Tracking.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Tracking() {
  return (
  <div className="container-tracking">
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
        <div className="container-input-code">
          <label>Numéro de suivi<input id="id" type="text" required placeholder="Entrez votre numéro de suivi"></input></label>
          <label>Mot de passe<input id="password" type="password" required></input></label>
        </div>
        <div className="container-submit">
          <button type="submit">
            Valider
          </button>
        </div>
      </form>


        <div className="container-footer">
          <p>Votre signalement est pris très au sérieux; vous n'êtes pas responsable de ce que vous subissez et nous ferons tout notre possible pour vous accompagner en toute confidentialité.</p></div>
        </div>
    )
}
