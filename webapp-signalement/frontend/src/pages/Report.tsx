import React, { useState, useEffect } from "react";
import "../styles/Report.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
  if (submitted) {
  return (
    /* 1. PARENT : On prend tout l'écran, on centre verticalement et horizontalement */
    <div className="min-h-screen relative w-full flex items-center justify-center p-6">
      
      {/* Bouton retour — Sorti du flux avec absolute */}
      <div className="absolute top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour
          </button>
        </Link>
      </div>

      {/* 2. CARD : On utilise mx-auto pour la sécurité horizontale */}
      <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-semibold mb-3">Signalement transmis</h2>
        <p className="text-sm leading-relaxed mb-8">
          Votre signalement a été enregistré de manière confidentielle. Conservez votre numéro de suivi pour consulter l'avancement de votre dossier.
        </p>

        {/* Numéro de suivi — Sécurisé contre le débordement */}
        <div className="container-nmr-suivi mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 w-full max-w-full overflow-hidden">
          <label className="label-suivi block text-xs text-gray-400 uppercase tracking-widest mb-1">
            Numéro de suivi
          </label>
          <div className="label-nmr-suivi text-lg md:text-xl font-mono font-bold text-gray-900 break-all leading-tight ">
            #{trackingCode}
          </div>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setFormData({ 
              titre: "", 
              nom: "", 
              contact: "", 
              lieu: "", 
              date: "", 
              categorie: "Harcèlement", 
              priorite: "Modéré", 
              description: "", 
              password: "" });
            setIsAnonymous(false);
          }}
          className="text-sm underline underline-offset-4 transition-colors"
        >
          Faire un nouveau signalement
        </button>
      </div>
    </div>
  );
}

// ─── Formulaire principal ────────────────────────────────────────────────────
  return (
    /* 1. PARENT : On enlève complètement le flexbox. On met juste relative (pour le bouton) et w-full */
    <div className="min-h-screen relative w-full pt-20 pb-12">

      {/* Bouton retour — reste en absolute */}
      <div className="absolute px-4 py-2 top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour
          </button>
        </Link>
      </div>
      <div className="max-w-4xl w-full mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-700 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400 tracking-widest hover:text-green-400 uppercase">Signalement Confidentiel</span>
          </div>
          <h1 className="text-3xl font-semibold text-black tracking-tight mb-2">Déclarer un incident</h1>
          <p className="text-gray-400 text-sm mb-4">Vos informations sont traitées de manière sécurisée et confidentielle.</p>

          {/* Numéro de suivi — classes CSS originales préservées */}
          <div className="container-nmr-suivi">
            <label className="label-suivi">Numéro de suivi : </label>
            <label className="label-nmr-suivi">#{trackingCode}</label>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center mb-8 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  step > s.id ? "bg-emerald-500 text-white" : step === s.id ? "bg-white " : "border"
                }`}>
                  {step > s.id ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.id}
                </div>
                <span className={`text-xs font-medium transition-colors ${step === s.id ? "text-green-500" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 mb-5 transition-colors duration-500 ${step > s.id ? "bg-emerald-500" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* ── Étape 1 — Incident ─────────────────────────────────────────── */}
          {step === 1 && (
            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-xl font-semibold  mb-1">Type d'incident</h2>
                <p className="text-sm ">Décrivez brièvement l'incident et sa nature.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium  mb-2">
                  Titre du signalement <span className="text-red-500">*</span>
                </label>
                <input
                  id="titre"
                  type="text"
                  placeholder="Ex : Comportement inapproprié lors d'une réunion"
                  value={formData.titre}
                  onChange={handleChange}
                  className="bg-white w-full px-4 py-3 rounded-xl border  text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium   mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, categorie: cat.value }))}
                      className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        formData.categorie === cat.value
                          ? "border-green-300  text-black bg-green-100"
                          : "bg-white"
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      {cat.value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Niveau de priorité <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PRIORITY_OPTIONS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, priorite: p.value }))}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                        formData.priorite === p.value
                          ? p.color + " border-current"
                          : " bg-white "
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${formData.priorite === p.value ? p.dot : "bg-gray-300"}`} />
                      {p.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Étape 2 — Détails ──────────────────────────────────────────── */}
          {step === 2 && (
            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-xl font-semibold mb-1">Détails de l'incident</h2>
                <p className="text-sm ">Précisez le contexte, le lieu et la date des faits.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Lieu de l'incident</label>
                  <input
                    id="lieu"
                    type="text"
                    placeholder="Ex : Salle de réunion B3"
                    value={formData.lieu}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-3 rounded-xl border text-sm 
                     focus:outline-none focus:ring-2 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date de l'incident</label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-3 rounded-xl border text-sm 
                     focus:outline-none focus:ring-2 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium  mb-2">
                  Description détaillée <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={6}
                  placeholder="Décrivez ici les faits avec précision : qui, quoi, quand, comment. Évitez les jugements de valeur et restez factuel."
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-white w-full px-4 py-3 rounded-xl border text-sm 
                     focus:outline-none focus:ring-2 focus:border-transparent transition italic"
                />
                <p className="text-xs mt-1.5">{formData.description.length} caractères</p>
              </div>
            </div>
          )}

          {/* ── Étape 3 — Identité ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-xl font-semibold  mb-1">Votre identité</h2>
                <p className="text-sm ">Vous pouvez rester anonyme. Votre choix n'affecte pas le traitement du dossier.</p>
              </div>

              <button
                type="button"
                onClick={handleAnonymousToggle}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 mb-6 transition-all duration-200 ${
                  isAnonymous ? "text-white" : " bg-white "
                }`}
              >
                <div className="text-black flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isAnonymous ? "" : ""}`}>
                    {isAnonymous ? "◎" : "○"}
                  </div>
                  <div className="text-left text-black">
                    <p className="font-medium text-sm">Signalement anonyme</p>
                    <p className="text-xs mt-0.5 text--400">Votre identité ne sera pas divulguée</p>
                  </div>
                </div>
                <div className={`border-black w-11 h-6 rounded-full relative transition-colors duration-200 ${isAnonymous ? "bg-emerald-400" : "bg-black-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isAnonymous ? "tran-x-6" : "tran-x-1"}`} />
                </div>
              </button>

              {!isAnonymous && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text--700 mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nom"
                      type="text"
                      placeholder="Prénom Nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="bg-white w-full px-4 py-3 rounded-xl border border--200 bg--50 text--900 text-sm placeholder--400 focus:outline-none focus:ring-2 focus:ring--900 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text--700 mb-2">
                      Adresse e-mail <span className="text--400 font-normal">(facultatif)</span>
                    </label>
                    <input
                      id="contact"
                      type="email"
                      placeholder="vous@entreprise.com"
                      value={formData.contact}
                      onChange={handleChange}
                      className="bg-white w-full px-4 py-3 rounded-xl border border--200 bg--50 text--900 text-sm placeholder--400 focus:outline-none focus:ring-2 focus:ring--900 focus:border-transparent transition"
                    />
                    <p className="text-xs text--400 mt-1.5">
                      Utilisé uniquement pour vous tenir informé de l'avancement du dossier.
                    </p>
                  </div>
                </div>
              )}

              {isAnonymous && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex gap-3">
                  <span className="text-amber-500 text-lg mt-0.5">ℹ</span>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    En mode anonyme, vous ne pourrez pas être recontacté. Conservez bien votre numéro de suivi affiché en haut de page.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Étape 4 — Sécurité ─────────────────────────────────────────── */}
          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <div className="p-8">
                <div className="mb-7">
                  <h2 className="text-xl font-semibold text--900 mb-1">Sécurisation du dossier</h2>
                  <p className="text-sm text--400">Définissez un mot de passe pour accéder au suivi de votre signalement.</p>
                </div>

                {/* Récapitulatif */}
                <div className="bg--50 border border--200 rounded-xl p-5 mb-6 space-y-2.5">
                  <p className="text-xs font-semibold text--400 uppercase tracking-widest mb-3">Récapitulatif</p>
                  {[
                    { label: "Titre", value: formData.titre },
                    { label: "Catégorie", value: formData.categorie },
                    { label: "Lieu", value: formData.lieu || "—" },
                    { label: "Date", value: formData.date || "—" },
                    { label: "Identité", value: isAnonymous ? "Anonyme" : formData.nom },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text--500">{label}</span>
                      <span className="font-medium text--800 max-w-xs truncate">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-sm pt-0.5">
                    <span className="text--500">Priorité</span>
                    <span className={`font-medium px-2.5 py-0.5 rounded-full text-xs ${
                      formData.priorite === "Critique" ? "bg-red-100 text-red-700"
                      : formData.priorite === "Haute" ? "bg-orange-100 text-orange-700"
                      : "bg-amber-100 text-amber-700"
                    }`}>
                      {formData.priorite}
                    </span>
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text--700 mb-2">
                    Mot de passe de suivi <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 caractères"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-3 rounded-xl border border--200 bg--50 text--900 text-sm placeholder--400 focus:outline-none focus:ring-2 focus:ring--900 focus:border-transparent transition"
                  />
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        formData.password.length >= i * 3
                          ? formData.password.length >= 10 ? "bg-emerald-500"
                          : formData.password.length >= 7 ? "bg-amber-400"
                          : "bg-red-400"
                          : "bg--200"
                      }`} />
                    ))}
                  </div>
                  <p className="text-xs text--400 mt-1.5">
                    Ce mot de passe vous permettra de consulter et suivre votre signalement.
                  </p>
                </div>
              </div>

              <div className="px-8 pb-8">
                <button
                  type="submit"
                  disabled={!canProceedStep4 || isLoading}
                  className="text-black bg-green-300 w-full py-4 rounded-xl bg--900 text-white text-sm font-semibold tracking-wide hover:bg--800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Soumettre le signalement
                    </>
                  )}
                </button>
                <p className="text-center text-xs text--400 mt-3">
                  Vos données sont chiffrées et confidentielles
                </p>
              </div>
            </form>
          )}

          {/* Navigation (étapes 1–3) */}
          {step < 4 && (
            <div className="px-8 pb-8 flex items-center justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text--500 hover:text--900 disabled:opacity-0 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>

              <button
                type="button"
                onClick={next}
                disabled={
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2) ||
                  (step === 3 && !canProceedStep3)
                }
                className="flex items-center text-black gap-2 px-6 py-2.5 rounded-xl bg--900 text-white text-sm font-semibold hover:bg--700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Continuer
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text--600 mt-6">
          Ce formulaire est sécurisé · Traitement confidentiel garanti
        </p>
      </div>
    </div>
  );
}