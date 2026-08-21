import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import PageLoader from "./components/ui/PageLoader";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import PageTransition from "./components/ui/PageTransition";

import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Portfolio from "./pages/Portfolio";
import MagicParticles from "./pages/MagicParticles";
import Contact from "./pages/Contact";
import ProjectRequest from "./pages/ProjectRequest";
import SchoolPartnership from "./pages/SchoolPartnership";
import TutorApplication from "./pages/TutorApplication";
import FAQ from "./pages/FAQ";
import FindTutor from "./pages/FindTutor";
import Portal from "./pages/Portal";
import Register from "./pages/Register";
import PortalLayout from "./components/portal/PortalLayout";
import ParentDashboard from "./pages/portal/ParentDashboard";
import StaffDashboard from "./pages/portal/StaffDashboard";
import StudentDashboard from "./pages/portal/StudentDashboard";
import SchoolDashboard from "./pages/portal/SchoolDashboard";

import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import BlogPostDetails from "./pages/BlogPostDetails";

import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Login from "./pages/admin/Login";
import AdminPages from "./pages/admin/AdminPages";
import AdminPageForm from "./pages/admin/AdminPageForm";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminProgramForm from "./pages/admin/AdminProgramForm";
import AdminServices from "./pages/admin/AdminServices";
import AdminServiceForm from "./pages/admin/AdminServiceForm";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogForm from "./pages/admin/AdminBlogForm";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminPortfolioForm from "./pages/admin/AdminPortfolioForm";
import AdminKidsProjects from "./pages/admin/AdminKidsProjects";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminSettings from "./pages/admin/AdminSettings";

import ScrollToTop from "./components/ScrollToTop";
import GlassRippleListener from "./components/ui/GlassRippleListener";

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/programs" element={<PageTransition><Programs /></PageTransition>} />
        <Route path="/programs/:slug" element={<PageTransition><ProgramDetails /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/services/:slug" element={<PageTransition><ServiceDetails /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/magic-particles" element={<MagicParticles />} />
        <Route path="/kids-zone/magic" element={<MagicParticles />} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPostDetails /></PageTransition>} />
        <Route path="/project-request" element={<PageTransition><ProjectRequest /></PageTransition>} />
        <Route path="/school-partnership" element={<PageTransition><SchoolPartnership /></PageTransition>} />
        <Route path="/tutors" element={<PageTransition><FindTutor /></PageTransition>} />
        <Route path="/find-tutor" element={<PageTransition><FindTutor /></PageTransition>} />
        <Route path="/tutor-application" element={<PageTransition><TutorApplication /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />

        {/* Portal Routes */}
        <Route path="/portal" element={<PageTransition><Portal /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/portal/student" element={<ProtectedRoute allowedRoles={['STUDENT']} redirectPath="/portal"><PortalLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="calendar" element={<div className="p-8 text-center text-gray-500">Calendar coming soon</div>} />
          <Route path="courses" element={<div className="p-8 text-center text-gray-500">My Courses coming soon</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings coming soon</div>} />
        </Route>
        
        <Route path="/portal/staff" element={<ProtectedRoute allowedRoles={['TUTOR', 'STAFF']} redirectPath="/portal"><PortalLayout /></ProtectedRoute>}>
          <Route index element={<StaffDashboard />} />
        </Route>
        
        <Route path="/portal/parent" element={<ProtectedRoute allowedRoles={['PARENT']} redirectPath="/portal"><PortalLayout /></ProtectedRoute>}>
          <Route index element={<ParentDashboard />} />
        </Route>
        
        <Route path="/portal/school" element={<ProtectedRoute allowedRoles={['SCHOOL']} redirectPath="/portal"><PortalLayout /></ProtectedRoute>}>
          <Route index element={<SchoolDashboard />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<PageTransition><Login /></PageTransition>} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="programs/new" element={<AdminProgramForm />} />
          <Route path="programs/:id" element={<AdminProgramForm />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/new" element={<AdminServiceForm />} />
          <Route path="services/:id" element={<AdminServiceForm />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="blog/new" element={<AdminBlogForm />} />
          <Route path="blog/:id" element={<AdminBlogForm />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="portfolio/new" element={<AdminPortfolioForm />} />
          <Route path="portfolio/:id" element={<AdminPortfolioForm />} />
          <Route path="kids-projects" element={<AdminKidsProjects />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="pages/new" element={<AdminPageForm />} />
          <Route path="pages/:id" element={<AdminPageForm />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <PageLoader />
            <ScrollToTop />
            <GlassRippleListener />
            <AnimatedRoutes />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

