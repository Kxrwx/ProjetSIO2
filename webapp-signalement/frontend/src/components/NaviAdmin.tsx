
import { faFileLines } from "@fortawesome/free-solid-svg-icons/faFileLines";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons/faSyncAlt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { Link } from "react-router-dom";


export default function NaviAdmin() {
    return (
        <div>
            {/* BLOC NAVIGATION RAPIDE */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-bold mb-4 text-gray-700 border-b pb-2">Gestion signalements</h4>
                <div className="flex flex-col gap-3">
                
                {/* Bouton page nouveaux */}
                <Link 
                    to="/admin/signalement/nouveaux" 
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-500 rounded-xl transition-all group"
                >
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-500">Gestion des nouveaux signalements</span>
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-blue-600">
                    <FontAwesomeIcon icon={faArrowLeft} className="rotate-180 text-xs" />
                    </div>
                </Link>

                {/* Bouton page en cours */}
                <Link 
                    to="/admin/signalement/encours" 
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-500 rounded-xl transition-all group"
                >
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-amber-500">Gestion des signalements en cours</span>
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-amber-600">
                    <FontAwesomeIcon icon={faSyncAlt} className="text-xs" /> {/* Remplace par faUsers si tu l'as importé */}
                    </div>
                </Link>

                {/* Bouton page archivés */}
                <Link 
                    to="/admin/signalement/archives" 
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-xl transition-all group"
                >
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-500">Gestion des signalements archivés</span>
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:text-emerald-600">
                    <FontAwesomeIcon icon={faFileLines} className="text-xs" />
                    </div>
                </Link>

                </div>
            </div>
        </div>
        );
}