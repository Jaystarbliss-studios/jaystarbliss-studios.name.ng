import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { CheckCircle2, MapPin, Mail, Phone } from 'lucide-react';
import Button from '../components/ui/Button';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'General Inquiry',
    message: ''
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
        inquirySubject: formData.type,
        ...formData,
        type: 'CONTACT',
        status: 'NEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', type: 'General Inquiry', message: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <SEO 
        title="Contact Us" 
        description="Get in touch with Jaystarbliss Studios. Whether you're looking to start a new project, enroll in a program, or just say hello." 
      />

      {/* Header Banner */}
      <div className="bg-brand-slate text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-brand-red mb-3">
              Direct Communication
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
              Whether you're looking to start a new project, enroll in a program, or just say hello, we'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content Split */}
      <div className="py-16 md:py-24 bg-brand-neutral dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Contact Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-brand-red block mb-2">Reach Us Directly</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate dark:text-white tracking-tight">
                  Contact Information
                </h2>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
                
                <div className="py-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Email Us</h3>
                    <a href="mailto:hello@jaystarbliss.com" className="text-base font-semibold text-brand-slate dark:text-white hover:text-brand-red transition-colors">
                      hello@jaystarbliss.com
                    </a>
                  </div>
                </div>

                <div className="py-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Call Us</h3>
                    <a href="tel:+2341234567890" className="text-base font-semibold text-brand-slate dark:text-white hover:text-brand-red transition-colors">
                      +234 (0) 123 456 7890
                    </a>
                  </div>
                </div>

                <div className="py-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Our Office</h3>
                    <p className="text-base font-medium text-brand-slate dark:text-white leading-relaxed">
                      123 Innovation Drive<br/>Tech District, Lagos, Nigeria
                    </p>
                  </div>
                </div>

              </div>

              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-brand-slate dark:text-white mb-1">Operating Hours</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Monday – Friday: 9:00 AM – 6:00 PM WAT<br />
                  Saturday: 10:00 AM – 3:00 PM WAT
                </p>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-950 p-8 sm:p-10 md:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-brand-slate dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 font-normal max-w-md mx-auto">
                      Thank you for reaching out. We will get back to you shortly.
                    </p>
                    <Button onClick={() => setSuccess(false)} variant="secondary" fullWidth size="lg">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold">
                        There was an error sending your message. Please try again.
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                          Full Name
                        </label>
                        <input 
                          type="text" 
                          name="name" 
                          required 
                          value={formData.name} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-slate-900 dark:text-white text-sm font-medium transition-colors" 
                          placeholder="Jane Doe" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          name="email" 
                          required 
                          value={formData.email} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-slate-900 dark:text-white text-sm font-medium transition-colors" 
                          placeholder="jane@example.com" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                        Inquiry Type
                      </label>
                      <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-slate-900 dark:text-white text-sm font-medium transition-colors"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Project Request">Project Request</option>
                        <option value="Tutoring Program">Tutoring Program</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                        Message
                      </label>
                      <textarea 
                        name="message" 
                        rows={5} 
                        required 
                        value={formData.message} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-slate-900 dark:text-white text-sm font-medium transition-colors resize-none" 
                        placeholder="Tell us about your project, questions, or goals..." 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      fullWidth 
                      isLoading={loading}
                      className="uppercase tracking-widest shadow-lg shadow-brand-red/20 font-extrabold"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
