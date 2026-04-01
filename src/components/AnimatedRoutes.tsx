import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import PageTransition from "./PageTransition";
import { Loader2 } from "lucide-react";

// Eager load critical route
import Index from "@/pages/Index";

// Lazy load all other routes
const Register = lazy(() => import("@/pages/Register"));
const AdmitCard = lazy(() => import("@/pages/AdmitCard"));
const Result = lazy(() => import("@/pages/Result"));
const ResultDetail = lazy(() => import("@/pages/ResultDetail"));
const Admin = lazy(() => import("@/pages/Admin"));
const Team = lazy(() => import("@/pages/Team"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const ExamDetails = lazy(() => import("@/pages/ExamDetails"));
const Downloads = lazy(() => import("@/pages/Downloads"));
const Winners = lazy(() => import("@/pages/Winners"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Forbidden = lazy(() => import("@/pages/Forbidden"));
const ServerError = lazy(() => import("@/pages/ServerError"));
const ServiceUnavailable = lazy(() => import("@/pages/ServiceUnavailable"));

const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="animate-spin text-primary" size={32} />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LazyFallback />}>
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
          <Route path="/winners" element={<PageTransition><Winners /></PageTransition>} />
          <Route path="/forbidden" element={<PageTransition><Forbidden /></PageTransition>} />
          <Route path="/server-error" element={<PageTransition><ServerError /></PageTransition>} />
          <Route path="/service-unavailable" element={<PageTransition><ServiceUnavailable /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
