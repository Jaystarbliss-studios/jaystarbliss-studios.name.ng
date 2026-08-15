import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';

const TutorApplication: React.FC = () => {
  const [formData,
        setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    ageGroup: '',
    subjects: '',
    availability: '',
    introduction: '',
    portfolioLink: ''
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
        type: 'TUTOR_APP',
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Become a Tutor</h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Join our network of skilled professionals who are passionate about teaching, mentoring, and helping others grow.
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
                <h3 className="text-3xl font-bold text-brand-slate dark:text-white mb-4">Application Submitted!</h3>
                <p className="text-brand-slate/70 dark:text-gray-400 mb-10 text-lg max-w-md mx-auto font-medium">
                  Thanks for applying. We've received your information and will review it shortly.
                </p>
                <Button to="/" variant="secondary" size="lg" rightIcon={<ArrowRight size={20} />}>
                  RETURN TO HOME
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30">There was an error sending your application. Please try again.</div>}
                
                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">1. Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Phone Number *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 mt-10">2. Professional Details</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Primary Area of Expertise *</label>
                      <input type="text" name="expertise" required placeholder="e.g. Web Development, Mathematics, Graphic Design" value={formData.expertise} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Years of Experience</label>
                        <select name="experience" required value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white">
                          <option value="">Select...</option>
                          <option value="Less than 1 year">Less than 1 year</option>
                          <option value="1 - 3 years">1 - 3 years</option>
                          <option value="3 - 5 years">3 - 5 years</option>
                          <option value="5+ years">5+ years</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Preferred Age Group</label>
                        <select name="ageGroup" required value={formData.ageGroup} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white">
                          <option value="">Select...</option>
                          <option value="Children (7-12)">Children (7-12)</option>
                          <option value="Teens (13-17)">Teens (13-17)</option>
                          <option value="Adults (18+)">Adults (18+)</option>
                          <option value="Any Age Group">Any Age Group</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Specific Subjects/Skills you can teach *</label>
                      <textarea name="subjects" required rows={2} value={formData.subjects} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Teaching Availability</label>
                      <select name="availability" required value={formData.availability} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white">
                        <option value="">Select...</option>
                        <option value="Online Only">Online Only</option>
                        <option value="Physical Only">Physical Only</option>
                        <option value="Both Online and Physical">Both Online and Physical</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 mt-10">3. More About You</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Short Introduction *</label>
                      <p className="text-sm text-brand-slate/60 dark:text-gray-400 mb-2 font-medium">Tell us why you enjoy teaching and what makes your approach effective.</p>
                      <textarea name="introduction" required rows={4} value={formData.introduction} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Link to CV / Portfolio</label>
                      <p className="text-sm text-brand-slate/60 dark:text-gray-400 mb-2 font-medium">Google Drive link, LinkedIn profile, or personal website.</p>
                      <input type="url" name="portfolioLink" placeholder="https://" value={formData.portfolioLink} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" isLoading={loading} fullWidth size="lg" className="uppercase tracking-widest shadow-xl shadow-brand-red/20">
                    SUBMIT APPLICATION
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

export default TutorApplication;
