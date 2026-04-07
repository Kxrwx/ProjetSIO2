import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/Loader";
import { apiUrl } from "../config/api";

export default function ProtectedRoute() {
    const [status, setStatus] = useState<"loading" | "auth" | "no-auth">("loading");

    useEffect(() => {
        fetch(apiUrl("/api/admin"), { credentials: "include" })
            .then((res) => {
                if (res.ok) setStatus("auth");
                else setStatus("no-auth");
            })
            .catch(() => setStatus("no-auth"));
    }, []);

    if (status === "loading") {
        return  <div className="flex h-screen w-full flex-col items-center justify-center bg-white gap-4">
                {/* Loader */}
                <Loader />
                <div className="flex flex-col items-center gap-1">
                    <div className="text-xl font-semibold text-gray-800">
                    Vérification de la session...
                    </div>
                </div>
                </div>
    }

    return status === "auth" ? <Outlet /> : <Navigate to="/Auth" replace />;
}