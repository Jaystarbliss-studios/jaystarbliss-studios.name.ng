import jaystarblissLogo from '../../assets/favicon.png';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import SearchModal from '../ui/SearchModal';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Resources', path: '/resources' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between">
            
            <Link to="/" className="flex items-center gap-3 z-50">
              <div className="w-10 h-10 bg-brand-slate rounded-lg flex items-center justify-center overflow-hidden">
                <img src={jaystarblissLogo} alt="Jaystarbliss Logo" className="w-full h-full object-cover" />
              </div>
              <span className={`font-bold text-lg tracking-tight ${isScrolled || mobileMenuOpen ? 'text-brand-slate dark:text-white' : 'text-white'}`}>
                JAYSTARBLISS DYNAMIC HUB
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm font-semibold hover:text-brand-red transition-colors ${location.pathname === link.path ? 'text-brand-red' : isScrolled ? 'text-brand-slate/80 dark:text-white/80' : 'text-white/80'}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <button 
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${isScrolled ? 'text-brand-slate dark:text-white' : 'text-white'}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-white dark:text-white" style={{ color: isScrolled ? 'inherit' : 'white' }}>
                {theme === 'dark' ? <Sun size={20} className={isScrolled ? "text-brand-slate dark:text-white" : "text-white"} /> : <Moon size={20} className={isScrolled ? "text-brand-slate" : "text-white"} />}
              </button>
              <Link to="/contact" className={`text-sm font-semibold hover:text-brand-red transition-colors ${isScrolled ? 'text-brand-slate dark:text-white' : 'text-white/80'}`}>
                Contact
              </Link>
              <Link to="/portal" className="relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none hover:-translate-y-0.5 transition-transform shadow-md shadow-brand-red/20 group">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#B91C1C_0%,#F8FAFC_50%,#B91C1C_100%)]" />
                <span className="inline-flex h-full w-full items-center justify-center rounded-lg bg-brand-slate dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-3xl transition-colors group-hover:bg-brand-red/90">
                  LOGIN / SIGNUP
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden relative z-50">
              <button 
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${isScrolled || mobileMenuOpen ? 'text-brand-slate dark:text-white' : 'text-white'}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button 
                className={`p-2 ${isScrolled || mobileMenuOpen ? 'text-brand-slate dark:text-white' : 'text-white'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`fixed inset-0 bg-white dark:bg-slate-900 z-40 lg:hidden transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full pt-24 px-6 pb-12 overflow-y-auto">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-bold flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4 ${
                    location.pathname === link.path ? 'text-brand-red' : 'text-brand-slate dark:text-white'
                  }`}
                >
                  {link.name}
                  <ChevronRight size={20} className="text-gray-400" />
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4 text-brand-slate dark:text-white"
              >
                Contact
                <ChevronRight size={20} className="text-gray-400" />
              </Link>
            </nav>
            
            <div className="mt-auto pt-8 flex flex-col gap-4">
              <div className="flex justify-between items-center px-2 mb-4">
                <span className="font-medium text-gray-500">Theme</span>
                <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-brand-slate dark:text-white">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <Link
                to="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-brand-slate text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2"
              >
                LOGIN / SIGNUP
              </Link>
            </div>
          </div>
        </div>
      </header>

      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;
