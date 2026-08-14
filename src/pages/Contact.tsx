import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Loader2, CheckCircle2, MapPin, Mail, Phone } from 'lucide-react';

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
        ...formData,
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
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Whether you're looking to start a new project, enroll in a program, or just say hello, we'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-brand-slate dark:text-white mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-brand-red shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">hello@jaystarbliss.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-brand-red shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Call Us</h3>
                    <p className="text-gray-600 dark:text-gray-400">+234 (0) 123 456 7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-brand-red shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Our Office</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 Innovation Drive<br/>Tech District, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">Thank you for reaching out. We will get back to you shortly.</p>
                  <button onClick={() => setSuccess(false)} className="bg-brand-slate text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">There was an error sending your message. Please try again.</div>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red" placeholder="jane@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Inquiry Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red bg-white dark:bg-slate-900 dark:border-slate-800">
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Project Request">Project Request</option>
                      <option value="Tutoring Program">Tutoring Program</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red" placeholder="How can we help you?"></textarea>
                  </div>
                  
                  <button type="submit" disabled={loading} className="w-full bg-brand-red text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default Contact;
