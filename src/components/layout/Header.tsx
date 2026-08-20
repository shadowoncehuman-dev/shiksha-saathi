import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Languages } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { useLang } from "@/lib/i18n";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const { lang, setLang, tr } = useLang();
  const isHome = location.pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const navItems = [
    { label: tr.nav.home, path: "/" },
    { label: tr.nav.examDetails, path: "/exam-details" },
    { label: tr.nav.register, path: "/register" },
    { label: tr.nav.result, path: "/result" },
    { label: tr.nav.team, path: "/team" },
    { label: tr.nav.gallery, path: "/gallery" },
    { label: "Winners", path: "/winners" },
    { label: tr.nav.documents, path: "/downloads" },
  ];

  return (
    <>

      <motion.header
        className={`fixed top-6 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500`}
      >
        <div 
          className={`
            w-full max-w-[860px] px-6 py-2 rounded-full border transition-all duration-300
            ${scrolled || !isHome
              ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-lg" 
              : "bg-white/40 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-white/5"}
          `}
        >
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <motion.img
                src={logo}
                alt="Logo"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-contain bg-white/95 p-0.5 border border-white/20"
                whileHover={{ scale: 1.1 }}
              />
              <span className="font-serif text-base font-bold text-[#1A2E1F] dark:text-[#E8EDE3] tracking-tight">
                BBDBASS <em className="italic text-[#6B4EFF] not-italic"> Samiti</em>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      px-3 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200
                      ${isActive
                        ? "text-[#1A2E1F] dark:text-[#E8EDE3] bg-white/50 dark:bg-white/10"
                        : "text-[#7A8C7C] hover:text-[#1A2E1F] dark:hover:text-[#E8EDE3] hover:bg-white/30 dark:hover:bg-white/5"}
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-[#7A8C7C] hover:text-[#6B4EFF] transition-all"
              >
                <Languages size={18} />
              </button>

              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center text-[#1A2E1F] dark:text-[#E8EDE3]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-20 left-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-2xl lg:hidden"
              >
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`text-lg font-serif ${location.pathname === item.path ? "text-[#6B4EFF]" : "text-[#1A2E1F] dark:text-[#E8EDE3]"}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
