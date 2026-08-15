import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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

  const filteredPrograms = selectedCategory === 'ALL' 
    ? programs 
    : programs.filter(p => (p.categoryId || 'ACADEMICS') === selectedCategory);

  const groupedPrograms = filteredPrograms.reduce((acc, program) => {
    const cat = program.categoryId || 'ACADEMICS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(program);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <MainLayout>
      <SEO title="Programs" description="Explore our ecosystem of educational and tech programs." />
      <div className="bg-brand-slate text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Ecosystem of Programs</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            From foundational academics to advanced digital skills and creative arts. 
            Find the right learning path for you, your child, or your school.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 sticky top-[72px] z-30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex overflow-x-auto py-4 hide-scrollbar gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                selectedCategory === 'ALL' 
                  ? 'bg-brand-red text-white' 
                  : 'bg-white dark:bg-slate-900 text-brand-slate dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:border-brand-red dark:hover:border-brand-red hover:text-brand-red'
              }`}
            >
              All Programs
            </button>
            {CATEGORY_ORDER.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${
                  selectedCategory === cat 
                    ? 'bg-brand-red text-white' 
                    : 'bg-white dark:bg-slate-900 text-brand-slate dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:border-brand-red dark:hover:border-brand-red hover:text-brand-red'
                }`}
              >
                <span>{CATEGORY_MAP[cat]?.icon}</span>
                {CATEGORY_MAP[cat]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-brand-neutral dark:bg-slate-900 dark:border-slate-800 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : filteredPrograms.length === 0 ? (
            <EmptyState 
              title="No Programs Found" 
              description={selectedCategory === 'ALL' ? "We are currently updating our program catalog. Please check back soon." : `We don't have any published programs in the ${CATEGORY_MAP[selectedCategory]?.label} category yet.`}
            />
          ) : (
            <div className="space-y-24">
              {CATEGORY_ORDER.map(categoryId => {
                const catPrograms = groupedPrograms[categoryId];
                if (!catPrograms || catPrograms.length === 0) return null;
                const catInfo = CATEGORY_MAP[categoryId] || { label: categoryId, icon: '📚', description: '' };
                
                return (
                  <div key={categoryId} id={categoryId.toLowerCase()}>
                    <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
                      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-slate dark:text-white flex items-center gap-4">
                        <span>{catInfo.icon}</span> {catInfo.label}
                      </h2>
                      {catInfo.description && (
                        <p className="text-lg text-brand-slate/70 dark:text-gray-400 mt-4 max-w-3xl">
                          {catInfo.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {catPrograms.map((program: any) => (
                        <Card key={program.id} hoverEffect className="flex flex-col group">
                          <CardContent className="p-8 flex-grow">
                            <h3 className="text-2xl font-bold text-brand-slate dark:text-white mb-4 leading-tight group-hover:text-brand-red transition-colors">
                              {program.title}
                            </h3>
                            <p className="text-brand-slate/70 dark:text-gray-400 mb-6 line-clamp-3">
                              {program.shortDescription || (program.longDescription ? program.longDescription.substring(0, 100) + '...' : '')}
                            </p>
                            
                            <div className="space-y-2 text-sm text-brand-slate/70 dark:text-gray-400">
                              {program.targetAudience && (
                                <div className="flex items-center">
                                  <span className="font-semibold w-20 text-brand-slate dark:text-white">For:</span> 
                                  {program.targetAudience.replace('_', ' ')}
                                </div>
                              )}
                              <div className="flex items-center">
                                <span className="font-semibold w-20 text-brand-slate dark:text-white">Format:</span> 
                                {program.deliveryFormat === 'ONLINE' ? 'Online' : program.deliveryFormat === 'PHYSICAL' ? 'In-Person' : 'Hybrid'}
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="p-6 flex items-center justify-between mt-auto">
                            <span className="font-bold text-brand-slate dark:text-white text-lg">
                              {program.pricing && program.pricing.trim() !== '' ? program.pricing : 'Contact Us'}
                            </span>
                            <Button to={`/programs/${program.slug}`} variant="secondary" size="sm" className="uppercase font-bold tracking-wider">
                              VIEW DETAILS
                            </Button>
                          </CardFooter>
                        </Card>
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
