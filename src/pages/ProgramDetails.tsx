import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Loader2, ArrowLeft } from 'lucide-react';

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
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProgram();
  }, [slug]);

  if (loading) return <MainLayout><div className="py-32 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-red" /></div></MainLayout>;
  
  if (error || !program) return (
    <MainLayout>
      <div className="py-32 text-center container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">The program you are looking for does not exist or is no longer available.</p>
        <Link to="/" className="text-brand-red font-bold flex items-center justify-center gap-2 hover:underline"><ArrowLeft size={20} /> Back to Home</Link>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/#programs" className="text-white/70 hover:text-white inline-flex items-center gap-2 mb-8 text-sm"><ArrowLeft size={16} /> Back</Link>
          <div className="inline-block px-3 py-1 bg-white dark:bg-slate-900 dark:border-slate-800/10 text-brand-red text-xs font-bold uppercase tracking-wider rounded-full mb-6">
            {program.categoryId || 'General'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{program.title}</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed mb-10">
            {program.shortDescription}
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link to="/register" className="relative inline-flex overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-xl shadow-brand-red/20 group">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#B91C1C_0%,#F8FAFC_50%,#B91C1C_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-brand-slate px-8 py-4 font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-brand-red/90">
                Enroll Now
              </span>
            </Link>
            <div className="text-lg">
              <span className="text-white/60">Price:</span> <span className="font-bold">{program.pricing || 'Contact for pricing'}</span>
            </div>
            <div className="text-lg">
              <span className="text-white/60">Format:</span> <span className="font-bold">{program.deliveryFormat || 'ONLINE'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-20 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-brand-slate dark:text-white mb-8">About This Program</h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            {program.longDescription ? (
              <div className="whitespace-pre-line">{program.longDescription}</div>
            ) : (
              <p>Detailed curriculum and description coming soon. Please contact us for more information.</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default ProgramDetails;
