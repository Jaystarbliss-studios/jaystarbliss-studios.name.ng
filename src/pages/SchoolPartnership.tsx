import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { CheckCircle2, ArrowRight, ArrowLeft, Send, Building2, BookOpen, MessageSquare } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressStepper from '../components/ui/ProgressStepper';

const steps = [
  { id: 'contact', title: 'School Details', subtitle: 'Institution & contact', icon: Building2 },
  { id: 'programs', title: 'Curriculum', subtitle: 'Programs of interest', icon: BookOpen },
  { id: 'requirements', title: 'Requirements', subtitle: 'Specific needs & submit', icon: MessageSquare },
];

const SchoolPartnership: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
  const [error, setError] = useState<string | null>(null);

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

  const validateStep = (stepIdx: number): boolean => {
    setError(null);
    if (stepIdx === 0) {
      if (!formData.name.trim()) {
        setError('Please enter your contact name.');
        return false;
      }
      if (!formData.schoolName.trim()) {
        setError('Please enter the name of the school / institution.');
        return false;
      }
      if (!formData.role.trim()) {
        setError('Please provide your role/position.');
        return false;
      }
      if (!formData.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return false;
      }
      return true;
    }

    if (stepIdx === 1) {
      if (formData.programsOfInterest.length === 0) {
        setError('Please select at least one program of interest.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError(null);
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError(null);
    
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
      setError('There was an error sending your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-20 lg:py-28 relative overflow-hidden">
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

      <div className="py-16 bg-brand-neutral dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
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
              <div>
                {/* Visual Progress Stepper */}
                <div className="mb-10">
                  <ProgressStepper
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={(idx) => {
                      if (idx < currentStep) setCurrentStep(idx);
                    }}
                    allowStepClick={true}
                  />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30">
                      {error}
                    </div>
                  )}
                  
                  {/* Step 1: School Details */}
                  {currentStep === 0 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-xl font-bold text-brand-slate dark:text-white">1. Contact & Institution Information</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tell us about your school and administrative contact.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Full Name *</label>
                          <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Dr. Johnson" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">School Name *</label>
                          <input type="text" name="schoolName" required value={formData.schoolName} onChange={handleChange} placeholder="e.g. Bright Horizon Academy" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Your Role / Position *</label>
                          <input type="text" name="role" required value={formData.role} onChange={handleChange} placeholder="e.g. Principal / ICT Director" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Email Address *</label>
                          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="principal@brighthorizon.edu" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Phone Number</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 ..." className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Programs of Interest */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-xl font-bold text-brand-slate dark:text-white">2. Programs of Interest</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Select one or more programs you would like to introduce.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {programs.map((program) => (
                          <label key={program} className={`flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border rounded-xl cursor-pointer transition-all ${formData.programsOfInterest.includes(program) ? 'border-brand-red ring-1 ring-brand-red bg-red-50/20 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            <input 
                              type="checkbox" 
                              checked={formData.programsOfInterest.includes(program)}
                              onChange={() => handleCheckboxChange(program)}
                              className="w-5 h-5 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                            />
                            <span className="font-semibold text-sm text-brand-slate dark:text-white">{program}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Requirements & Review */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-xl font-bold text-brand-slate dark:text-white">3. Specific Requirements</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Share any customized expectations, class sizes, or scheduling needs.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Message / Specific Requirements</label>
                          <textarea name="message" rows={4} placeholder="Let us know approximate student count, preferred term dates, or special facility requirements..." value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                        </div>

                        {/* Summary */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-sm">
                          <div className="font-bold text-brand-slate dark:text-white mb-2 text-xs uppercase tracking-wider">Partnership Summary</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div><span className="text-slate-500">School:</span> <strong className="text-slate-900 dark:text-white">{formData.schoolName}</strong></div>
                            <div><span className="text-slate-500">Representative:</span> <strong className="text-slate-900 dark:text-white">{formData.name} ({formData.role})</strong></div>
                            <div className="md:col-span-2"><span className="text-slate-500">Selected Programs:</span> <strong className="text-slate-900 dark:text-white">{formData.programsOfInterest.join(', ') || 'None selected'}</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleBack}
                        disabled={loading}
                        leftIcon={<ArrowLeft size={16} />}
                      >
                        Back
                      </Button>
                    )}

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleNext}
                        fullWidth
                        rightIcon={<ArrowRight size={16} />}
                        className="shadow-lg shadow-brand-red/20"
                      >
                        Continue to Step {currentStep + 2}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        isLoading={loading}
                        fullWidth
                        size="lg"
                        rightIcon={<Send size={18} />}
                        className="uppercase tracking-widest shadow-xl shadow-brand-red/20"
                      >
                        DISCUSS A SCHOOL PROGRAM
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SchoolPartnership;

