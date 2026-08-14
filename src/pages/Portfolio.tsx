import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Loader2, ExternalLink } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'portfolio'), where('status', '==', 'PUBLISHED'));
        const snapshot = await getDocs(q);
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Work</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Explore our recent projects and case studies showcasing our commitment to quality and innovation.
          </p>
        </div>
      </div>

      <div className="py-24 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-red w-12 h-12" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No portfolio projects currently available. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                  {/* Visual placeholder for a project thumbnail */}
                  <div className="h-64 bg-gray-200 flex items-center justify-center border-b border-gray-100 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-slate/10 to-brand-slate/5"></div>
                    <span className="font-bold text-gray-400 text-xl tracking-widest uppercase">{project.title.substring(0, 2)}</span>
                  </div>
                  
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-brand-red text-sm font-bold uppercase tracking-wider mb-2 block">{project.category || 'Project'}</span>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{project.title}</h3>
                      </div>
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-950 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-brand-red hover:text-white transition-colors shrink-0">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                    
                    {project.client && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Client: {project.client}</div>
                    )}
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed flex-grow">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
export default Portfolio;
