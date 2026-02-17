import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { ORG_NAME, CONTACT } from "@/lib/constants";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="hero-gradient text-white relative overflow-hidden">
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Logo" className="w-11 h-11 rounded-full object-contain bg-white p-0.5" />
              <h3 className="font-playfair text-lg font-bold text-white">
                BBDBASS
              </h3>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
              Empowering Education Through Excellence. Organizing and facilitating student
              examinations with integrity and innovation since our founding.
            </p>
            <p className="text-xs text-white/20">
              Dedicated to Dr. B.R. Ambedkar's vision of education for all.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold mb-5 text-secondary uppercase tracking-[0.2em]">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Exam Details", path: "/exam-details" },
                { label: "Register", path: "/register" },
                { label: "Results", path: "/result" },
                { label: "Our Team", path: "/team" },
                { label: "Gallery", path: "/gallery" },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/40 hover:text-secondary transition-colors duration-300 flex items-center gap-1.5 group text-sm">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold mb-5 text-secondary uppercase tracking-[0.2em]">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-secondary" />
                </div>
                <span className="text-white/40 text-sm">{CONTACT.office}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-secondary" />
                </div>
                <a href={`tel:${CONTACT.phone}`} className="text-white/40 hover:text-secondary transition-colors text-sm">{CONTACT.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-secondary" />
                </div>
                <a href={`mailto:${CONTACT.email}`} className="text-white/40 hover:text-secondary transition-colors break-all text-sm">{CONTACT.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/20">
            © 2026 {ORG_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with purpose. Powered by vision.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
