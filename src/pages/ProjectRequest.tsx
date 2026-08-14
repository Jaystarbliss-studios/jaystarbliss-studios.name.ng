import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectRequest: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    service: 'Web Development',
    description: '',
    goals: '',
    timeline: '',
    budget: '',
    existingWebsite: '',
    references: ''
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
        type: 'Project Request',
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">HAVE A PROJECT IN MIND?</h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Tell us what you're trying to build, design or improve. You don't need to have everything figured out before you contact us. Give us the information you have and we'll take it from there.
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
                <h3 className="text-3xl font-extrabold text-brand-slate dark:text-white mb-4 tracking-tight">Project Request Sent!</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 font-medium">Thank you for sharing your ideas with us. Our team will review your request and get back to you shortly.</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-brand-slate text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                  RETURN TO HOME <ArrowRight size={20} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">There was an error sending your request. Please try again.</div>}
                
                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-gray-100 pb-4 mb-6">1. Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Organization / Company</label>
                      <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-gray-100 pb-4 mb-6 mt-10">2. Project Details</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Service Required *</label>
                      <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium bg-white dark:bg-slate-900 dark:border-slate-800">
                        <option value="Web Development">Web Development</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Branding">Branding</option>
                        <option value="Digital Infrastructure">Digital Infrastructure</option>
                        <option value="AI & Digital Solutions">AI & Digital Solutions</option>
                        <option value="Multiple / Unsure">Multiple / Unsure</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Project Description *</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Briefly describe what you want to build or design.</p>
                      <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">What are you trying to achieve? *</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">What is the main goal of this project?</p>
                      <textarea name="goals" required rows={3} value={formData.goals} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium"></textarea>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-gray-100 pb-4 mb-6 mt-10">3. Logistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Expected Timeline</label>
                      <input type="text" name="timeline" placeholder="e.g. 1 month, ASAP" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Budget Range</label>
                      <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium bg-white dark:bg-slate-900 dark:border-slate-800">
                        <option value="">Select a range...</option>
                        <option value="Under ₦100,000">Under ₦100,000</option>
                        <option value="₦100,000 - ₦500,000">₦100,000 - ₦500,000</option>
                        <option value="₦500,000 - ₦1,000,000">₦500,000 - ₦1,000,000</option>
                        <option value="Over ₦1,000,000">Over ₦1,000,000</option>
                        <option value="Not Sure Yet">Not Sure Yet</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Existing Website (if applicable)</label>
                      <input type="url" name="existingWebsite" placeholder="https://" value={formData.existingWebsite} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Reference Links</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Any websites or designs you like.</p>
                      <textarea name="references" rows={2} value={formData.references} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium"></textarea>
                    </div>
                  </div>
                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-brand-red text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 text-lg shadow-lg shadow-brand-red/20 mt-8">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SEND PROJECT REQUEST'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default ProjectRequest;
