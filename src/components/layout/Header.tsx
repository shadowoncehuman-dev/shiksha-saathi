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
    { label: tr.nav.documents, path: "/downloads" },
  ];

  return (
    <>
      {/* Gold accent line */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-secondary via-accent to-secondary" />

      <motion.header
        className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? "bg-primary/95 backdrop-blur-xl shadow-lg shadow-primary/10 border-b border-white/[0.05]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <motion.img
                src={logo}
                alt="Logo"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-contain bg-white/95 p-0.5 shadow-lg ring-2 ring-accent/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <span className="hidden sm:block font-playfair text-sm font-bold text-white tracking-wide">
                BBDBASS
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-2 text-sm font-medium transition-all duration-300 nav-link-underline"
                  >
                    <span className={isActive ? "text-secondary" : "text-white/70 hover:text-white"}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-secondary to-accent rounded-full"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/[0.08] hover:border-accent/30"
                title="Toggle Language"
              >
                <Languages size={13} />
                <span>{lang === "en" ? "हिं" : "EN"}</span>
              </button>

              <button
                className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
                className="lg:hidden pb-4 overflow-hidden"
              >
                <div className="glass-morphism rounded-2xl p-2">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                          location.pathname === item.path
                            ? "bg-secondary/20 text-secondary"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
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
