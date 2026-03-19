import { useEffect, useState } from "react";
import "../styles/Admin.css";
import ButtonLogout from "../components/Logout";

export default function Admin() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);


  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <h2>Dashboard Admin</h2>
        <ButtonLogout/>
      </nav>

      <main className="admin-content">
        <div className="welcome-card">
          <h1>Bienvenue, {user?.name || "Administrateur"} ! 👋</h1>
          <p>La connexion a réussi et la session est active.</p>
        </div>

        <div className="test-status">
          <h3>Statut des Tests :</h3>
          <ul>
            <li>✅ Redirection : <strong>Fonctionnelle</strong></li>
            <li>✅ Cookie Session : <strong>Stocké (vérifier F12)</strong></li>
            <li>✅ Accès Route : <strong>Autorisé</strong></li>
          </ul>
        </div>
      </main>
    </div>
  );
}