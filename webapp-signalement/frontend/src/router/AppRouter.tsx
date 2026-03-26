import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Tracking from "../pages/Tracking";
import Report from "../pages/Report";
import Auth from "../pages/Auth";
import Admin from "../pages/Admin";
import ProtectedRoute from "./ProtectedRoute"; 
import InfoAdminAcc from "../pages/InfoAdmin/InfoAdminAcc";
import DetailsSigna from "../pages/Ticket/DetailsSigna";
import Messages from "../pages/Message/Messages";
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/" element={<Main />} />
        <Route path="/report" element={<Report />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/auth" element={<Auth />} />

        {/* --- Routes Protégées --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/infoadminaccount" element={<InfoAdminAcc />} />
          <Route path="/admin/signalement/detail/:id" element={<DetailsSigna />} />
          <Route path="/admin/signalement/detail/messages/:id" element={<Messages />} /> {/* Nouvelle route pour les messages */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};