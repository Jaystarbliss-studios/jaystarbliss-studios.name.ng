import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { CheckCircle2, MapPin, Mail, Phone } from 'lucide-react';
import { Card } from '../components/ui/Card';
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

      <div className="py-20 bg-brand-neutral dark:bg-slate-900 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-brand-slate dark:text-white mb-8 tracking-tight">Contact Information</h2>
              <div className="space-y-8">
                <Card className="flex items-start gap-4 p-6 shadow-sm">
                  <div className="w-12 h-12 bg-red-50 dark:bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-slate dark:text-white mb-1">Email Us</h3>
                    <p className="text-brand-slate/70 dark:text-gray-400 font-medium">hello@jaystarbliss.com</p>
                  </div>
                </Card>

                <Card className="flex items-start gap-4 p-6 shadow-sm">
                  <div className="w-12 h-12 bg-red-50 dark:bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-slate dark:text-white mb-1">Call Us</h3>
                    <p className="text-brand-slate/70 dark:text-gray-400 font-medium">+234 (0) 123 456 7890</p>
                  </div>
                </Card>

                <Card className="flex items-start gap-4 p-6 shadow-sm">
                  <div className="w-12 h-12 bg-red-50 dark:bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-slate dark:text-white mb-1">Our Office</h3>
                    <p className="text-brand-slate/70 dark:text-gray-400 font-medium">123 Innovation Drive<br/>Tech District, Lagos, Nigeria</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Form */}
            <Card className="p-8 md:p-12 shadow-xl border-0 ring-1 ring-slate-200 dark:ring-slate-800">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-slate dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-brand-slate/70 dark:text-gray-400 mb-8 font-medium">Thank you for reaching out. We will get back to you shortly.</p>
                  <Button onClick={() => setSuccess(false)} variant="secondary" fullWidth size="lg">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold">There was an error sending your message. Please try again.</div>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Full Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-brand-slate dark:text-white font-medium" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-brand-slate dark:text-white font-medium" placeholder="jane@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Inquiry Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-brand-slate dark:text-white font-medium">
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Project Request">Project Request</option>
                      <option value="Tutoring Program">Tutoring Program</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-brand-slate dark:text-white tracking-wide">Message</label>
                    <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red text-brand-slate dark:text-white font-medium resize-none" placeholder="How can we help you?"></textarea>
                  </div>
                  
                  <Button type="submit" isLoading={loading} fullWidth size="lg" className="shadow-lg shadow-brand-red/20 uppercase tracking-widest">
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
