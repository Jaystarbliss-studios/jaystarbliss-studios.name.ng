import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getProgramImage } from '../../lib/stockImages';
import { StaggerGroup, staggerItem, Reveal } from '../ui/Reveal';
import { motion } from 'framer-motion';

const FeaturedPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPrograms = async () => {
      try {
        const q = query(
          collection(db, 'programs'),
          where('status', '==', 'PUBLISHED'),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const programsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching featured programs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedPrograms();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-900 dark:border-slate-800 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <Reveal className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white mb-6 tracking-tight">
            LEARN SOMETHING YOU CAN USE.
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-10">
            Our programs are designed around practical learning. You don't just
            learn the theory — you get opportunities to practise, create and
            apply what you've learned.
          </p>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 bg-brand-slate text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
          >
            VIEW ALL PROGRAMS
          </Link>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-brand-red w-10 h-10" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No featured programs currently available.</p>
          </div>
        ) : (
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program) => (
              <motion.div
                key={program.id}
                variants={staggerItem}
                className="flex flex-col bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={getProgramImage(program.categoryId)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-slate text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      {program.categoryId || 'General'}
                    </span>
                    {program.targetAudience && (
                      <span className="inline-block px-3 py-1 bg-brand-red text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                        {program.targetAudience.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-brand-red transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                    {program.shortDescription}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold w-20 text-gray-700">
                      Format:
                    </span>
                    {program.deliveryFormat || 'ONLINE'}
                  </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 dark:border-slate-800 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">
                    {program.pricing || 'Contact Us'}
                  </span>
                  <Link
                    to={`/programs/${program.slug}`}
                    className="bg-brand-slate text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors uppercase"
                  >
                    VIEW PROGRAM
                  </Link>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
};

export default FeaturedPrograms;
