import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { 
  GraduationCap, 
  Laptop, 
  Palette, 
  Music, 
  FileText, 
  Users, 
  School, 
  BookOpen, 
  Search, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CategoryMeta {
  label: string;
  IconComponent: React.FC<{ size?: number; className?: string }>;
  description: string;
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  ALL_PROGRAMS: { 
    label: 'All Tracks', 
    IconComponent: Layers, 
    description: 'Explore our complete ecosystem of foundational academics, digital technology, creative arts, and school STEM clubs.' 
  },
  ACADEMICS: { 
    label: 'Academics', 
    IconComponent: GraduationCap, 
    description: 'Core foundational subjects taught with deep understanding, reasoning, and practical application.' 
  },
  DIGITAL_AND_TECHNOLOGY: { 
    label: 'Digital & Tech', 
    IconComponent: Laptop, 
    description: 'Scratch game coding, web development, Python, AI literacy, and robotic engineering.' 
  },
  CREATIVE: { 
    label: 'Creative Arts', 
    IconComponent: Palette, 
    description: 'Graphic design, branding, digital illustration, and visual media communication.' 
  },
  MUSIC: { 
    label: 'Music', 
    IconComponent: Music, 
    description: 'Piano keyboards, violin, recorder, vocal training, and music theory.' 
  },
  EXAM_PREPARATION: { 
    label: 'Exam Prep', 
    IconComponent: FileText, 
    description: 'High-yield preparation for WAEC, NECO, JAMB, Cambridge Checkpoint, and IGCSE.' 
  },
  PERSONALIZED_LEARNING: { 
    label: 'Private Tutoring', 
    IconComponent: Users, 
    description: 'One-on-one tailored academic mentorship and accelerated learning roadmaps.' 
  },
  SCHOOL_PROGRAMS: { 
    label: 'School STEM Clubs', 
    IconComponent: School, 
    description: 'Curriculum-aligned Smart Tech, Coding, and Robotics clubs designed for partner schools.' 
  }
};

const CATEGORY_ORDER = [
  'ALL_PROGRAMS',
  'ACADEMICS', 
  'DIGITAL_AND_TECHNOLOGY', 
  'CREATIVE', 
  'MUSIC', 
  'EXAM_PREPARATION', 
  'PERSONALIZED_LEARNING', 
  'SCHOOL_PROGRAMS'
];

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPrograms = programs.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || (p.categoryId || 'ACADEMICS') === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.targetAudience?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const groupedPrograms = filteredPrograms.reduce((acc, program) => {
    const cat = program.categoryId || 'ACADEMICS';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(program);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <MainLayout>
      <SEO 
        title="Programs & Learning Tracks" 
        description="Explore our ecosystem of educational, coding, robotics, and creative programs for kids, teens, and schools." 
      />

      {/* Hero Header */}
      <div className="bg-brand-slate text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
              Ecosystem of Learning Programs
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              From foundational sciences to full-stack coding, AI literacy, and creative arts. Find the ideal roadmap for yourself, your child, or your school.
            </p>
          </div>
        </div>
      </div>
      
      {/* Streamlined Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 sticky top-[52px] sm:top-[64px] z-30 shadow-xs w-full max-w-full">
        <div className="container mx-auto px-4 max-w-7xl py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-full">
            
            {/* Category Pills */}
            <div className="flex overflow-x-auto w-full md:w-auto pb-1 md:pb-0 gap-2 hide-scrollbar items-center max-w-full">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedCategory === 'ALL' 
                    ? 'bg-brand-red text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Layers size={14} />
                <span>All Programs</span>
              </button>

              {CATEGORY_ORDER.filter(c => c !== 'ALL_PROGRAMS').map(catKey => {
                const meta = CATEGORY_MAP[catKey];
                const Icon = meta.IconComponent;
                const isActive = selectedCategory === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(catKey)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'bg-brand-red text-white shadow-sm' 
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Program Listings */}
      <div className="py-14 md:py-20 bg-brand-neutral dark:bg-slate-900 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : filteredPrograms.length === 0 ? (
            <EmptyState 
              title="No Programs Match Your Criteria" 
              description={selectedCategory === 'ALL' ? "We are currently updating our program tracks. Please check back soon or reach out for custom tutoring." : `No programs found under this track. Try changing your search or filter.`}
            />
          ) : (
            <div className="space-y-16">
              {CATEGORY_ORDER.filter(c => c !== 'ALL_PROGRAMS').map(categoryId => {
                const catPrograms = groupedPrograms[categoryId];
                if (!catPrograms || catPrograms.length === 0) return null;
                const catInfo = CATEGORY_MAP[categoryId] || { label: categoryId, IconComponent: BookOpen, description: '' };
                const Icon = catInfo.IconComponent;
                
                return (
                  <div key={categoryId} id={categoryId.toLowerCase()} className="space-y-6">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-brand-red/10 text-brand-red">
                          <Icon size={22} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold text-brand-slate dark:text-white">
                            {catInfo.label}
                          </h2>
                          {catInfo.description && (
                            <p className="text-xs md:text-sm text-brand-slate/70 dark:text-gray-400 mt-0.5">
                              {catInfo.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catPrograms.map((program: any) => (
                        <Card key={program.id} hoverEffect className="flex flex-col group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                          <CardContent className="p-6 md:p-7 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold text-brand-slate dark:text-white mb-3 leading-snug group-hover:text-brand-red transition-colors">
                              {program.title}
                            </h3>
                            <p className="text-xs md:text-sm text-brand-slate/70 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                              {program.shortDescription || (program.longDescription ? program.longDescription.substring(0, 120) + '...' : '')}
                            </p>
                            
                            <div className="space-y-2 text-xs text-brand-slate/70 dark:text-gray-400 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                              {program.targetAudience && (
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-brand-slate dark:text-slate-300">Audience:</span> 
                                  <span className="capitalize">{program.targetAudience.replace(/_/g, ' ')}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-brand-slate dark:text-slate-300">Format:</span> 
                                <span>{program.deliveryFormat === 'ONLINE' ? 'Online' : program.deliveryFormat === 'PHYSICAL' ? 'In-Person' : 'Hybrid'}</span>
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="p-6 pt-0 flex items-center justify-between mt-auto">
                            <span className="font-black text-brand-slate dark:text-white text-base">
                              {program.pricing && program.pricing.trim() !== '' ? program.pricing : 'Contact Us'}
                            </span>
                            <Button to={`/programs/${program.slug || program.id}`} variant="secondary" size="sm" className="font-bold text-xs uppercase tracking-wider">
                              VIEW DETAILS <ArrowRight size={14} className="ml-1" />
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
