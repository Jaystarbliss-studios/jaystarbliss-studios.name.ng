const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const CATEGORY_MAP: Record<string, { label: string, icon: string, description: string }> = {
  ACADEMICS: { label: 'Academics', icon: '🎓', description: 'Core subjects taught with understanding and practical application.' },
  DIGITAL_AND_TECHNOLOGY: { label: 'Digital & Technology', icon: '💻', description: 'Programming, web development, AI, and digital literacy.' },
  CREATIVE: { label: 'Creative', icon: '🎨', description: 'Graphic design, digital art, branding, and visual communication.' },
  MUSIC: { label: 'Music', icon: '🎵', description: 'Keyboard, violin, recorder, and music theory.' },
  EXAM_PREPARATION: { label: 'Exam Preparation', icon: '📝', description: 'Targeted preparation for WAEC, NECO, JAMB, and school exams.' },
  PERSONALIZED_LEARNING: { label: 'Personalized Learning', icon: '👨‍🏫', description: 'Private tutoring and custom learning plans.' },
  SCHOOL_PROGRAMS: { label: 'School Programs & Clubs', icon: '🏫', description: 'Smart Tech, Coding, and Creative clubs designed for schools.' }
};

const CATEGORY_ORDER = [
  'ACADEMICS', 'DIGITAL_AND_TECHNOLOGY', 'CREATIVE', 'MUSIC', 
  'EXAM_PREPARATION', 'PERSONALIZED_LEARNING', 'SCHOOL_PROGRAMS'
];

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

  const groupedPrograms = programs.reduce((acc, program) => {
    const cat = program.categoryId || 'ACADEMICS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(program);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Ecosystem of Programs</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            From foundational academics to advanced digital skills and creative arts. 
            Find the right learning path for you, your child, or your school.
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
            <div className="space-y-24">
              {CATEGORY_ORDER.map(categoryId => {
                const catPrograms = groupedPrograms[categoryId];
                if (!catPrograms || catPrograms.length === 0) return null;
                const catInfo = CATEGORY_MAP[categoryId] || { label: categoryId, icon: '📚', description: '' };
                
                return (
                  <div key={categoryId} id={categoryId.toLowerCase()}>
                    <div className="mb-12 border-b border-gray-100 dark:border-slate-800 pb-6">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-slate dark:text-white flex items-center gap-4">
                        <span>{catInfo.icon}</span> {catInfo.label}
                      </h2>
                      {catInfo.description && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl">
                          {catInfo.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {catPrograms.map((program) => (
                        <div key={program.id} className="flex flex-col bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow group">
                          <div className="p-8 flex-grow">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-brand-red transition-colors">
                              {program.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                              {program.shortDescription || program.longDescription?.substring(0, 100) + '...'}
                            </p>
                            
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                              {program.targetAudience && (
                                <div className="flex items-center">
                                  <span className="font-semibold w-20 text-gray-900 dark:text-white">For:</span> 
                                  {program.targetAudience}
                                </div>
                              )}
                              <div className="flex items-center">
                                <span className="font-semibold w-20 text-gray-900 dark:text-white">Format:</span> 
                                {program.deliveryFormat === 'ONLINE' ? 'Online' : program.deliveryFormat === 'PHYSICAL' ? 'In-Person' : 'Hybrid'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6 bg-white dark:bg-slate-900 dark:border-slate-800 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                            <span className="font-bold text-gray-900 dark:text-white text-lg">
                              {program.pricing && program.pricing.trim() !== '' ? program.pricing : 'Contact Us'}
                            </span>
                            <Link to={`/programs/${program.slug}`} className="bg-brand-slate dark:bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-red-700 transition-colors">
                              VIEW DETAILS
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Programs;
`;

fs.writeFileSync('src/pages/Programs.tsx', content);
console.log('Programs.tsx rewritten');
