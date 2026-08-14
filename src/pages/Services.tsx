import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Loader2, Monitor, Paintbrush, Database, Globe, Briefcase, Cpu } from 'lucide-react';

const getIconComponent = (iconName: string) => {
  const normalizedName = (iconName || "Monitor").toLowerCase();
  const lowerIcons: Record<string, React.ReactNode> = { 
    monitor: <Monitor size={24} />, 
    database: <Database size={24} />, 
    paintbrush: <Paintbrush size={24} />, 
    briefcase: <Briefcase size={24} />, 
    globe: <Globe size={24} />, 
    cpu: <Cpu size={24} /> 
  };
  return lowerIcons[normalizedName] || <Monitor size={24} />;
};

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('status', '==', 'PUBLISHED'));
        const snapshot = await getDocs(q);
        setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Professional technology and creative services designed to elevate your brand and scale your digital presence.
          </p>
        </div>
      </div>

      <div className="py-24 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-red w-12 h-12" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No services currently available. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white dark:bg-slate-900 dark:border-slate-800 border border-gray-100 p-8 rounded-2xl hover:shadow-xl hover:shadow-brand-slate/5 transition-all group flex flex-col">
                  <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 text-brand-red group-hover:scale-110 transition-transform">
                    {getIconComponent(service.iconName)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow">
                    {service.shortDescription}
                  </p>
                  <Link to={`/services/${service.slug}`} className="text-brand-red font-bold uppercase tracking-wide text-sm hover:text-red-700 transition-colors inline-flex items-center gap-2 mt-auto">
                    Learn More &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
export default Services;
