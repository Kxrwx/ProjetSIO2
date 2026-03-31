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
import OpenedTickets from "../pages/Ticket/OpenedTickets";
import ArchivedTickets from "../pages/Ticket/ArchivedTickets";
import NewTickets from "../pages/Ticket/NewTickets";

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
          <Route path="/admin/signalement/encours" element={<OpenedTickets />} />
          <Route path="/admin/signalement/archives" element={<ArchivedTickets />} />
          <Route path="/admin/signalement/nouveaux" element={<NewTickets />} />
          <Route path="/admin/signalement/detail/:id" element={<DetailsSigna />} />
          <Route path="/admin/signalement/detail/:id/messages" element={<Messages />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
};