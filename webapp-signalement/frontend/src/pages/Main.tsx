//Page Main

//Import
import { Link } from "react-router-dom";
import "../styles/Main.css"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


//Bloc HTML
export default function Main() {
  return (
    <div className="container-main flex flex-col items-center justify-center min-h-screen p-6">
    <div className="container-admin-link">
      <Link to="/auth">
        <button className="btn-admin">Accès administration <FontAwesomeIcon icon={faArrowRight} /></button>
      </Link>
    </div>

  <div className="container-title">
    <h1>Signalement harcèlement professionnel</h1>
  </div>
    <div className="container-desc">
        <h3>Avant d'envoyer votre signalement, sachez que vous êtes en sécurité ici, que votre voix compte et que nous vous protégeons avec la plus stricte confidentialité</h3>
    </div>
    
    <div className="mt-12 w-full max-w-4xl mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-400 rounded-xl overflow-hidden shadow-sm">
        
        {/* Option Création */}
        <Link 
          to="/report" 
          className="group p-10 bg-white border-b md:border-b-0 md:border-r border-gray-400 transition-all"
        >
          <div className="flex flex-col h-full">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Étape 1</span>
            <h2 className="text-2xl font-semibold text-black mb-3 group-hover:text-blue-700">
              Créer un signalement
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Déposez un témoignage de manière anonyme ou nominative. Vos données sont chiffrées dès l'envoi.
            </p>
            <div className="mt-auto flex items-center font-medium text-black group-hover:gap-3 transition-all gap-2">
              Commencer <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </div>
          </div>
        </Link>

        {/* Option Suivi */}
        <Link 
          to="/tracking" 
          className="group p-10 bg-white transition-all"
        >
          <div className="flex flex-col h-full">
            <span className="text-xs font-bold uppercase tracking-widest text-green-400 mb-4">Gestion</span>
            <h2 className="text-2xl font-semibold text-black mb-3 group-hover:text-green-400">
              Suivi d'un dossier
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Accédez à votre espace d'échange à l'aide de votre code de suivi pour consulter l'avancement.
            </p>
            <div className="mt-auto flex items-center font-medium text-black group-hover:gap-3 transition-all gap-2">
              Vérifier l'état <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </div>
          </div>
        </Link>

      </div>
    </div>

    <div className="container-footer">
        <p>Tous les signalements que vous nous adressez, quel que soit leur nature ou leur gravité apparente, sont traités avec le plus grand sérieux par notre équipe dédiée. Rien n'est considéré comme "pas grave" ou insignifiant à nos yeux ; chaque témoignage mérite une attention immédiate et une réponse adaptée pour vous protéger efficacement.</p>
    </div>
</div>
    
  )
}
    