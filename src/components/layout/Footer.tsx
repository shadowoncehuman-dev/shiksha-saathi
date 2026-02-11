import { Phone, Mail, MapPin } from "lucide-react";
import { ORG_NAME, CONTACT } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-playfair text-lg font-semibold mb-4 text-secondary">
              {ORG_NAME}
            </h3>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Empowering Education Through Excellence. Organizing and facilitating student
              examinations with integrity and innovation.
            </p>
          </div>

          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-secondary">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="/register" className="hover:text-secondary transition-colors">Registration</a></li>
              <li><a href="/result" className="hover:text-secondary transition-colors">Results</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-secondary">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-secondary shrink-0" />
                {CONTACT.office}
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-secondary shrink-0" />
                {CONTACT.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-secondary shrink-0" />
                {CONTACT.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-center">
          <p className="text-sm text-primary-foreground/60">
            © 2026 {ORG_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
