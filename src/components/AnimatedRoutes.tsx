import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import PageTransition from "./PageTransition";
import RouteErrorBoundary from "./RouteErrorBoundary";
import { Loader2 } from "lucide-react";
import { logRuntimeError, isNewBuildAvailable, isChunkLoadError } from "@/lib/error-logger";

// Eager load critical route
import Index from "@/pages/Index";

// Lazy loader with retry + version check + one-time reload for stale chunks after redeploys
const CHUNK_RELOAD_KEY = "chunk_reload_at";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const lazyWithRetry = (factory: () => Promise<{ default: React.ComponentType<unknown> }>, name: string) =>
  lazy(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const mod = await factory();
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
        return mod;
      } catch (err) {
        lastError = err;
        logRuntimeError("chunk-load", err, { message: `[${name}] attempt ${attempt + 1} failed: ${(err as Error)?.message}` });
        if (!isChunkLoadError(err)) break; // real code error — don't loop
        await wait(300 * (attempt + 1));
      }
    }

    // Stale build: hard reload once (max once per 10s) to pick up new chunks
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
    const stale = await isNewBuildAvailable();
    if ((stale || isChunkLoadError(lastError)) && Date.now() - last > 10000) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
      const url = new URL(window.location.href);
      url.searchParams.set("v", String(Date.now()));
      window.location.replace(url.toString());
      // Keep Suspense pending while the page reloads
      await new Promise(() => {});
    }
    // Surface to RouteErrorBoundary (friendly retry UI)
    throw lastError instanceof Error ? lastError : new Error(`Failed to load page module: ${name}`);
  });


// Lazy load all other routes
const Register = lazyWithRetry(() => import("@/pages/Register"), "Register");
const AdmitCard = lazyWithRetry(() => import("@/pages/AdmitCard"), "AdmitCard");
const Result = lazyWithRetry(() => import("@/pages/Result"), "Result");
const ResultDetail = lazyWithRetry(() => import("@/pages/ResultDetail"), "ResultDetail");
const Admin = lazyWithRetry(() => import("@/pages/Admin"), "Admin");
const Team = lazyWithRetry(() => import("@/pages/Team"), "Team");
const Gallery = lazyWithRetry(() => import("@/pages/Gallery"), "Gallery");
const ExamDetails = lazyWithRetry(() => import("@/pages/ExamDetails"), "ExamDetails");
const Downloads = lazyWithRetry(() => import("@/pages/Downloads"), "Downloads");
const Winners = lazyWithRetry(() => import("@/pages/Winners"), "Winners");
const Invigilator = lazyWithRetry(() => import("@/pages/Invigilator"), "Invigilator");

const NotFound = lazyWithRetry(() => import("@/pages/NotFound"), "NotFound");
const Forbidden = lazyWithRetry(() => import("@/pages/Forbidden"), "Forbidden");
const ServerError = lazyWithRetry(() => import("@/pages/ServerError"), "ServerError");
const ServiceUnavailable = lazyWithRetry(() => import("@/pages/ServiceUnavailable"), "ServiceUnavailable");

const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="animate-spin text-primary" size={32} />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <RouteErrorBoundary resetKey={location.pathname}>
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
      </RouteErrorBoundary>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
