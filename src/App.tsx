import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import PageLoader from "./components/ui/PageLoader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import ProjectRequest from "./pages/ProjectRequest";
import SchoolPartnership from "./pages/SchoolPartnership";
import TutorApplication from "./pages/TutorApplication";
import FAQ from "./pages/FAQ";
import Portal from "./pages/Portal";
import Register from "./pages/Register";
import PortalLayout from "./components/portal/PortalLayout";
import ParentDashboard from "./pages/portal/ParentDashboard";
import StaffDashboard from "./pages/portal/StaffDashboard";
import StudentDashboard from "./pages/portal/StudentDashboard";

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
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminSettings from "./pages/admin/AdminSettings";

import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <PageLoader />
            <ScrollToTop />
            <AnimatedRoutes />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetails />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostDetails />} />
        <Route path="/project-request" element={<ProjectRequest />} />
        <Route path="/school-partnership" element={<SchoolPartnership />} />
        <Route path="/tutor-application" element={<TutorApplication />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Portal Routes */}
        <Route path="/portal" element={<Portal />} />
        <Route path="/register" element={<Register />} />
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
          <Route index element={<div className="p-8 text-center text-gray-500">School Dashboard coming soon</div>} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

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
          <Route path="inquiries" element={<AdminInquiries />} />
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
export default App;
