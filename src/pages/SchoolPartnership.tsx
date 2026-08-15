import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';

const SchoolPartnership: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    role: '',
    email: '',
    phone: '',
    programsOfInterest: [] as string[],
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const programs = [
    'Coding',
    'Digital literacy',
    'Graphic design',
    'Music',
    'Creative arts',
    'Technology clubs',
    'Staff training',
    'Custom school programs'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (program: string) => {
    setFormData(prev => ({
      ...prev,
      programsOfInterest: prev.programsOfInterest.includes(program)
        ? prev.programsOfInterest.filter(p => p !== program)
        : [...prev.programsOfInterest, program]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        type: 'SCHOOL_PARTNERSHIP',
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">LET'S BRING PRACTICAL DIGITAL EDUCATION TO YOUR SCHOOL.</h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Schools are preparing students for a world where technology, creativity and digital skills are becoming increasingly important. We can help you introduce those skills in a structured and practical way.
            </p>
          </div>
        </div>
      </div>

      <div className="py-24 bg-brand-neutral dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 md:p-12 shadow-xl border-0 ring-1 ring-slate-200 dark:ring-slate-800">
            {success ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 shadow-sm">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-extrabold text-brand-slate dark:text-white mb-4 tracking-tight">Partnership Request Sent!</h3>
                <p className="text-xl text-brand-slate/70 dark:text-gray-400 mb-10 font-medium">Thank you for your interest. We will review your request and get back to you shortly to discuss a potential partnership.</p>
                <Button to="/" variant="secondary" size="lg" rightIcon={<ArrowRight size={20} />}>
                  RETURN TO HOME
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30">There was an error sending your request. Please try again.</div>}
                
                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">School Name *</label>
                      <input type="text" name="schoolName" required value={formData.schoolName} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Your Role / Position *</label>
                      <input type="text" name="role" required value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 mt-10">Programs of Interest</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {programs.map((program) => (
                      <label key={program} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.programsOfInterest.includes(program)}
                          onChange={() => handleCheckboxChange(program)}
                          className="w-5 h-5 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                        />
                        <span className="font-medium text-brand-slate dark:text-white">{program}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-slate dark:text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 mt-10">Additional Details</h3>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Message / Specific Requirements</label>
                    <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" isLoading={loading} fullWidth size="lg" className="uppercase tracking-widest shadow-xl shadow-brand-red/20">
                    DISCUSS A SCHOOL PROGRAM
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

export default SchoolPartnership;
