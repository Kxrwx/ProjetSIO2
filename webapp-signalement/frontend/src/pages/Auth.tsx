import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Imports regroupés
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/Auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="absolute px-4 py-2 top-4 left-4">
          <Link to="/">
              <button className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-2 border-black border-solid transition-colors">
                  <FontAwesomeIcon icon={faArrowLeft} /> Retour      
              </button>
          </Link>
      </div>   

      <div className="container">
        <div className="heading">Connexion à votre environnement</div>
        <form onSubmit={handleSubmit} className="form">
          <input required className="input" 
          type="email" 
          name="email" 
          id="email" 
          placeholder="admin@votreentreprise.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
          <div className="password-container">
            <input required className="input" 
            type={showPassword ? "text" : "password"}
            name="password" 
            id="password" 
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
            <button
            className="button-show-password"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Masquer" : "Voir"}
          </button>
          </div>
          <span className="forgot-password">
            <a>Contactez votre administrateur réseau si vous rencontrez des problèmes de connexion.</a>
          </span>

          <input className="login-button" 
          type="submit" 
          defaultValue="Connexion" />
        </form>
      </div>

    </div>
  );
}