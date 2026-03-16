import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const [status, setStatus] = useState<"loading" | "auth" | "no-auth">("loading");

    useEffect(() => {
        fetch("http://localhost:5000/api/admin", { credentials: "include" })
            .then((res) => {
                if (res.ok) setStatus("auth");
                else setStatus("no-auth");
            })
            .catch(() => setStatus("no-auth"));
    }, []);

    if (status === "loading") {
        return <div className="loading-screen">Vérification de la session...</div>;
    }

    return status === "auth" ? <Outlet /> : <Navigate to="/Auth" replace />;
}