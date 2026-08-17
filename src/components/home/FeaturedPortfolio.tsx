import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import DOMPurify from 'dompurify';

const FeaturedPortfolio: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const q = query(
          collection(db, 'portfolio'),
          where('status', '==', 'PUBLISHED'),
          where('isFeatured', '==', true),
          limit(2)
        );
        const snapshot = await getDocs(q);
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching featured portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="brand" className="mb-6">SUCCESS STORIES</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white tracking-tight leading-[1.1]">
              PROVEN RESULTS. <br className="hidden md:block" />
              REAL IMPACT.
            </h2>
          </div>
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-brand-red font-bold hover:text-red-700 transition-colors uppercase tracking-wider text-sm shrink-0">
            VIEW ALL PROJECTS <ArrowRight size={20} />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-red w-10 h-10" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-slate-500">
            <p>We are currently curating our featured portfolio cases. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group flex flex-col bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-brand-slate/5 transition-all duration-300">
                <div className="h-64 bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-slate/5 to-transparent"></div>
                  <span className="font-bold text-brand-slate/20 dark:text-white/20 text-6xl tracking-widest uppercase group-hover:scale-110 transition-transform duration-500">
                    {project.title.substring(0, 2)}
                  </span>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-bold text-brand-red tracking-wider uppercase">
                      {project.category || 'Case Study'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                      {project.portfolioType === 'STUDENT_WORK' ? 'Academy' : 'Client Work'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-slate dark:text-white mb-4 line-clamp-2">{project.title}</h3>
                  
                  <div 
                    className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed quill-content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description) }} 
                  />
                  
                  <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-sm font-bold text-brand-slate dark:text-white">
                      {project.portfolioType === 'STUDENT_WORK' ? (
                        <>Student: <span className="text-slate-500">{project.studentName}</span></>
                      ) : (
                        <>Client: <span className="text-slate-500">{project.client}</span></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPortfolio;
