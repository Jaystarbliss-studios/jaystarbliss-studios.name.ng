import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { CheckCircle2, ArrowRight, ArrowLeft, Send, Building2, BookOpen, MessageSquare } from 'lucide-react';
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
      <SEO 
        title="School Partnerships" 
        description="Partner with Jaystarbliss Studios to bring practical digital education, coding clubs, and creative tech curriculum to your school." 
      />

      {/* Header Banner */}
      <div className="bg-brand-slate text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-center">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-brand-red mb-3">
            Institutional Collaboration
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
            LET'S BRING PRACTICAL DIGITAL EDUCATION TO YOUR SCHOOL.
          </h1>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal max-w-2xl mx-auto">
            Schools are preparing students for a world where technology, creativity and digital skills are becoming increasingly important. We can help you introduce those skills in a structured and practical way.
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div className="py-16 md:py-24 bg-brand-neutral dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          
          <div className="bg-white dark:bg-slate-950 p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                  <CheckCircle2 size={42} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-slate dark:text-white mb-3">Partnership Request Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-base max-w-md mx-auto leading-relaxed">
                  Thank you for your interest. We will review your request and get back to you shortly to discuss a potential partnership.
                </p>
                <Button to="/" variant="secondary" size="lg" rightIcon={<ArrowRight size={18} />}>
                  RETURN TO HOME
                </Button>
              </div>
            ) : (
              <div>
                {/* Visual Progress Stepper */}
                <div className="mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <ProgressStepper
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={(idx) => {
                      if (idx < currentStep) setCurrentStep(idx);
                    }}
                    allowStepClick={true}
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-xs sm:text-sm font-semibold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: School Details */}
                  {currentStep === 0 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-lg font-bold text-brand-slate dark:text-white mb-1">School & Contact Information</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Tell us about your institution and administrative lead.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                            Full Name <span className="text-brand-red">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            placeholder="Dr. Johnson"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                            School / Institution Name <span className="text-brand-red">*</span>
                          </label>
                          <input
                            type="text"
                            name="schoolName"
                            required
                            placeholder="Bright Horizon Academy"
                            value={formData.schoolName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                            Your Role / Position <span className="text-brand-red">*</span>
                          </label>
                          <input
                            type="text"
                            name="role"
                            required
                            placeholder="Principal / ICT Director"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                            Email Address <span className="text-brand-red">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder="principal@brighthorizon.edu"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white text-sm"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+234..."
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Programs */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-lg font-bold text-brand-slate dark:text-white mb-1">Programs of Interest</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Select one or more tracks you would like to introduce.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {programs.map((program) => {
                          const isChecked = formData.programsOfInterest.includes(program);
                          return (
                            <label
                              key={program}
                              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                isChecked
                                  ? 'border-brand-red bg-red-500/5 dark:bg-red-500/10 text-brand-slate dark:text-white'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(program)}
                                className="w-4 h-4 text-brand-red rounded border-slate-300 focus:ring-brand-red"
                              />
                              <span className="text-xs sm:text-sm font-bold">{program}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Requirements */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-lg font-bold text-brand-slate dark:text-white mb-1">Specific Requirements</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Share any customized expectations, class sizes, or scheduling needs.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                          Message / Requirements
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          placeholder="Let us know approximate student count, preferred term dates, or special facility requirements..."
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red text-slate-900 dark:text-white text-sm resize-none"
                        />
                      </div>

                      {/* Summary */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                        <div className="font-bold text-brand-slate dark:text-white mb-1 uppercase tracking-wider">Partnership Summary</div>
                        <div><span className="text-slate-500">School:</span> <strong className="text-slate-900 dark:text-white">{formData.schoolName}</strong></div>
                        <div><span className="text-slate-500">Representative:</span> <strong className="text-slate-900 dark:text-white">{formData.name} ({formData.role})</strong></div>
                        <div><span className="text-slate-500">Selected Programs:</span> <strong className="text-slate-900 dark:text-white">{formData.programsOfInterest.join(', ') || 'None selected'}</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Nav Controls */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
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
                        className="shadow-lg shadow-brand-red/20 uppercase tracking-widest font-extrabold"
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
                        className="uppercase tracking-widest shadow-xl shadow-brand-red/20 font-extrabold"
                      >
                        SEND PARTNERSHIP REQUEST
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default SchoolPartnership;
