import React, { useState, useEffect } from 'react';
import { Monitor, Paintbrush, Database, Globe, Briefcase, Cpu, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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

const FeaturedServices: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const q = query(
          collection(db, 'services'),
          where('status', '==', 'PUBLISHED'),
          where('isFeatured', '==', true),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching featured services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedServices();
  }, []);

  return (
    <section className="py-24 bg-brand-slate text-white border-t border-brand-slate">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">NEED SOMETHING BUILT OR DESIGNED?</h2>
          <p className="text-xl text-brand-neutral/70 font-medium mb-10">
            If you already have an idea, a business, a school project or simply a problem that needs solving, let's talk about it.
          </p>
          <Link to="/services" className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-xl font-bold hover:-translate-y-1 transition-transform shadow-lg shadow-brand-red/20 uppercase">
            EXPLORE SERVICES
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-red w-10 h-10" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 dark:border-slate-800/5 rounded-2xl border border-white/10 text-white/50">
            <p>No featured services currently available. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-slate-900 dark:border-slate-800/5 border border-white/10 p-10 rounded-2xl hover:bg-white dark:bg-slate-900 dark:border-slate-800/10 transition-colors group flex flex-col">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 dark:border-slate-800/10 rounded-xl flex items-center justify-center mb-8 text-brand-red group-hover:scale-110 transition-transform">
                  {getIconComponent(service.iconName || 'Monitor')}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-brand-neutral/70 font-medium leading-relaxed mb-10 flex-grow">
                  {service.shortDescription}
                </p>
                <Link to={`/services/${service.slug}`} className="text-brand-red font-bold text-sm uppercase tracking-wider hover:text-white transition-colors mt-auto inline-block">
                  VIEW {service.title.toUpperCase()} &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default FeaturedServices;
