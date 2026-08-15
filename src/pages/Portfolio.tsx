import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

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
      
      <div className="py-24 bg-brand-neutral dark:bg-slate-900 dark:border-slate-800 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState 
              title="No Projects Found" 
              description="We are currently curating our portfolio of client and student work. Please check back soon."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map((project) => (
                <Card key={project.id} hoverEffect className="flex flex-col group overflow-hidden border-0 ring-1 ring-slate-200 dark:ring-slate-800">
                  {/* Visual placeholder for a project thumbnail */}
                  <div className="h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-b border-slate-200 dark:border-slate-700 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-slate/5 to-transparent"></div>
                    <span className="font-bold text-brand-slate/20 dark:text-white/20 text-4xl tracking-widest uppercase">{project.title.substring(0, 2)}</span>
                  </div>
                  
                  <CardContent className="p-10 flex-grow flex flex-col bg-white dark:bg-slate-950">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <Badge variant="brand" className="mb-4">
                          {project.category || 'Project'}
                        </Badge>
                        <h3 className="text-2xl font-bold text-brand-slate dark:text-white leading-tight">{project.title}</h3>
                      </div>
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-brand-slate/50 dark:text-gray-400 hover:bg-brand-red hover:text-white transition-colors shrink-0 shadow-sm border border-slate-100 dark:border-slate-800">
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                    
                    {project.portfolioType === 'STUDENT_WORK' ? (
                      <div className="text-sm text-brand-slate/60 dark:text-gray-400 mb-6 font-bold uppercase tracking-wider">
                        Student Work: {project.studentName || 'Academy Student'}
                      </div>
                    ) : project.client ? (
                      <div className="text-sm text-brand-slate/60 dark:text-gray-400 mb-6 font-bold uppercase tracking-wider">
                        Client: {project.client}
                      </div>
                    ) : null}
                    
                    <p className="text-brand-slate/70 dark:text-gray-400 leading-relaxed font-medium">
                      {project.description}
                    </p>
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

export default Portfolio;
