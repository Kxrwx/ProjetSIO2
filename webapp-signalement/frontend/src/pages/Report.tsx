import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShieldAlt, faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";

export default function Report() {
  const [step, setStep] = useState(1);
  const [trackingCode, setTrackingCode] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    nom: "",
    contact: "",
    lieu: "",
    date: "",
    categorie: "Harcèlement",
    priorite: "Modéré",
    description: "",
    password: "",
  });

  useEffect(() => {
    const generateTrackingCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "SIG-";
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };
    setTrackingCode(generateTrackingCode());
  }, []);

  const handleAnonymousToggle = () => {
    setIsAnonymous((prev) => !prev);
    if (!isAnonymous) {
      setFormData((prev) => ({ ...prev, nom: "", contact: "" }));
    }
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      titre: formData.titre,
      nom: isAnonymous ? null : formData.nom || null,
      contact: isAnonymous ? null : formData.contact || null,
      lieu: formData.lieu || null,
      date: formData.date || null,
      categorie: formData.categorie,
      priorite: formData.priorite,
      description: formData.description,
      password: formData.password,
      trackingCode: trackingCode,
    };

    try {
      const response = await fetch("http://localhost:5000/api/signalements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log("RÉPONSE DU BACKEND:", result);

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(`Erreur : ${result.error}\n\nDétails : ${result.details || "Aucun détail"}`);
      }
    } catch (error) {
      console.error("ERREUR RÉSEAU:", error);
      alert("Erreur de connexion au serveur. Vérifiez que le backend est démarré sur le port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const canProceedStep1 = formData.titre && formData.categorie && formData.priorite;
  const canProceedStep2 = formData.description;
  const canProceedStep3 = isAnonymous || formData.nom;
  const canProceedStep4 = formData.password.length >= 6;

  const STEPS = [
    { id: 1, label: "Incident" },
    { id: 2, label: "Détails" },
    { id: 3, label: "Identité" },
    { id: 4, label: "Sécurité" },
  ];

  const CATEGORY_OPTIONS = [
    { value: "Harcèlement", icon: "⚠" },
    { value: "Discrimination", icon: "⊘" },
    { value: "Violence", icon: "◈" },
  ];

  const PRIORITY_OPTIONS = [
    { value: "Modéré", color: "border-amber-400 bg-amber-50 text-amber-700", dot: "bg-amber-400" },
    { value: "Haute", color: "border-orange-500 bg-orange-50 text-orange-700", dot: "bg-orange-500" },
    { value: "Critique", color: "border-red-600 bg-red-50 text-red-700", dot: "bg-red-600" },
  ];

  // ─── Écran de confirmation ───────────────────────────────────────────────────
return (
  <div className="w-full min-h-full bg-slate-50 font-sans selection:bg-indigo-100 flex flex-col items-center overflow-visible">
    {/* 1. ÉCRAN DE SUCCÈS (SI SOUMIS) */}
    <AnimatePresence>
      {submitted ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-50 p-6"
        >
          {/* Bouton retour en haut à gauche */}
          <div className="absolute top-8 left-8">
            <Link to="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-sm">
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">Quitter</span>
            </Link>
          </div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-10 md:p-16 max-w-lg w-full text-center shadow-[0_30px_100px_rgba(79,70,229,0.08)] border border-indigo-50"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </div>

            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Signalement transmis</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              Votre déposition a été enregistrée avec succès. Notez votre code de suivi pour consulter les futures mises à jour.
            </p>

            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 mb-10">
              <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Référence unique</span>
              <div className="text-2xl md:text-3xl font-mono font-black text-indigo-600 tracking-tighter">
                #{trackingCode}
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setFormData({ titre: "", nom: "", contact: "", lieu: "", date: "", categorie: "Harcèlement", priorite: "Modéré", description: "", password: "" });
                setIsAnonymous(false);
              }}
              className="text-sm font-bold text-slate-400 hover:text-indigo-600 underline underline-offset-8 transition-all"
            >
              Effectuer un nouveau signalement
            </button>
          </motion.div>
        </motion.div>
      ) : (
        /* 2. FORMULAIRE PRINCIPAL */
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative w-full pt-12 pb-20"
        >
          {/* Bouton retour contextuel */}
          <div className="max-w-4xl mx-auto px-4 mb-10">
            <Link to="/" className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
              <FontAwesomeIcon icon={faArrowLeft} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Retour à l'accueil</span>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            {/* Header / Tracking info */}
            <header className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 mb-6 shadow-sm border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest uppercase">Session Chiffrée</span>
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Déclarer un incident</h1>
              <p className="text-slate-500 text-sm mb-6 font-medium">Anonymat garanti et protection des données de bout en bout.</p>
              
              <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-400">
                <span>RÉF :</span>
                <span className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-md text-indigo-600 font-mono">#{trackingCode}</span>
              </div>
            </header>

            {/* Stepper Dynamique */}
            <div className="relative flex justify-between items-center mb-12 px-4">
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
              <motion.div 
                className="absolute top-1/2 left-0 h-[3px] bg-indigo-500 -translate-y-1/2 z-0 rounded-full"
                animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 shadow-sm ${
                    step >= s.id ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30" : "bg-white text-slate-300 border border-slate-200"
                  }`}>
                    {step > s.id ? <FontAwesomeIcon icon={faCheckCircle} className="text-xs" /> : s.id}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${step >= s.id ? "text-indigo-600" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Carte Principale avec Transition de contenu */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(79,70,229,0.05)] border border-indigo-50 overflow-hidden">
              <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* ÉTAPE 1 : TYPE D'INCIDENT */}
                    {step === 1 && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-black text-slate-800 mb-2">Nature de l'incident</h2>
                          <p className="text-sm text-slate-400 font-medium">Catégorisez votre signalement pour un traitement optimal.</p>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-1">Titre du dossier</label>
                          <input
                            id="titre" type="text" value={formData.titre} onChange={handleChange}
                            placeholder="Sujet bref du signalement..."
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all font-medium text-slate-700"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {CATEGORY_OPTIONS.map((cat) => (
                            <button
                              key={cat.value} type="button" onClick={() => setFormData((p) => ({ ...p, categorie: cat.value }))}
                              className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 ${
                                formData.categorie === cat.value ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md scale-[0.98]" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-200 hover:bg-white"
                              }`}
                            >
                              <span className="text-2xl">{cat.icon}</span>
                              <span className="text-xs font-black uppercase tracking-tight">{cat.value}</span>
                            </button>
                          ))}
                        </div>

                        <div className="pt-4">
                          <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-1 mb-4 block">Priorité estimée</label>
                          <div className="flex flex-wrap justify-center gap-3">
                            {PRIORITY_OPTIONS.map((p) => (
                              <button
                                key={p.value} type="button" onClick={() => setFormData((prev) => ({ ...prev, priorite: p.value }))}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 text-xs font-bold transition-all ${
                                  formData.priorite === p.value ? "border-indigo-500 bg-white text-indigo-700 shadow-md" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-indigo-200"
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${formData.priorite === p.value ? p.dot : "bg-slate-300"}`} />
                                {p.value}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 2 : DÉTAILS */}
                    {step === 2 && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-black text-slate-800 mb-2">Détails des faits</h2>
                          <p className="text-sm text-slate-400 font-medium">Localisation et description précise de l'incident.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-indigo-400 ml-1">Lieu</label>
                            <input id="lieu" value={formData.lieu} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all text-slate-700" placeholder="Bureau, étage, site..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-indigo-400 ml-1">Date approximative</label>
                            <input id="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all text-slate-700" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between ml-1">
                            <label className="text-[10px] font-black uppercase text-indigo-400">Description factuelle</label>
                            <span className="text-[10px] font-bold text-slate-400">{formData.description.length} car.</span>
                          </div>
                          <textarea 
                            id="description" rows={6} value={formData.description} onChange={handleChange}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-3xl px-6 py-5 outline-none transition-all resize-none font-medium text-slate-700"
                            placeholder="Décrivez ce qu'il s'est passé de manière objective..."
                          />
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 3 : IDENTITÉ */}
                    {step === 3 && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-black text-slate-800 mb-2">Votre identité</h2>
                          <p className="text-sm text-slate-400 font-medium">Choisissez le niveau de confidentialité de votre déposition.</p>
                        </div>

                        <button
                          type="button" onClick={handleAnonymousToggle}
                          className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${
                            isAnonymous ? "border-indigo-500 bg-indigo-50" : "border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-colors ${isAnonymous ? "bg-indigo-500 text-white shadow-md" : "bg-white text-slate-400 shadow-sm"}`}>
                              {isAnonymous ? <FontAwesomeIcon icon={faShieldAlt} /> : "👤"}
                            </div>
                            <div className="text-left">
                              <p className={`font-black text-sm uppercase tracking-tight ${isAnonymous ? "text-indigo-700" : "text-slate-700"}`}>Signalement anonyme</p>
                              <p className="text-xs text-slate-500 font-medium italic">Aucune donnée personnelle ne sera transmise</p>
                            </div>
                          </div>
                          {/* Toggle Animé */}
                          <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isAnonymous ? "bg-indigo-500" : "bg-slate-300"}`}>
                            <motion.div 
                              animate={{ x: isAnonymous ? 26 : 4 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </div>
                        </button>

                        {!isAnonymous && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-indigo-400 ml-1">Nom Complet</label>
                              <input id="nom" value={formData.nom} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all text-slate-700" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-indigo-400 ml-1">E-mail (pour suivi)</label>
                              <input id="contact" value={formData.contact} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all text-slate-700" />
                            </div>
                          </motion.div>
                        )}

                        {isAnonymous && (
                          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-4">
                            <span className="text-amber-500">⚠️</span>
                            <p className="text-xs text-amber-700 font-medium leading-relaxed">
                              En mode anonyme, nous ne pourrons pas vous recontacter. Le suivi se fera uniquement via votre code et mot de passe.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ÉTAPE 4 : SÉCURITÉ & RÉCAP */}
                    {step === 4 && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-black text-slate-800 mb-2">Sécurisation & Validation</h2>
                          <p className="text-sm text-slate-400 font-medium">Vérifiez vos informations et protégez votre accès.</p>
                        </div>

<div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
  {/* Colonne 1 */}
  <div className="flex flex-col items-center">
    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Catégorie</p>
    <p className="text-sm font-bold text-slate-700">{formData.categorie}</p>
  </div>
  
  {/* Colonne 2 (Ajout d'une bordure latérale sur desktop pour séparer proprement) */}
  <div className="flex flex-col items-center md:border-x border-slate-200 px-4">
    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Priorité</p>
    <p className="text-sm font-bold text-slate-700">{formData.priorite}</p>
  </div>
  
  {/* Colonne 3 */}
  <div className="flex flex-col items-center">
    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Identité</p>
    <p className="text-sm font-bold text-slate-700 truncate w-full px-2">
      {isAnonymous ? "Anonymat total" : formData.nom}
    </p>
  </div>
</div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-1">Mot de passe de suivi</label>
                          <div className="relative">
                            <input
                              id="password" type="password" value={formData.password} onChange={handleChange}
                              placeholder="6 caractères minimum..."
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 outline-none transition-all font-mono text-slate-700"
                            />
                            <div className="absolute bottom-[-10px] left-2 right-2 flex gap-1 px-2">
  {[1, 2, 3, 4].map((i) => {
    // Calcul de la couleur selon la longueur totale
    const len = formData.password.length;
    let strengthColor = "bg-slate-200"; // Couleur par défaut (vide)

    if (len >= i * 3) {
      if (len <= 4) strengthColor = "bg-red-500";       // Trop court / Faible
      else if (len <= 8) strengthColor = "bg-amber-400"; // Moyen
      else strengthColor = "bg-emerald-500";            // Fort
    }

    return (
      <div 
        key={i} 
        className={`h-1 flex-1 rounded-full transition-all duration-500 ${strengthColor}`} 
      />
    );
  })}
</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Barre d'actions Footer */}
              <div className="bg-slate-50/50 p-8 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button" onClick={prev} disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-black text-slate-400 hover:text-indigo-600 transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Précédent
                </button>

                {step === 4 ? (
                  <button
                    onClick={handleSubmit} disabled={!canProceedStep4 || isLoading}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-3 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                  >
                    {isLoading ? "Cryptage en cours..." : "Soumettre le signalement"}
                    {!isLoading && <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-200" />}
                  </button>
                ) : (
                  <button
                    type="button" onClick={next}
                    disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2) || (step === 3 && !canProceedStep3)}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-3 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                  >
                    Continuer
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
              </div>
            </div>

            <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <FontAwesomeIcon icon={faLock} className="mr-2 text-indigo-300" />
              SÉCURISÉ PAR CHIFFREMENT ASYMÉTRIQUE
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}