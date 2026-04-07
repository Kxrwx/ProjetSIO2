import React, { useState, useEffect, useRef } from "react";
import "../styles/Report.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperclip, faTimes, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "../components/CheckBox";
import { apiUrl } from "../config/api";

export default function Report() {
  const [step, setStep] = useState(1);
  const [trackingCode, setTrackingCode] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- NOUVEAU : État pour les fichiers ---
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // --- NOUVEAU : Fonctions de gestion de fichiers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedFiles.length + newFiles.length > 5) {
        alert("Limite de 5 fichiers maximum atteinte.");
        return;
      }
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

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

    // --- MODIFICATION : Utilisation de FormData pour inclure les fichiers ---
    const data = new FormData();
    data.append("titre", formData.titre);
    data.append("nom", isAnonymous ? "" : (formData.nom || ""));
    data.append("contact", isAnonymous ? "" : (formData.contact || ""));
    data.append("lieu", formData.lieu || "");
    data.append("date", formData.date || "");
    data.append("categorie", formData.categorie);
    data.append("priorite", formData.priorite);
    data.append("description", formData.description);
    data.append("password", formData.password);
    data.append("trackingCode", trackingCode);

    // Ajout des fichiers (clé "files" pour correspondre au backend)
    selectedFiles.forEach((file) => {
      data.append("fichiers", file); 
    });

    try {
      const response = await fetch(apiUrl("/api/signalements"), {
        method: "POST",
        // Note: Ne pas mettre de Content-Type header ici, le navigateur le gère seul
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(`Erreur : ${result.error}`);
      }
    } catch (error) {
      console.error("ERREUR RÉSEAU:", error);
      alert("Erreur de connexion au serveur.");
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

  if (submitted) {
    return (
      <div className="min-h-screen relative w-full flex items-center justify-center p-6">
        <div className="absolute top-4 left-4 z-50">
          <Link to="/">
            <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors">
              <FontAwesomeIcon icon={faArrowLeft} /> Retour
            </button>
          </Link>
        </div>

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
              setSelectedFiles([]);
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

  return (
    <div className="min-h-screen relative w-full pt-20 pb-12">
      <div className="absolute px-4 py-2 top-4 left-4 z-50">
        <Link to="/">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour
          </button>
        </Link>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 md:px-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-700 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400 tracking-widest hover:text-green-400 uppercase">Signalement Confidentiel</span>
          </div>
          <h1 className="text-3xl font-semibold text-black tracking-tight mb-2">Déclarer un incident</h1>
          <p className="text-gray-400 text-sm mb-4">Vos informations sont traitées de manière sécurisée et confidentielle.</p>

          <div className="container-nmr-suivi">
            <label className="label-suivi">Numéro de suivi : </label>
            <label className="label-nmr-suivi">#{trackingCode}</label>
          </div>
        </div>

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

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {step === 1 && (
            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-xl font-semibold mb-1">Type d'incident</h2>
                <p className="text-sm">Décrivez brièvement l'incident et sa nature.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Titre du signalement <span className="text-red-500">*</span>
                </label>
                <input
                  id="titre"
                  type="text"
                  placeholder="Ex : Comportement inapproprié lors d'une réunion"
                  value={formData.titre}
                  onChange={handleChange}
                  className="bg-white w-full px-4 py-3 rounded-xl border text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-xl font-semibold mb-1">Détails de l'incident</h2>
                <p className="text-sm">Précisez le contexte, le lieu et la date des faits.</p>
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
                    className="bg-white w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date de l'incident</label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  Description détaillée <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={6}
                  placeholder="Décrivez ici les faits avec précision : qui, quoi, quand, comment."
                  value={formData.description}
                  onChange={handleChange}
                  className="bg-white w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent transition italic"
                />
                <p className="text-xs mt-1.5">{formData.description.length} caractères</p>
              </div>

              {/* --- NOUVEAU : ZONE D'UPLOAD --- */}
              <div className="border-t border-slate-100 pt-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Pièces jointes (Max 5)
                </label>
                
                <div className="flex flex-col gap-4">
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={selectedFiles.length >= 5}
                    className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faPaperclip} />
                    <span className="text-sm font-semibold">Ajouter des documents ou photos</span>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FontAwesomeIcon icon={faFileAlt} className="text-slate-400" />
                          <span className="text-xs font-medium truncate text-slate-700">{file.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-xl font-semibold mb-1">Votre identité</h2>
                <p className="text-sm ">Vous pouvez rester anonyme. Votre choix n'affecte pas le traitement du dossier.</p>
              </div>

              <button
                type="button"
                onClick={handleAnonymousToggle}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 mb-6 transition-all duration-200 ${
                  isAnonymous ? "border-emerald-400" : "bg-white"
                }`}
              >
                <div className="text-black flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg`}>
                    {isAnonymous ? "◎" : "○"}
                  </div>
                  <div className="text-left text-black">
                    <p className="font-medium text-sm">Signalement anonyme</p>
                    <p className="text-xs mt-0.5 text-slate-400">Votre identité ne sera pas divulguée</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${isAnonymous ? "bg-emerald-400" : "bg-slate-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isAnonymous ? "translate-x-6" : "translate-x-1"}`} />
                </div>
              </button>

              {!isAnonymous && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom complet *</label>
                    <input
                      id="nom"
                      type="text"
                      placeholder="Prénom Nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="bg-white w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Adresse e-mail (facultatif)</label>
                    <input
                      id="contact"
                      type="email"
                      placeholder="vous@entreprise.com"
                      value={formData.contact}
                      onChange={handleChange}
                      className="bg-white w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                  </div>
                </div>
              )}

              {isAnonymous && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex gap-3">
                  <span className="text-amber-500 text-lg mt-0.5">ℹ</span>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    En mode anonyme, vous ne pourrez pas être recontacté.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit}>
              <div className="p-8">
                <div className="mb-7">
                  <h2 className="text-xl font-semibold mb-1">Sécurisation du dossier</h2>
                  <p className="text-sm text-slate-400">Définissez un mot de passe pour accéder au suivi.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Récapitulatif</p>
                  {[
                    { label: "Titre", value: formData.titre },
                    { label: "Catégorie", value: formData.categorie },
                    { label: "Fichiers", value: `${selectedFiles.length} fichier(s)` },
                    { label: "Identité", value: isAnonymous ? "Anonyme" : formData.nom },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-medium text-slate-800 max-w-xs truncate">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium mb-2">Mot de passe de suivi *</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 caractères"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-white w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                  />
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        formData.password.length >= i * 3 ? (formData.password.length >= 10 ? "bg-emerald-500" : "bg-amber-400") : "bg-slate-200"
                      }`} />
                    ))}
                  </div>
                  <div className="flex items-center text-xs">
                    <Checkbox/>
                    <p className="text-gray-400 mt-2">
                      En soumettant ce message, vous acceptez que les informations fournies soient utilisées pour traiter votre signalement conformément à notre politique de confidentialité.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8 ">
                <button
                  type="submit"
                  disabled={!canProceedStep4 || isLoading}
                  className="bg-emerald-500 text-white w-full py-4 rounded-xl text-sm font-semibold hover:bg-emerald-600 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Envoi en cours..." : "Soumettre le signalement"}
                </button>
              </div>
            </form>
          )}

          {step < 4 && (
            <div className="px-8 pb-8 flex items-center justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 disabled:opacity-0"
              >
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 disabled:opacity-40"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}