export default function ButtonLogout() {
    const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include", 
    });
  } finally {
    window.location.href = "/auth";
  }
};

return (
    <button onClick={handleLogout} className="btn-logout">
     Déconnexion
    </button>
)
}