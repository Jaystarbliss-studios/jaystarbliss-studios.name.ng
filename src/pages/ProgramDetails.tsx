import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const ProgramDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const q = query(collection(db, 'programs'), where('slug', '==', slug), where('status', '==', 'PUBLISHED'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setProgram({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProgram();
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-brand-neutral dark:bg-slate-900">
          <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
        </div>
      </MainLayout>
    );
  }
  
  if (error || !program) {
    return (
      <MainLayout>
        <div className="py-32 text-center container mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-4 text-brand-slate dark:text-white">Program Not Found</h1>
          <p className="mb-8 text-slate-500 dark:text-slate-400">The program you are looking for does not exist or is no longer available.</p>
          <Button to="/programs" variant="ghost" leftIcon={<ArrowLeft size={18} />} className="text-brand-red font-bold">
            All Programs
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO 
        title={program.title} 
        description={program.shortDescription || `Explore ${program.title} at Jaystarbliss Studios.`} 
      />

      {/* Header Banner */}
      <div className="bg-brand-slate text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
          <Link to="/programs" className="text-white/70 hover:text-white inline-flex items-center gap-2 mb-6 text-xs font-bold tracking-widest uppercase">
            <ArrowLeft size={14} /> All Programs
          </Link>
          
          <div className="mb-4">
            <Badge variant="brand" className="font-bold uppercase tracking-wider px-3 py-1 bg-white text-brand-red">
              {program.categoryId ? program.categoryId.replace(/_/g, ' ') : 'General'}
            </Badge>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            {program.title}
          </h1>
          
          <p className="text-base sm:text-lg text-white/80 max-w-3xl leading-relaxed mb-10 font-normal">
            {program.shortDescription}
          </p>
          
          <div className="flex flex-wrap gap-8 items-center pt-4 border-t border-white/10">
            <Button to="/register" size="lg" className="uppercase tracking-widest font-extrabold shadow-lg shadow-brand-red/20">
              Enroll Now
            </Button>
            
            <div>
              <span className="text-white/50 text-xs block uppercase tracking-widest font-bold mb-0.5">Price</span> 
              <span className="font-extrabold text-lg text-white">{program.pricing || 'Contact for pricing'}</span>
            </div>
            
            <div>
              <span className="text-white/50 text-xs block uppercase tracking-widest font-bold mb-0.5">Format</span> 
              <span className="font-extrabold text-lg text-white">{program.deliveryFormat || 'ONLINE'}</span>
            </div>
            
            {program.targetAudience && (
              <div>
                <span className="text-white/50 text-xs block uppercase tracking-widest font-bold mb-0.5">For</span> 
                <span className="font-extrabold text-lg text-white">{program.targetAudience}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Details Section */}
      <div className="py-16 md:py-24 bg-brand-neutral dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-slate dark:text-white mb-6 tracking-tight">
              About This Program
            </h2>
            <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {program.longDescription ? (
                <div className="whitespace-pre-line leading-relaxed quill-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(program.longDescription) }} />
              ) : (
                <p>Detailed curriculum and description coming soon. Please contact us for more information.</p>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <CheckCircle2 size={16} className="text-emerald-500" /> Verifiable Certificate Included
              </div>
              <Button to="/register" size="md" className="uppercase tracking-wider font-extrabold">
                Enroll in Program
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProgramDetails;
