import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, Settings, LogOut, LayoutDashboard, 
  Calendar, ExternalLink, Building2 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Tooltip } from '../ui/Tooltip';
import { JaystarblissIcon } from '../common/JaystarblissLogo';
import SEO from '../ui/SEO';

const PortalLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/');
  const role = pathParts[2] || 'student'; // e.g., /portal/student -> student

  const [displayName, setDisplayName] = useState('Portal User');

  useEffect(() => {
    const storedName = sessionStorage.getItem('userName') || auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Cadet';
    setDisplayName(storedName);
  }, [role]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    sessionStorage.clear();
    navigate('/portal');
  };

  const getNavLinks = () => {
    const base = [
      { name: 'Dashboard', path: `/portal/${role}`, icon: <LayoutDashboard size={20} />, desc: 'Portal Overview & Stats' },
      { name: 'Calendar', path: `/portal/${role}/calendar`, icon: <Calendar size={20} />, desc: 'Schedules & Sessions' },
    ];
    if (role === 'student') {
      base.push({ name: 'My Courses', path: '/portal/student/courses', icon: <Book size={20} />, desc: 'Enrolled Classes & Progress' });
    } else if (role === 'staff') {
      base.push({ name: 'Classes', path: '/portal/staff/classes', icon: <Book size={20} />, desc: 'Teaching Roster & Materials' });
    } else if (role === 'school') {
      base.push({ name: 'Students Roster', path: '/portal/school', icon: <Building2 size={20} />, desc: 'School Cadets & Records' });
    }
    base.push({ name: 'Settings', path: `/portal/${role}/settings`, icon: <Settings size={20} />, desc: 'Account Preferences' });
    return base;
  };

  const navLinks = getNavLinks();
  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <SEO 
        title={`${roleTitle} Portal`} 
        description={`Jaystarbliss Studios ${roleTitle} portal access and learning dashboard.`} 
        noindex={true}
      />
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-slate text-white flex flex-col h-auto md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 sticky top-0 md:relative z-20">
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
          <div className="mt-8 mb-4">
            <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">{role} Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-4 pb-4 overflow-y-auto flex md:flex-col gap-2">
          {navLinks.map((link) => (
            <Tooltip key={link.name} content={link.desc} placement="right" delay={300}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === link.path ? 'bg-brand-red text-white shadow-sm' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.icon}
                <span className="font-medium hidden md:block">{link.name}</span>
              </Link>
            </Tooltip>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <Tooltip content="Log out of portal session" placement="top">
            <button 
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-white/60 hover:text-brand-red rounded-xl hover:bg-white/5 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium hidden md:block">Log Out</span>
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-brand-slate capitalize">
            {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <Tooltip content={`Signed in as ${displayName} (${role})`} placement="bottom">
              <div className="flex items-center gap-3 cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-brand-slate">{displayName}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center border border-brand-red/20 font-bold uppercase text-sm">
                  {displayName.charAt(0)}
                </div>
              </div>
            </Tooltip>
          </div>
        </header>
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PortalLayout;

