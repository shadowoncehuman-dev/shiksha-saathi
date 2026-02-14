import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { ORG_NAME, CONTACT } from "@/lib/constants";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full object-contain bg-white" />
              <h3 className="font-playfair text-lg font-semibold text-primary-foreground">
                BBDBASS
              </h3>
            </div>
            <p className="text-sm text-primary-foreground/50 leading-relaxed max-w-sm">
              Empowering Education Through Excellence. Organizing and facilitating student
              examinations with integrity and innovation since our founding.
            </p>
          </div>

          <div>
            <h4 className="font-playfair text-sm font-semibold mb-4 text-secondary uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "Exam Details", path: "/exam-details" },
                { label: "Register", path: "/register" },
                { label: "Results", path: "/result" },
                { label: "Our Team", path: "/team" },
                { label: "Gallery", path: "/gallery" },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/50 hover:text-secondary transition-colors duration-300 flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-playfair text-sm font-semibold mb-4 text-secondary uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/50">{CONTACT.office}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-secondary shrink-0" />
                <a href={`tel:${CONTACT.phone}`} className="text-primary-foreground/50 hover:text-secondary transition-colors">{CONTACT.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-secondary shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="text-primary-foreground/50 hover:text-secondary transition-colors break-all">{CONTACT.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/30">
            © 2026 {ORG_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/30">
            Dedicated to Dr. B.R. Ambedkar's vision of education for all.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
