import { apiUrl } from "../config/api";

export default function ButtonLogout() {
    const handleLogout = async () => {
  try {
    await fetch(apiUrl("/api/auth/logout"), {
      method: "POST",
      credentials: "include", 
    });
  } finally {
    window.location.href = "/auth";
  }
};

return (
    <button onClick={handleLogout} className="bg-white text-black px-4 py-2 border-2 border-black rounded hover:shadow-lg hover:shadow-blue-300">
     Déconnexion
    </button>
)
}