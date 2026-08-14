import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TutorApplication: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    subjects: '',
    ageGroup: '',
    availability: '',
    introduction: '',
    portfolioLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        type: 'Tutor Application',
        status: 'NEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">TEACH WHAT YOU KNOW. HELP SOMEONE GROW.</h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              We're building a community around practical learning. If you have a skill you're confident teaching and enjoy helping people learn, we'd like to hear from you.
            </p>
          </div>
        </div>
      </div>

      <div className="py-24 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
            {success ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-extrabold text-brand-slate dark:text-white mb-4 tracking-tight">Application Submitted!</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 font-medium">Thanks for applying. We've received your information and will review it shortly.</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-brand-slate text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                  RETURN TO HOME <ArrowRight size={20} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">There was an error sending your application. Please try again.</div>}
                
                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-gray-100 pb-4 mb-6">1. Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700">Phone Number *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-gray-100 pb-4 mb-6 mt-10">2. Professional Details</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Primary Area of Expertise *</label>
                      <input type="text" name="expertise" required placeholder="e.g. Web Development, Mathematics, Graphic Design" value={formData.expertise} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Years of Experience</label>
                        <select name="experience" required value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium bg-white dark:bg-slate-900 dark:border-slate-800">
                          <option value="">Select...</option>
                          <option value="Less than 1 year">Less than 1 year</option>
                          <option value="1 - 3 years">1 - 3 years</option>
                          <option value="3 - 5 years">3 - 5 years</option>
                          <option value="5+ years">5+ years</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Preferred Age Group</label>
                        <select name="ageGroup" required value={formData.ageGroup} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium bg-white dark:bg-slate-900 dark:border-slate-800">
                          <option value="">Select...</option>
                          <option value="Children (7-12)">Children (7-12)</option>
                          <option value="Teens (13-17)">Teens (13-17)</option>
                          <option value="Adults (18+)">Adults (18+)</option>
                          <option value="Any Age Group">Any Age Group</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Specific Subjects/Skills you can teach *</label>
                      <textarea name="subjects" required rows={2} value={formData.subjects} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Teaching Availability</label>
                      <select name="availability" required value={formData.availability} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium bg-white dark:bg-slate-900 dark:border-slate-800">
                        <option value="">Select...</option>
                        <option value="Online Only">Online Only</option>
                        <option value="Physical Only">Physical Only</option>
                        <option value="Both Online and Physical">Both Online and Physical</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-gray-100 pb-4 mb-6 mt-10">3. More About You</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Short Introduction *</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tell us why you enjoy teaching and what makes your approach effective.</p>
                      <textarea name="introduction" required rows={4} value={formData.introduction} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Link to CV / Portfolio</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Google Drive link, LinkedIn profile, or personal website.</p>
                      <input type="url" name="portfolioLink" placeholder="https://" value={formData.portfolioLink} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                  </div>
                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-brand-red text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 text-lg shadow-lg shadow-brand-red/20 mt-8">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SUBMIT APPLICATION'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default TutorApplication;
