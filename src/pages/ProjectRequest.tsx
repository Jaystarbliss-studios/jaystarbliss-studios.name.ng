import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { CheckCircle2, ArrowRight, ArrowLeft, Send, User, Layers, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressStepper from '../components/ui/ProgressStepper';

const steps = [
  { id: 'contact', title: 'Your Details', subtitle: 'Name & organization', icon: User },
  { id: 'scope', title: 'Project Scope', subtitle: 'Service & goals', icon: Layers },
  { id: 'logistics', title: 'Logistics & Budget', subtitle: 'Timeline & budget', icon: Calendar },
];

const ProjectRequest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep = (stepIdx: number): boolean => {
    setError(null);
    if (stepIdx === 0) {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return false;
      }
      if (!formData.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return false;
      }
      return true;
    }

    if (stepIdx === 1) {
      if (!formData.description.trim()) {
        setError('Please briefly describe the project.');
        return false;
      }
      if (!formData.goals.trim()) {
        setError('Please provide the main goal or target outcome.');
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
        type: 'PROJECT_REQUEST',
        ...formData,
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
      <div className="bg-brand-slate text-white py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Start a Project</h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Tell us about what you want to build or design. Provide as much detail as you can, and we'll get back to you to discuss the next steps.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 bg-brand-neutral dark:bg-slate-950">
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
                  
                  {/* Step 1: Contact Details */}
                  {currentStep === 0 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-xl font-bold text-brand-slate dark:text-white">1. Your Details</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Let's know who we are partnering with.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Full Name *</label>
                          <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Samuel Ade" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Organization / Company</label>
                          <input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="e.g. Acme Tech Solutions" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Email Address *</label>
                          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="samuel@example.com" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Phone Number</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 ..." className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Project Scope */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-xl font-bold text-brand-slate dark:text-white">2. Project Details</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Describe what you want to create and your objectives.</p>
                      </div>

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
                          <p className="text-xs text-brand-slate/60 dark:text-gray-400 font-medium">Briefly describe what you want to build or design.</p>
                          <textarea name="description" required rows={4} placeholder="Describe the core concept, target audience, and key functionality..." value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">What are you trying to achieve? *</label>
                          <p className="text-xs text-brand-slate/60 dark:text-gray-400 font-medium">What is the primary milestone or business objective?</p>
                          <textarea name="goals" required rows={3} placeholder="e.g. Launch a customer portal, increase sales conversions, automate inquiries..." value={formData.goals} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Logistics & Budget */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-xl font-bold text-brand-slate dark:text-white">3. Logistics & Budget</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Share your timeline expectations and budget parameters.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Expected Timeline</label>
                          <input type="text" name="timeline" placeholder="e.g. 1 month, 6 weeks, ASAP" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
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

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Existing Website (if applicable)</label>
                          <input type="url" name="existingWebsite" placeholder="https://" value={formData.existingWebsite} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Reference Links / Notes</label>
                          <p className="text-xs text-brand-slate/60 dark:text-gray-400 font-medium">Any websites, design inspirations, or additional notes.</p>
                          <textarea name="references" rows={2} placeholder="Links or ideas you like..." value={formData.references} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red font-medium text-brand-slate dark:text-white resize-none"></textarea>
                        </div>

                        {/* Summary */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-sm">
                          <div className="font-bold text-brand-slate dark:text-white mb-2 text-xs uppercase tracking-wider">Project Summary</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div><span className="text-slate-500">Contact:</span> <strong className="text-slate-900 dark:text-white">{formData.name}</strong></div>
                            <div><span className="text-slate-500">Service:</span> <strong className="text-slate-900 dark:text-white">{formData.service}</strong></div>
                            <div><span className="text-slate-500">Email:</span> <strong className="text-slate-900 dark:text-white">{formData.email}</strong></div>
                            <div><span className="text-slate-500">Timeline:</span> <strong className="text-slate-900 dark:text-white">{formData.timeline || 'Flexible'}</strong></div>
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
                        SEND PROJECT REQUEST
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

export default ProjectRequest;

