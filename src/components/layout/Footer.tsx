import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { ORG_NAME, CONTACT } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { tr } = useLang();

  return (
    <footer className="hero-gradient text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Logo" className="w-11 h-11 rounded-full object-contain bg-white p-0.5 ring-2 ring-accent/20" />
              <h3 className="font-playfair text-lg font-bold text-white">BBDBASS</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">{tr.footer.tagline}</p>
            <p className="text-xs text-white/40">{tr.footer.vision}</p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold mb-5 text-secondary uppercase tracking-[0.2em]">{tr.footer.navigation}</h4>
            <ul className="space-y-3">
              {[
                { label: tr.footer.links.home, path: "/" },
                { label: tr.footer.links.examDetails, path: "/exam-details" },
                { label: tr.footer.links.register, path: "/register" },
                { label: tr.footer.links.results, path: "/result" },
                { label: tr.footer.links.team, path: "/team" },
                { label: tr.footer.links.gallery, path: "/gallery" },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/60 hover:text-secondary transition-colors duration-300 flex items-center gap-1.5 group text-sm">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold mb-5 text-secondary uppercase tracking-[0.2em]">{tr.footer.getInTouch}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-secondary/10 transition-colors">
                  <MapPin size={14} className="text-secondary" />
                </div>
                <span className="text-white/60 text-sm">{CONTACT.office}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <Phone size={14} className="text-secondary" />
                </div>
                <a href={`tel:${CONTACT.phone}`} className="text-white/60 hover:text-secondary transition-colors text-sm">{CONTACT.phone}</a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <Mail size={14} className="text-secondary" />
                </div>
                <a href={`mailto:${CONTACT.email}`} className="text-white/60 hover:text-secondary transition-colors break-all text-sm">{CONTACT.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Gold ornament divider */}
        <div className="mt-14 mb-6 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/20" />
          <div className="w-2 h-2 rounded-full bg-accent/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
          <div className="w-2 h-2 rounded-full bg-accent/30" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/20" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40">© 2027 {ORG_NAME}. {tr.footer.allRights}</p>
          <p className="text-xs text-white/40">{tr.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
