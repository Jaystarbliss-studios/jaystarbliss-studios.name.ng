import DOMPurify from 'dompurify';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Loader2, ArrowLeft, CheckCircle2, Layers } from 'lucide-react';
import Button from '../components/ui/Button';

const ServiceDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const q = query(collection(db, 'services'), where('slug', '==', slug), where('status', '==', 'PUBLISHED'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setService({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchService();
  }, [slug]);

  if (loading) return <MainLayout><div className="py-32 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-red" /></div></MainLayout>;
  
  if (error || !service) return (
    <MainLayout>
      <div className="py-32 text-center container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4 text-brand-slate dark:text-white">Service Not Found</h1>
        <p className="mb-8 text-brand-slate/60 dark:text-gray-400">The service you are looking for does not exist or is no longer available.</p>
        <Button to="/services" variant="ghost" leftIcon={<ArrowLeft size={20} />} className="text-brand-red font-bold">
          Back to Services
        </Button>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      {/* Premium Hero Section */}
      <div className="bg-brand-slate text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Link to="/services" className="text-white/60 hover:text-white inline-flex items-center gap-2 mb-8 text-sm font-semibold tracking-wide transition-colors uppercase">
            <ArrowLeft size={16} /> BACK TO SERVICES
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">{service.title}</h1>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-10">
                {service.shortDescription}
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button to="/contact" variant="primary" size="lg" className="uppercase tracking-widest shadow-lg shadow-brand-red/20">
                  REQUEST SERVICE
                </Button>
                <a href="#details" className="text-white/70 hover:text-white px-6 py-4 font-semibold transition-colors uppercase tracking-wider text-sm">
                  Explore Details
                </a>
              </div>
            </div>
            
            {/* Dynamic visual representation of the service */}
            <div className="hidden lg:flex justify-end"> 
               <div className="w-full max-w-md aspect-square bg-white/5 border border-white/10 rounded-3xl p-8 relative flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-transparent opacity-20 rounded-3xl"></div>
                  <Layers className="w-32 h-32 text-brand-red/40 mb-6" />
                  <div className="text-center relative z-10">
                    <div className="text-2xl font-bold text-white mb-2">Professional Execution</div>
                    <div className="text-white/50 font-medium">Built to modern standards</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview & Content Section */}
      <div id="details" className="py-24 bg-brand-neutral dark:bg-slate-900 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-bold text-brand-slate dark:text-white mb-8">Service Overview</h2>
              <div className="prose prose-lg max-w-none text-brand-slate/70 dark:text-gray-400 prose-headings:text-brand-slate dark:text-white prose-a:text-brand-red">
                {service.content ? (
                  <div className="whitespace-pre-line leading-relaxed quill-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.content) }} />
                ) : (
                  <p>Details about this service are being updated. Our team works closely with you to understand your specific needs, plan the execution, and deliver high-quality results. Contact us to learn more about how we can help with {service.title}.</p>
                )}
              </div>
              
              {/* Universal "How We Work" block dynamically adapting to any service */}
              <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-16"> 
                 <h2 className="text-3xl font-bold text-brand-slate dark:text-white mb-10">How We Execute</h2>
                 <div className="space-y-8">
                   <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center text-brand-red font-bold shrink-0 shadow-sm border border-slate-100">01</div>
                     <div>
                       <h3 className="text-xl font-bold text-brand-slate dark:text-white mb-2">Understand & Plan</h3>
                       <p className="text-brand-slate/70 dark:text-gray-400">We start by understanding exactly what you're trying to achieve, mapping out the requirements, and defining success criteria.</p>
                     </div>
                   </div>
                   <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center text-brand-red font-bold shrink-0 shadow-sm border border-slate-100">02</div>
                     <div>
                       <h3 className="text-xl font-bold text-brand-slate dark:text-white mb-2">Design & Build</h3>
                       <p className="text-brand-slate/70 dark:text-gray-400">Our experts execute the work, keeping you in the loop with regular updates and ensuring quality at every step.</p>
                     </div>
                   </div>
                   <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center text-brand-red font-bold shrink-0 shadow-sm border border-slate-100">03</div>
                     <div>
                       <h3 className="text-xl font-bold text-brand-slate dark:text-white mb-2">Review & Launch</h3>
                       <p className="text-brand-slate/70 dark:text-gray-400">We test thoroughly, gather your final feedback, and successfully launch or hand over the completed project.</p>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 bg-white dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold text-brand-slate dark:text-white mb-6">Ready to start?</h3>
                <p className="text-brand-slate/70 dark:text-gray-400 mb-8">
                  Get in touch with us to discuss your requirements, timeline, and pricing for this service.
                </p>
                <Button to="/contact" className="w-full justify-center shadow-lg" size="lg">
                  REQUEST A QUOTE
                </Button>
                <ul className="space-y-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-3 text-sm text-brand-slate/70 dark:text-gray-400 font-bold tracking-wide">
                    <CheckCircle2 className="text-brand-red w-5 h-5" /> PROFESSIONAL QUALITY
                  </li>
                  <li className="flex items-center gap-3 text-sm text-brand-slate/70 dark:text-gray-400 font-bold tracking-wide">
                    <CheckCircle2 className="text-brand-red w-5 h-5" /> DEDICATED SUPPORT
                  </li>
                  <li className="flex items-center gap-3 text-sm text-brand-slate/70 dark:text-gray-400 font-bold tracking-wide">
                    <CheckCircle2 className="text-brand-red w-5 h-5" /> TRANSPARENT PROCESS
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServiceDetails;
