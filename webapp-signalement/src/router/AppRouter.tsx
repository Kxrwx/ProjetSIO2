import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Tracking from "../pages/Tracking";
import Report from "../pages/Report";


export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Report" element={<Report/>} />
        <Route path="/Tracking" element={<Tracking/>} />
      </Routes>
    </BrowserRouter>
  );
};
