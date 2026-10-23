import { Link } from 'react-router-dom';
import { Scale, Phone, Mail, MapPin, Shield, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-12 border-t border-navy-dark/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Lex<span className="text-primary-light">Advocate</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              India's premier digital legal consultation & case tracking platform connecting verified advocates with clients for accessible, transparent, and prompt legal recourse.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <Shield className="w-4 h-4 text-primary" />
                <span>Verified Advocates</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Practice Areas
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/advocates?practiceArea=Criminal Law" className="hover:text-white transition-colors">
                  Criminal Defense
                </Link>
              </li>
              <li>
                <Link to="/advocates?practiceArea=Family Law" className="hover:text-white transition-colors">
                  Family & Matrimonial
                </Link>
              </li>
              <li>
                <Link to="/advocates?practiceArea=Property Law" className="hover:text-white transition-colors">
                  Property & Real Estate
                </Link>
              </li>
              <li>
                <Link to="/advocates?practiceArea=Corporate Law" className="hover:text-white transition-colors">
                  Corporate & Commercial
                </Link>
              </li>
              <li>
                <Link to="/advocates?practiceArea=Consumer Law" className="hover:text-white transition-colors">
                  Consumer Disputes
                </Link>
              </li>
              <li>
                <Link to="/advocates?practiceArea=Civil Law" className="hover:text-white transition-colors">
                  Civil Litigation
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/advocates" className="hover:text-white transition-colors">
                  Advocate Directory
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About LexAdvocate
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/register?role=advocate" className="hover:text-white transition-colors">
                  Join as an Advocate
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Headquarters
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Bar Council Marg, High Court Enclave, New Delhi 110001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+91 (011) 4987-0000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@lexadvocate.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} LexAdvocate Technologies India Pvt. Ltd. All rights reserved.
          </p>
          <p className="max-w-xl text-center md:text-right">
            Disclaimer: LexAdvocate is a communication & practice management technology platform. It does not provide legal advice or solicit legal representation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
