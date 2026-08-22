import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, BookOpen, Settings, LogOut, LayoutDashboard, 
  Calendar, ExternalLink, Building2, CreditCard,
  User, Lock, Moon, Sun, ChevronDown, CheckCircle2,
  AlertCircle, Menu, X, ShieldCheck, Video
} from 'lucide-react';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { Tooltip } from '../ui/Tooltip';
import { JaystarblissIcon } from '../common/JaystarblissLogo';
import ChangePasswordModal from './ChangePasswordModal';
import SEO from '../ui/SEO';

const PortalLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const pathParts = location.pathname.split('/');
  const role = pathParts[2] || 'student'; // student | staff | parent | school

  const [displayName, setDisplayName] = useState('Cadet');
  const [userEmail, setUserEmail] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || '');
      setIsEmailVerified(user.emailVerified);
      setPhotoURL(user.photoURL);
      const storedName = sessionStorage.getItem('userName') || user.displayName || user.email?.split('@')[0] || 'Cadet';
      setDisplayName(storedName);
    } else {
      const storedName = sessionStorage.getItem('userName') || 'Portal User';
      setDisplayName(storedName);
    }
  }, [location.pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    sessionStorage.clear();
    navigate('/portal');
  };

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setResendingVerification(true);
    try {
      await sendEmailVerification(user);
      toast.success(`Verification link sent to ${user.email}! Please check your email.`);
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait a moment.');
      } else {
        toast.error('Failed to send email verification.');
      }
    } finally {
      setResendingVerification(false);
    }
  };

  const getNavLinks = () => {
    const base = [
      { name: 'Dashboard', path: `/portal/${role}`, icon: <LayoutDashboard size={18} />, desc: 'Portal Overview & Metrics' },
      { name: 'Resource Library', path: `/portal/${role}/resources`, icon: <BookOpen size={18} />, desc: 'PDFs, Lesson Notes & Syllabi' },
      { name: 'Calendar', path: `/portal/${role}/calendar`, icon: <Calendar size={18} />, desc: 'Schedules, Timetables & Labs' },
    ];

    if (role === 'student') {
      base.push({ name: 'Curriculum & Tracks', path: '/portal/student/courses', icon: <Book size={18} />, desc: '5-Stage Engineering Path' });
      base.push({ name: 'Tuition & Billing', path: '/portal/student/payments', icon: <CreditCard size={18} />, desc: 'Renew Term & Statements' });
    } else if (role === 'staff') {
      base.push({ name: 'Live Classes', path: '/portal/staff/classes', icon: <Video size={18} />, desc: 'Teaching Roster & Materials' });
    } else if (role === 'parent') {
      base.push({ name: 'Tuition & Billing', path: '/portal/parent/payments', icon: <CreditCard size={18} />, desc: 'Invoices & Fee Statements' });
    } else if (role === 'school') {
      base.push({ name: 'Students Roster', path: '/portal/school', icon: <Building2 size={18} />, desc: 'Cadet Records & Access Codes' });
      base.push({ name: 'Lab Partnership', path: '/portal/school/payments', icon: <CreditCard size={18} />, desc: 'Institutional Licensing & Fees' });
    }

    base.push({ name: 'Settings', path: `/portal/${role}/settings`, icon: <Settings size={18} />, desc: 'Account Preferences & Security' });
    return base;
  };

  const navLinks = getNavLinks();
  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  // Check if school student with access code (excluded from email banner)
  const isStudentAccessCodeOnly = !userEmail && sessionStorage.getItem('studentDocId');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      <SEO 
        title={`${roleTitle} Portal | Jaystarbliss Studios`} 
        description={`Jaystarbliss Studios ${roleTitle} portal access and learning dashboard.`} 
        noindex={true}
      />

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-brand-slate text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <JaystarblissIcon className="w-7 h-7" />
          <span className="font-bold text-base tracking-tight">STUDIOS</span>
          <span className="text-[10px] uppercase font-bold bg-brand-red px-2 py-0.5 rounded ml-1">{role}</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-slate text-white px-4 py-4 space-y-2 border-b border-white/10 z-30"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                  location.pathname === link.path ? 'bg-brand-red text-white' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <div className="pt-3 border-t border-white/10 flex gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 text-xs font-bold"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600/80 text-white text-xs font-bold"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-brand-slate text-white flex-col h-auto min-h-screen border-r border-white/10 sticky top-0 z-20 shrink-0">
        <div className="p-6">
          <Tooltip content="Return to Main Website" placement="bottom">
            <Link to="/" className="flex items-center gap-2.5 group">
              <JaystarblissIcon className="w-8 h-8 group-hover:scale-105 transition-transform" />
              <span className="font-bold text-lg tracking-tight flex items-center gap-1.5">
                STUDIOS
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
              </span>
            </Link>
          </Tooltip>
          <div className="mt-8 mb-2">
            <p className="text-xs text-white/50 uppercase tracking-widest font-semibold flex items-center justify-between">
              <span>{role} Portal</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 pb-4 overflow-y-auto space-y-1.5">
          {navLinks.map((link) => (
            <Tooltip key={link.name} content={link.desc} placement="right" delay={300}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs sm:text-sm ${
                  location.pathname === link.path ? 'bg-brand-red text-white font-bold shadow-sm' : 'text-white/60 hover:bg-white/10 hover:text-white font-medium'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </Tooltip>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 text-xs text-white/60">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-400" />
              <span>SSL Protected</span>
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          <button 
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-white/60 hover:text-brand-red rounded-xl hover:bg-white/5 transition-colors text-xs font-semibold"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-slate-950">
        
        {/* Unverified Email Warning Banner */}
        {!isEmailVerified && userEmail && !isStudentAccessCodeOnly && (
          <div className="bg-amber-500 text-slate-950 px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-slate-950" />
              <span>
                Please verify your email address (<strong>{userEmail}</strong>) to guarantee uninterrupted portal access.
              </span>
            </div>
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resendingVerification}
              className="underline hover:text-white cursor-pointer transition-colors self-start sm:self-auto font-black"
            >
              {resendingVerification ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>
        )}

        {/* Header with Profile Dropdown */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200/80 dark:border-slate-800 px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-10 transition-colors">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white capitalize">
            {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
          </h1>

          <div className="flex items-center gap-4 relative" ref={profileRef}>
            {/* Quick Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>

            {/* Profile Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 py-1.5 px-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{displayName}</p>
                <p className="text-[11px] text-gray-500 capitalize flex items-center justify-end gap-1">
                  <span>{role}</span>
                  {isEmailVerified && <CheckCircle2 size={11} className="text-green-500" />}
                </p>
              </div>

              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-brand-red/30 shadow-xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs shadow-xs uppercase">
                  {displayName.charAt(0)}
                </div>
              )}

              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl p-3 z-50 space-y-1 text-xs"
                >
                  <div className="px-3 py-2.5 border-b border-gray-100 dark:border-slate-800 mb-1">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{displayName}</p>
                    <p className="text-gray-400 text-[11px] truncate">{userEmail || `@${role}`}</p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-red/10 text-brand-red">
                      {role} Access
                    </span>
                  </div>

                  <Link
                    to={`/portal/${role}/settings`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors font-semibold"
                  >
                    <User size={15} className="text-brand-red" />
                    <span>Profile Preferences</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors font-semibold text-left"
                  >
                    <Lock size={15} className="text-amber-500" />
                    <span>Change Password</span>
                  </button>

                  <Link
                    to={`/portal/${role}/payments`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors font-semibold"
                  >
                    <CreditCard size={15} className="text-green-500" />
                    <span>Tuition & Statements</span>
                  </Link>

                  <div className="pt-1 border-t border-gray-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-bold text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Outlet Content with Smooth Page Transitions */}
        <div className="p-4 sm:p-6 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default PortalLayout;
