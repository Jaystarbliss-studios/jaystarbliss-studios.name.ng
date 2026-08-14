import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-slate text-white pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-black text-brand-red tracking-tighter">
              JAYSTARBLISS
            </Link>
            <p className="text-white/60 font-medium leading-relaxed">
              We teach practical skills, build digital tools, and design creative solutions. Everything we do is focused on helping people learn, build and grow.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 font-medium text-white/60">
              <li><Link to="/about" className="hover:text-brand-red transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-brand-red transition-colors">Our Programs</Link></li>
              <li><Link to="/services" className="hover:text-brand-red transition-colors">Our Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-brand-red transition-colors">Portfolio</Link></li>
              <li><Link to="/faq" className="hover:text-brand-red transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Work With Us</h4>
            <ul className="space-y-3 font-medium text-white/60">
              <li><Link to="/project-request" className="hover:text-brand-red transition-colors">Start a Project</Link></li>
              <li><Link to="/school-partnership" className="hover:text-brand-red transition-colors">School Partnerships</Link></li>
              <li><Link to="/register" className="hover:text-brand-red transition-colors">Become a Tutor</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors">General Inquiry</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 font-medium text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-red shrink-0 mt-1" size={18} />
                <span>123 Innovation Drive,<br />Tech District, Lagos</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-red shrink-0" size={18} />
                <a href="tel:+2348000000000" className="hover:text-white transition-colors">+234 800 000 0000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-red shrink-0" size={18} />
                <a href="mailto:hello@jaystarbliss.com" className="hover:text-white transition-colors">hello@jaystarbliss.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-white/40">
          <p>&copy; {new Date().getFullYear()} Jaystarbliss Studios. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
