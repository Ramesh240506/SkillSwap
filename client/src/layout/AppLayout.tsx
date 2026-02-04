import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Header";
import Landing from "../pages/Landing";
import Auth from "../pages/Auth";
import Skills from "../pages/Skills";
import Dashboard from "../pages/Dashboard";
import { OfferSkills } from "../components/dashboard/OfferSkills";



const AppLayout = () => {
  const location = useLocation();
  const hideNavBar = location.pathname === "/";

  return (
    <>
      {!hideNavBar && <Header />}

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/offerskills" element={<OfferSkills open={true} onOpenChange={() => {}} />} />
      </Routes>
    </>
  );
};

export default AppLayout;
