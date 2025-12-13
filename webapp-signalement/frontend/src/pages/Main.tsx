//Page Main

//Import
import { Link } from "react-router-dom";
import "../styles/Main.css"


//Bloc HTML
export default function Main() {
  return (
    <div className="container-main">
      <div className="space"></div>
        <div className="container-title">
            <h1>Signalement harcèlement professionnel</h1>
        </div>
        <div className="container-desc">
          <h3>Avant d'envoyer votre signalement, sachez que vous etes en sécurité ici, que votre voix compte et que nous vous protégeons avec la plus strict confidentialité</h3>
        </div>
        <div className="container-button">
          <div>
            
            <Link to="/report">
              <button className="btn-report">Creation d'un signalement</button>
            </Link>
            <Link to="/tracking">
              <button className="btn-tracking">Suivi d'un signalement</button>
            </Link>

          </div>
        </div>
        <div className="container-footer">
          <p>Tous les signalements que vous nous adressez, quel que soit leur nature ou leur gravité apparente, sont traités avec le plus grand sérieux par notre équipe dédiée. Rien n'est considéré comme "pas grave" ou insignifiant à nos yeux ; chaque témoignage mérite une attention immédiate et une réponse adaptée pour vous protéger efficacement.</p>
        </div>
    </div>
    
  )
}
    