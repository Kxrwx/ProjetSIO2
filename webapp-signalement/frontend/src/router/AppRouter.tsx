import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Tracking from "../pages/Tracking";
import Report from "../pages/Report";
import Auth from "../pages/Auth";
import Admin from "../pages/Admin";
import ProtectedRoute from "./ProtectedRoute"; 
import InfoAdminAcc from "../pages/InfoAdmin/InfoAdminAcc";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Routes Publiques --- */}
        <Route path="/" element={<Main />} />
        <Route path="/Report" element={<Report />} />
        <Route path="/Tracking" element={<Tracking />} />
        <Route path="/Auth" element={<Auth />} />

        {/* --- Routes Protégées --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Admin" element={<Admin />} />
          <Route path="/infoadminaccount" element={<InfoAdminAcc />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};