import jaystarblissLogo from '../../assets/favicon.png';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown,
  Sun, 
  Moon, 
  Search,
  GraduationCap,
  Laptop,
  Palette,
  School,
  Gamepad2,
  Briefcase,
  Sparkles,
  Newspaper,
  BookOpen,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import SearchModal from '../ui/SearchModal';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    programs: false,
    portfolio: false,
    resources: false
  });
  
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  useKeyboardShortcut("/", () => setSearchOpen(true));
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileSubmenu = (key: string) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-3.5' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 z-50 group">
              <div className="w-10 h-10 bg-brand-slate rounded-xl flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                <img src={jaystarblissLogo} alt="Jaystarbliss Logo" className="w-full h-full object-cover" />
              </div>
              <span className={`font-extrabold text-base md:text-lg tracking-tight transition-colors ${
                isScrolled || mobileMenuOpen ? 'text-brand-slate dark:text-white' : 'text-white'
              }`}>
                JAYSTARBLISS DYNAMIC HUB
              </span>
            </Link>

            {/* Desktop Navigation with Dropdowns */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              
              {/* Home */}
              <Link 
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  location.pathname === '/' 
                    ? 'text-brand-red font-black' 
                    : isScrolled ? 'text-slate-700 dark:text-slate-200 hover:text-brand-red' : 'text-white/90 hover:text-white'
                }`}
              >
                Home
              </Link>

              {/* Programs with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('programs')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/programs"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                    location.pathname.startsWith('/programs') 
                      ? 'text-brand-red font-black' 
                      : isScrolled ? 'text-slate-700 dark:text-slate-200 hover:text-brand-red' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Programs</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'programs' ? 'rotate-180 text-brand-red' : 'opacity-70'}`} />
                </Link>

                {/* Programs Dropdown Menu */}
                {activeDropdown === 'programs' && (
                  <div 
                    className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Explore Learning Tracks
                      </div>
                      
                      <Link 
                        to="/programs#academics" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-red">Academics & Tutoring</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Core foundational sciences, math & WAEC/JAMB</div>
                        </div>
                      </Link>

                      <Link 
                        to="/programs#digital_and_technology" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                          <Laptop size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-red">Tech, Coding & AI</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Scratch, Python, Web Dev & Artificial Intelligence</div>
                        </div>
                      </Link>

                      <Link 
                        to="/programs#creative" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 shrink-0 group-hover:scale-110 transition-transform">
                          <Palette size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-red">Creative Arts & Design</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Graphic design, branding & digital illustrations</div>
                        </div>
                      </Link>

                      <Link 
                        to="/programs#school_programs" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                          <School size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-red">School STEM Clubs</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Custom coding and robotics labs for partner schools</div>
                        </div>
                      </Link>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Link 
                          to="/programs" 
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-brand-red hover:bg-brand-red/10 transition-colors"
                        >
                          <span>View Full Program Catalog</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Services */}
              <Link 
                to="/services"
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  location.pathname.startsWith('/services') 
                    ? 'text-brand-red font-black' 
                    : isScrolled ? 'text-slate-700 dark:text-slate-200 hover:text-brand-red' : 'text-white/90 hover:text-white'
                }`}
              >
                Services
              </Link>

              {/* Portfolio with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('portfolio')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/portfolio"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                    location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/magic-particles')
                      ? 'text-brand-red font-black' 
                      : isScrolled ? 'text-slate-700 dark:text-slate-200 hover:text-brand-red' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Portfolio</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'portfolio' ? 'rotate-180 text-brand-red' : 'opacity-70'}`} />
                </Link>

                {/* Portfolio Dropdown Menu */}
                {activeDropdown === 'portfolio' && (
                  <div 
                    className="absolute top-full left-0 w-84 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Showcase & Playgrounds
                      </div>
                      
                      <Link 
                        to="/portfolio" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                          <Gamepad2 size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-red">Kids Corner & Arcade</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Interactive games built by young student coders</div>
                        </div>
                      </Link>

                      <Link 
                        to="/portfolio" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-red">Organisation Solutions</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Enterprise platforms, LMS, and institutional tools</div>
                        </div>
                      </Link>

                      <Link 
                        to="/magic-particles" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                          <Sparkles size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500">Magic 3D Particles Lab</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Real-time Three.js gesture & particle simulation</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to="/resources"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                    location.pathname.startsWith('/resources') || location.pathname.startsWith('/blog') || location.pathname.startsWith('/faq')
                      ? 'text-brand-red font-black' 
                      : isScrolled ? 'text-slate-700 dark:text-slate-200 hover:text-brand-red' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <span>Resources</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-brand-red' : 'opacity-70'}`} />
                </Link>

                {/* Resources Dropdown Menu */}
                {activeDropdown === 'resources' && (
                  <div 
                    className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Insights & Knowledge
                      </div>
                      
                      <Link 
                        to="/blog" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                          <Newspaper size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500">News Corner & Bulletins</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Live announcements, events, and awards</div>
                        </div>
                      </Link>

                      <Link 
                        to="/blog" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-brand-red/10 text-brand-red shrink-0 group-hover:scale-110 transition-transform">
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-red">Blog & Coding Guides</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">In-depth technical tutorials & education articles</div>
                        </div>
                      </Link>

                      <Link 
                        to="/faq" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                          <HelpCircle size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-red">FAQ & Help Center</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Common questions about admissions and services</div>
                        </div>
                      </Link>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Link 
                          to="/resources" 
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-brand-red hover:bg-brand-red/10 transition-colors"
                        >
                          <span>Explore All Resources</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About */}
              <Link 
                to="/about"
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  location.pathname === '/about' 
                    ? 'text-brand-red font-black' 
                    : isScrolled ? 'text-slate-700 dark:text-slate-200 hover:text-brand-red' : 'text-white/90 hover:text-white'
                }`}
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button 
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${isScrolled ? 'text-brand-slate dark:text-white' : 'text-white'}`}
                aria-label="Search"
              >
                <Search size={19} />
              </button>
              
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors" 
                style={{ color: isScrolled ? 'inherit' : 'white' }}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={19} className={isScrolled ? "text-brand-slate dark:text-white" : "text-white"} /> : <Moon size={19} className={isScrolled ? "text-brand-slate" : "text-white"} />}
              </button>

              <Link to="/contact" className={`text-sm font-bold hover:text-brand-red transition-colors ${isScrolled ? 'text-brand-slate dark:text-white' : 'text-white/90'}`}>
                Contact
              </Link>

              <Link to="/portal" className="relative inline-flex overflow-hidden rounded-xl p-[1px] focus:outline-none hover:-translate-y-0.5 transition-transform shadow-md shadow-brand-red/20 group">
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#B91C1C_0%,#F8FAFC_50%,#B91C1C_100%)]" />
                <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-brand-slate dark:bg-slate-900 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white backdrop-blur-3xl transition-colors group-hover:bg-brand-red/90">
                  LOGIN / SIGNUP
                </span>
              </Link>
            </div>

            {/* Mobile Navigation Trigger */}
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
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen Drawer with Collapsible Submenus */}
        <div className={`fixed inset-0 bg-white dark:bg-slate-900 z-40 lg:hidden transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full pt-20 px-6 pb-10 overflow-y-auto">
            
            <nav className="flex flex-col gap-3">
              {/* Home */}
              <Link 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xl font-bold py-3 border-b border-gray-100 dark:border-slate-800 ${
                  location.pathname === '/' ? 'text-brand-red' : 'text-brand-slate dark:text-white'
                }`}
              >
                Home
              </Link>

              {/* Programs (Accordion) */}
              <div className="border-b border-gray-100 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => toggleMobileSubmenu('programs')}
                  className="w-full py-3 flex items-center justify-between text-xl font-bold text-brand-slate dark:text-white"
                >
                  <span>Programs</span>
                  <ChevronDown size={18} className={`transition-transform ${mobileExpanded.programs ? 'rotate-180 text-brand-red' : 'text-gray-400'}`} />
                </button>
                {mobileExpanded.programs && (
                  <div className="pl-4 pr-2 pb-3 space-y-2.5">
                    <Link to="/programs" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-brand-red">
                      <ArrowRight size={14} /> All Programs Catalog
                    </Link>
                    <Link to="/programs#academics" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <GraduationCap size={15} /> Academics & Tutoring
                    </Link>
                    <Link to="/programs#digital_and_technology" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Laptop size={15} /> Coding, Tech & AI
                    </Link>
                    <Link to="/programs#creative" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Palette size={15} /> Creative Arts & Design
                    </Link>
                    <Link to="/programs#school_programs" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <School size={15} /> School STEM Clubs
                    </Link>
                  </div>
                )}
              </div>

              {/* Services */}
              <Link 
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xl font-bold py-3 border-b border-gray-100 dark:border-slate-800 ${
                  location.pathname === '/services' ? 'text-brand-red' : 'text-brand-slate dark:text-white'
                }`}
              >
                Services
              </Link>

              {/* Portfolio (Accordion) */}
              <div className="border-b border-gray-100 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => toggleMobileSubmenu('portfolio')}
                  className="w-full py-3 flex items-center justify-between text-xl font-bold text-brand-slate dark:text-white"
                >
                  <span>Portfolio</span>
                  <ChevronDown size={18} className={`transition-transform ${mobileExpanded.portfolio ? 'rotate-180 text-brand-red' : 'text-gray-400'}`} />
                </button>
                {mobileExpanded.portfolio && (
                  <div className="pl-4 pr-2 pb-3 space-y-2.5">
                    <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Gamepad2 size={15} className="text-amber-500" /> Kids Corner & Arcade Games
                    </Link>
                    <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Briefcase size={15} className="text-blue-500" /> Organisation Case Studies
                    </Link>
                    <Link to="/magic-particles" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Sparkles size={15} className="text-cyan-500" /> Magic 3D Particles Playground
                    </Link>
                  </div>
                )}
              </div>

              {/* Resources (Accordion) */}
              <div className="border-b border-gray-100 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => toggleMobileSubmenu('resources')}
                  className="w-full py-3 flex items-center justify-between text-xl font-bold text-brand-slate dark:text-white"
                >
                  <span>Resources</span>
                  <ChevronDown size={18} className={`transition-transform ${mobileExpanded.resources ? 'rotate-180 text-brand-red' : 'text-gray-400'}`} />
                </button>
                {mobileExpanded.resources && (
                  <div className="pl-4 pr-2 pb-3 space-y-2.5">
                    <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Newspaper size={15} className="text-cyan-500" /> News Corner Bulletins
                    </Link>
                    <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <BookOpen size={15} className="text-brand-red" /> Tech Blog & Tutorials
                    </Link>
                    <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <HelpCircle size={15} className="text-purple-500" /> FAQ & Help Center
                    </Link>
                  </div>
                )}
              </div>

              {/* About & Contact */}
              <Link 
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold py-3 border-b border-gray-100 dark:border-slate-800 text-brand-slate dark:text-white"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold py-3 border-b border-gray-100 dark:border-slate-800 text-brand-slate dark:text-white"
              >
                Contact
              </Link>
            </nav>
            
            <div className="mt-auto pt-6 flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <span className="font-semibold text-sm text-gray-500">Theme</span>
                <button onClick={toggleTheme} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-full text-brand-slate dark:text-white">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              <Link
                to="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-brand-slate dark:bg-brand-red text-white py-3.5 rounded-xl font-black text-center flex items-center justify-center gap-2 uppercase tracking-wider text-sm shadow-md"
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
