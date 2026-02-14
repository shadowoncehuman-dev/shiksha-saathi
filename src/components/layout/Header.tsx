import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ORG_NAME } from "@/lib/constants";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Exam Details", path: "/exam-details" },
  { label: "Register", path: "/register" },
  { label: "Result", path: "/result" },
  { label: "Team", path: "/team" },
  { label: "Gallery", path: "/gallery" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 hero-gradient text-primary-foreground shadow-xl backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img src={logo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-contain bg-white shadow-lg group-hover:scale-110 transition-transform" />
            <div className="hidden sm:block">
              <h1 className="font-playfair text-sm md:text-base font-semibold leading-tight max-w-xs lg:max-w-md">
                {ORG_NAME}
              </h1>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-primary-foreground/15 text-secondary"
                    : "hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-primary-foreground"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-secondary rounded-full"
                    layoutId="activeNav"
                  />
                )}
              </Link>
            ))}
          </nav>

          <button
            className="lg:hidden p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-4 border-t border-primary-foreground/10"
            >
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
                    className={`block px-4 py-3 text-sm font-medium transition-all rounded-lg my-0.5 ${
                      location.pathname === item.path
                        ? "bg-primary-foreground/15 text-secondary"
                        : "hover:bg-primary-foreground/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
