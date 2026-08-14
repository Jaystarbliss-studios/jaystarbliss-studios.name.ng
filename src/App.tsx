import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetails from './pages/ProgramDetails';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import ProjectRequest from './pages/ProjectRequest';
import SchoolPartnership from './pages/SchoolPartnership';
import TutorApplication from './pages/TutorApplication';
import FAQ from './pages/FAQ';
import Portal from './pages/Portal';
import Register from './pages/Register';
import PortalLayout from './components/portal/PortalLayout';
import ParentDashboard from './pages/portal/ParentDashboard';
import StaffDashboard from './pages/portal/StaffDashboard';
import StudentDashboard from './pages/portal/StudentDashboard';

import Resources from './pages/Resources';

import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Login from './pages/admin/Login';
import AdminApprovals from './pages/admin/AdminApprovals';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminProgramForm from './pages/admin/AdminProgramForm';
import AdminServices from './pages/admin/AdminServices';
import AdminServiceForm from './pages/admin/AdminServiceForm';
import AdminBlog from './pages/admin/AdminBlog';
import AdminBlogForm from './pages/admin/AdminBlogForm';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminPortfolioForm from './pages/admin/AdminPortfolioForm';
import AdminInquiries from './pages/admin/AdminInquiries';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
    <Router>
      <ScrollToTop />
      <Routes>
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
        
        <Route path="/project-request" element={<ProjectRequest />} />
        <Route path="/school-partnership" element={<SchoolPartnership />} />
        <Route path="/tutor-application" element={<TutorApplication />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Portal Routes */}
        <Route path="/portal" element={<Portal />} />
        <Route path="/register" element={<Register />} />
        <Route path="/portal/student" element={<PortalLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="calendar" element={<div className="p-8 text-center text-gray-500">Calendar coming soon</div>} />
          <Route path="courses" element={<div className="p-8 text-center text-gray-500">My Courses coming soon</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings coming soon</div>} />
        </Route>
        
        <Route path="/portal/staff" element={<PortalLayout />}>
          <Route index element={<StaffDashboard />} />
        </Route>
        
        <Route path="/portal/parent" element={<PortalLayout />}>
          <Route index element={<ParentDashboard />} />
        </Route>
        
        <Route path="/portal/school" element={<PortalLayout />}>
          <Route index element={<div className="p-8 text-center text-gray-500">School Dashboard coming soon</div>} />
        </Route>

        
        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="approvals" element={<AdminApprovals />} />

          
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
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
