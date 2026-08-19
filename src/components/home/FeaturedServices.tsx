import React, { useState, useEffect } from 'react';
import { Monitor, Paintbrush, Database, Globe, Briefcase, Cpu, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { stockImages } from '../../lib/stockImages';
import { StaggerGroup, Reveal } from '../ui/Reveal';
import { staggerItem } from '../ui/animationVariants';
import { motion } from 'framer-motion';

const getIconComponent = (iconName: string) => {
  const normalizedName = (iconName || "Monitor").toLowerCase();
  const lowerIcons: Record<string, React.ReactNode> = {
    monitor: <Monitor size={22} />,
    database: <Database size={22} />,
    paintbrush: <Paintbrush size={22} />,
    briefcase: <Briefcase size={22} />,
    globe: <Globe size={22} />,
    cpu: <Cpu size={22} />
  };
  return lowerIcons[normalizedName] || <Monitor size={22} />;
};

const getServiceImage = (iconName: string) => {
  const normalizedName = (iconName || "Monitor").toLowerCase();
  const map: Record<string, string> = {
    monitor: stockImages.webDev,
    database: stockImages.database,
    paintbrush: stockImages.design,
    briefcase: stockImages.consulting,
    globe: stockImages.global,
    cpu: stockImages.tech,
  };
  return map[normalizedName] || stockImages.webDev;
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
    <section className="py-24 bg-brand-slate text-white border-t border-brand-slate relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">NEED SOMETHING BUILT OR DESIGNED?</h2>
          <p className="text-xl text-brand-neutral/70 font-medium mb-10">
            If you already have an idea, a business, a school project or simply a problem that needs solving, let's talk about it.
          </p>
          <Link to="/services" className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-xl font-bold hover:-translate-y-1 transition-transform shadow-lg shadow-brand-red/20 uppercase">
            EXPLORE SERVICES
          </Link>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-red w-10 h-10" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 text-white/50">
            <p>No featured services currently available. Please check back later.</p>
          </div>
        ) : (
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div key={service.id} variants={staggerItem}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group relative flex flex-col justify-end h-[340px] rounded-2xl overflow-hidden border border-white/10"
                >
                  <img
                    src={getServiceImage(service.iconName)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-slate via-brand-slate/75 to-brand-slate/20" />

                  <div className="relative z-10 p-8">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl flex items-center justify-center mb-6 text-white">
                      {getIconComponent(service.iconName || 'Monitor')}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-brand-neutral/70 font-medium leading-relaxed text-sm mb-4 line-clamp-2">
                      {service.shortDescription}
                    </p>
                    <span className="text-brand-red font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2">
                      VIEW {service.title.toUpperCase()}
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
};
export default FeaturedServices;
