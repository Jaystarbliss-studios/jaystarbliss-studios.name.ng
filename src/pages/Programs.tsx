import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const q = query(collection(db, 'programs'), where('status', '==', 'PUBLISHED'));
        const snapshot = await getDocs(q);
        setPrograms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Academic & Digital Programs</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Master practical skills with outcome-driven courses designed for real-world impact.
          </p>
        </div>
      </div>

      <div className="py-24 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-brand-red w-12 h-12" />
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No programs currently available. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div key={program.id} className="flex flex-col bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="p-8 flex-grow">
                    <span className="inline-block px-3 py-1 bg-white dark:bg-slate-900 dark:border-slate-800 text-brand-slate dark:text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6 shadow-sm border border-gray-100">
                      {program.categoryId || 'General'}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-brand-red transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {program.shortDescription}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold w-20 text-gray-700">Format:</span> {program.deliveryFormat || 'ONLINE'}
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-slate-900 dark:border-slate-800 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{program.pricing || 'TBD'}</span>
                    <Link to={`/programs/${program.slug}`} className="bg-brand-slate text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                      VIEW DETAILS
                    </Link>
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
export default Programs;
