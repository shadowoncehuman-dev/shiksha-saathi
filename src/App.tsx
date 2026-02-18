import { LangProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import AdmitCard from "./pages/AdmitCard";
import Result from "./pages/Result";
import ResultDetail from "./pages/ResultDetail";
import Admin from "./pages/Admin";
import Team from "./pages/Team";
import Gallery from "./pages/Gallery";
import ExamDetails from "./pages/ExamDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LangProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admit-card" element={<AdmitCard />} />
            <Route path="/result" element={<Result />} />
            <Route path="/result-detail" element={<ResultDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/team" element={<Team />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/exam-details" element={<ExamDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LangProvider>
  </QueryClientProvider>
);

export default App;
