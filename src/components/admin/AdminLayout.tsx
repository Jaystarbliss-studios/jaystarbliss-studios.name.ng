import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from '../ui/SearchModal';
import { Tooltip } from '../ui/Tooltip';
import { JaystarblissIcon } from '../common/JaystarblissLogo';
import SEO from '../ui/SEO';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Briefcase, 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X,
  Gamepad2,
  Search,
  ExternalLink
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, desc: "Overview & metrics" },
    { name: "Pages (CMS)", href: "/admin/pages", icon: FileText, desc: "Live content editor" },
    { name: "Programs", href: "/admin/programs", icon: BookOpen, desc: "Manage courses & curriculum" },
    { name: "Services", href: "/admin/services", icon: Briefcase, desc: "Business & enterprise offerings" },
    { name: "Portfolio", href: "/admin/portfolio", icon: FolderOpen, desc: "Client case studies" },
    { name: "Kids Projects", href: "/admin/kids-projects", icon: Gamepad2, desc: "Student showcase" },
    { name: "Blog", href: "/admin/blog", icon: FileText, desc: "Articles & news" },
    { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, desc: "Applications & leads" },
    { name: "Users", href: "/admin/users", icon: Users, desc: "User accounts & roles" },
    { name: "Settings", href: "/admin/settings", icon: Settings, desc: "System configuration" },
  ];

  const closeSidebar = () => setSidebarOpen(false);
  const currentNav = navigation.find(n => n.href === location.pathname);
  const currentTitle = currentNav ? `Admin ${currentNav.name}` : 'Admin Management Panel';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SEO 
        title={currentTitle} 
        description="Jaystarbliss Studios Administration and Content Management System." 
        noindex={true}
      />
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/80 transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-slate text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-64 lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-brand-slate border-b border-white/10">
          <Tooltip content="Return to Public Website" placement="bottom">
            <Link to="/" className="flex items-center gap-2 group">
              <JaystarblissIcon className="w-8 h-8 group-hover:scale-105 transition-transform" />
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                ADMIN PORTAL
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-70 transition-opacity" />
              </span>
            </Link>
          </Tooltip>
          <Tooltip content="Close Sidebar" placement="left">
            <button className="lg:hidden text-white/70 hover:text-white p-1 rounded hover:bg-white/10" onClick={closeSidebar}>
              <X size={20} />
            </button>
          </Tooltip>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/admin');
              const Icon = item.icon;
              return (
                <Tooltip key={item.name} content={item.desc} placement="right" delay={300}>
                  <Link
                    to={item.href}
                    onClick={closeSidebar}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-brand-red text-white shadow-sm' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon 
                      className={`flex-shrink-0 mr-3 h-5 w-5 transition-colors ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`} 
                    />
                    {item.name}
                  </Link>
                </Tooltip>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <Tooltip content="End administrative session" placement="top">
            <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 rounded-md hover:bg-white/5 hover:text-white transition-colors">
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Sign Out
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
          <Tooltip content="Open navigation menu" placement="right">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={24} />
            </button>
          </Tooltip>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <Tooltip content="Search anything (Cmd+K)" placement="bottom">
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search content"
              >
                <Search size={20} />
              </button>
            </Tooltip>
            <div className="h-6 w-px bg-gray-200"></div>
            <Tooltip content="Active Administrator: John Rufai" placement="bottom">
              <div className="flex items-center gap-3 cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-sm font-medium text-gray-700 hidden sm:block">Admin User</div>
                <div className="w-8 h-8 rounded-full bg-brand-neutral text-brand-slate flex items-center justify-center font-bold text-sm border border-slate-200">
                  AU
                </div>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
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
          </div>
        </main>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default AdminLayout;

