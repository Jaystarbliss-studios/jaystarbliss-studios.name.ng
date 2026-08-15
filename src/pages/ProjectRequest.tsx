import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';

const ProjectRequest: React.FC = () => {
  const [formData,
        setFormData] = useState({
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
    setFormData({
        ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        type: 'PROJECT_REQUEST',
        ...formData,
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
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Start a Project</h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Tell us about what you want to build or design. Provide as much detail as you can, and we'll get back to you to discuss the next steps.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 bg-brand-neutral dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 md:p-12 shadow-xl border-0 ring-1 ring-slate-200 dark:ring-slate-800">
            {success ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 shadow-sm">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold text-brand-slate dark:text-white mb-4">Request Received</h3>
                <p className="text-brand-slate/70 dark:text-gray-400 mb-10 text-lg max-w-md mx-auto">
                  Thank you for telling us about your project. Our team will review your requirements and contact you shortly to schedule a consultation.
                </p>
                <Button to="/" variant="secondary" size="lg" rightIcon={<ArrowRight size={20} />}>
                  RETURN TO HOME
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30">There was an error sending your request. Please try again.</div>}
                
                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">1. Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Organization / Company</label>
                      <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 mt-10">2. Project Details</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Service Required *</label>
                      <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white">
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
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Project Description *</label>
                      <p className="text-sm text-brand-slate/60 dark:text-gray-400 mb-2 font-medium">Briefly describe what you want to build or design.</p>
                      <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">What are you trying to achieve? *</label>
                      <p className="text-sm text-brand-slate/60 dark:text-gray-400 mb-2 font-medium">What is the main goal of this project?</p>
                      <textarea name="goals" required rows={3} value={formData.goals} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 mt-10">3. Logistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Expected Timeline</label>
                      <input type="text" name="timeline" placeholder="e.g. 1 month, ASAP" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Budget Range</label>
                      <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white">
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
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Existing Website (if applicable)</label>
                      <input type="url" name="existingWebsite" placeholder="https://" value={formData.existingWebsite} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Reference Links</label>
                      <p className="text-sm text-brand-slate/60 dark:text-gray-400 mb-2 font-medium">Any websites or designs you like.</p>
                      <textarea name="references" rows={2} value={formData.references} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" isLoading={loading} fullWidth size="lg" className="uppercase tracking-widest shadow-xl shadow-brand-red/20">
                    SEND PROJECT REQUEST
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectRequest;
