import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { Monitor, Paintbrush, Database, Globe, Briefcase, Cpu } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

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
      <SEO title="Services" description="Professional technology and creative services designed to elevate your brand." />
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Professional technology and creative services designed to elevate your brand and scale your digital presence.
          </p>
        </div>
      </div>
      
      <div className="py-24 bg-brand-neutral dark:bg-slate-900 dark:border-slate-800 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : services.length === 0 ? (
            <EmptyState 
              title="No Services Found" 
              description="We are currently updating our professional services catalog. Please check back soon."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} hoverEffect className="flex flex-col group">
                  <CardContent className="p-10 flex flex-col flex-grow">
                    <div className="w-14 h-14 bg-red-50 dark:bg-brand-red/10 rounded-xl flex items-center justify-center mb-6 text-brand-red group-hover:scale-110 transition-transform">
                      {getIconComponent(service.iconName)}
                    </div>
                    <h3 className="text-2xl font-bold text-brand-slate dark:text-white mb-3">{service.title}</h3>
                    <p className="text-brand-slate/70 dark:text-gray-400 leading-relaxed mb-8 flex-grow">
                      {service.shortDescription}
                    </p>
                    <Button to={`/services/${service.slug}`} variant="ghost" className="mt-auto self-start text-brand-red hover:bg-brand-red/10 px-0">
                      <span className="font-bold text-sm uppercase tracking-wider">Learn More &rarr;</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;
