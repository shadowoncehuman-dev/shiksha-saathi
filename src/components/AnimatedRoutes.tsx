import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import PageTransition from "./PageTransition";
import { Loader2 } from "lucide-react";

// Eager load critical route
import Index from "@/pages/Index";

// Lazy loader with retry + one-time reload for stale chunks after redeploys
const CHUNK_RELOAD_KEY = "chunk_reload_at";

const lazyWithRetry = (factory: () => Promise<{ default: React.ComponentType<unknown> }>) =>
  lazy(async () => {
    try {
      const mod = await factory();
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      return mod;
    } catch {
      // Retry once (transient network / chunk fetch failure)
      try {
        const mod = await factory();
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
        return mod;
      } catch {
        // Stale build: hard reload once (max once per 10s) to pick up new chunks
        const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
        if (Date.now() - last > 10000) {
          sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
          window.location.reload();
          // Keep Suspense pending while the page reloads
          await new Promise(() => {});
        }
        throw new Error("Failed to load page module");
      }
    }
  });


// Lazy load all other routes
const Register = lazyWithRetry(() => import("@/pages/Register"));
const AdmitCard = lazyWithRetry(() => import("@/pages/AdmitCard"));
const Result = lazyWithRetry(() => import("@/pages/Result"));
const ResultDetail = lazyWithRetry(() => import("@/pages/ResultDetail"));
const Admin = lazyWithRetry(() => import("@/pages/Admin"));
const Team = lazyWithRetry(() => import("@/pages/Team"));
const Gallery = lazyWithRetry(() => import("@/pages/Gallery"));
const ExamDetails = lazyWithRetry(() => import("@/pages/ExamDetails"));
const Downloads = lazyWithRetry(() => import("@/pages/Downloads"));
const Winners = lazyWithRetry(() => import("@/pages/Winners"));
const Invigilator = lazyWithRetry(() => import("@/pages/Invigilator"));

const NotFound = lazyWithRetry(() => import("@/pages/NotFound"));
const Forbidden = lazyWithRetry(() => import("@/pages/Forbidden"));
const ServerError = lazyWithRetry(() => import("@/pages/ServerError"));
const ServiceUnavailable = lazyWithRetry(() => import("@/pages/ServiceUnavailable"));

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
          <Route path="/invigilator" element={<PageTransition><Invigilator /></PageTransition>} />
          <Route path="/admin2" element={<Navigate to="/admin" replace />} />
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
