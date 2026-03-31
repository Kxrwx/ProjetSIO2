import { useState, useEffect } from "react";

interface SignalementDetail {
  idSignalement: number;
  trackingCode: string;
  title: string;
  description: string;
  lieu: string;
  createdAt: string;
  idStatut: number;
}

interface InfoTrackingProps {
  idSignalement: number;
  trackingCode: string;
  password: string;
}

export default function InfoTracking({ idSignalement, trackingCode, password }: InfoTrackingProps) {
  const [data, setData] = useState<SignalementDetail | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
  // AJOUT DE SÉCURITÉ : On vérifie que trackingCode et password existent
  if (isVisible && !data && !loading && trackingCode && password) {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch("http://localhost:5000/api/signalements/consult", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            // On utilise l'optionnel chaining ?. ou on vérifie avant
            trackingCode: trackingCode.trim(), 
            password: password 
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erreur de connexion Tooltip:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }
}, [isVisible, data, trackingCode, password, loading]);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* L'élément déclencheur */}
      <h1 className="text-lg font-bold text-slate-800 cursor-help hover:text-blue-600 transition-colors">
        Discussion Signalement #{idSignalement}
      </h1>

      {/* L'infobulle (Tooltip) */}
      {isVisible && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 z-[110] animate-in fade-in zoom-in duration-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-4 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Chargement...</span>
            </div>
          ) : error ? (
            <p className="text-xs text-red-500 font-medium">Impossible de récupérer les détails.</p>
          ) : data ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Détails du dossier</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-bold text-slate-800">{data.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-4 leading-relaxed italic">
                  "{data.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <p className="text-slate-400 uppercase font-bold text-[9px] mb-0.5">Lieu</p>
                  <p className="text-slate-700 truncate">{data.lieu}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <p className="text-slate-400 uppercase font-bold text-[9px] mb-0.5">Référence</p>
                  <p className="text-slate-700 font-mono">{data.trackingCode}</p>
                </div>
              </div>
            </div>
          ) : null}
          
          {/* Petite flèche */}
          <div className="absolute -top-1 left-6 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45"></div>
        </div>
      )}
    </div>
  );
}