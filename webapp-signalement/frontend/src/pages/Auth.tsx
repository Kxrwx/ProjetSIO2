import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Imports regroupés
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/Auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = { email, password };
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/admin");
      } else {
        alert(result.error || result.message || "Identifiants incorrects")
      }
    } catch (error) {
      console.error("Erreur connexion:", error);
      alert("Impossible de contacter le serveur.");
    }
  }; 

  return (
    <div className="container-auth">
      <div className="container-btn-back">
        <Link to="/">
          <button className="btn-back">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour
          </button>
        </Link>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1>Espace Administration</h1>
          <p>Veuillez vous identifier pour accéder à la gestion des signalements.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email professionnel</label>
            <input
              id="email"
              type="email"
              placeholder="admin@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}