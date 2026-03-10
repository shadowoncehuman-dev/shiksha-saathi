import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import Index from "@/pages/Index";
import Register from "@/pages/Register";
import AdmitCard from "@/pages/AdmitCard";
import Result from "@/pages/Result";
import ResultDetail from "@/pages/ResultDetail";
import Admin from "@/pages/Admin";
import Team from "@/pages/Team";
import Gallery from "@/pages/Gallery";
import ExamDetails from "@/pages/ExamDetails";
import Downloads from "@/pages/Downloads";
import Winners from "@/pages/Winners";
import NotFound from "@/pages/NotFound";
import Forbidden from "@/pages/Forbidden";
import ServerError from "@/pages/ServerError";
import ServiceUnavailable from "@/pages/ServiceUnavailable";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/admit-card" element={<PageTransition><AdmitCard /></PageTransition>} />
        <Route path="/result" element={<PageTransition><Result /></PageTransition>} />
        <Route path="/result-detail" element={<PageTransition><ResultDetail /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/exam-details" element={<PageTransition><ExamDetails /></PageTransition>} />
        <Route path="/downloads" element={<PageTransition><Downloads /></PageTransition>} />
        <Route path="/forbidden" element={<PageTransition><Forbidden /></PageTransition>} />
        <Route path="/server-error" element={<PageTransition><ServerError /></PageTransition>} />
        <Route path="/service-unavailable" element={<PageTransition><ServiceUnavailable /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
