import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calendar, UserPlus, Trophy, Image as ImageIcon, FileText, Users } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import MagnificationDock from "@/components/premium/MagnificationDock";

const Layout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const dockItems = [
    { icon: <Home size={20} className="text-foreground" />, label: "Home", onClick: () => navigate("/") },
    { icon: <Calendar size={20} className="text-foreground" />, label: "Exam", onClick: () => navigate("/exam-details") },
    { icon: <UserPlus size={20} className="text-foreground" />, label: "Register", onClick: () => navigate("/register") },
    { icon: <Trophy size={20} className="text-foreground" />, label: "Result", onClick: () => navigate("/result") },
    { icon: <Users size={20} className="text-foreground" />, label: "Team", onClick: () => navigate("/team") },
    { icon: <ImageIcon size={20} className="text-foreground" />, label: "Gallery", onClick: () => navigate("/gallery") },
    { icon: <FileText size={20} className="text-foreground" />, label: "Docs", onClick: () => navigate("/downloads") },
  ];

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#6B4EFF]/20 selection:text-[#1A2E1F]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:block pointer-events-none">
        <div className="pointer-events-auto">
          <MagnificationDock items={dockItems} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
