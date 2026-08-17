import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { autoSeedCollectionsIfEmpty, defaultOrganisationProjects } from '../lib/seedFirestore';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { 
  ExternalLink, 
  Gamepad2, 
  Briefcase, 
  Sparkles, 
  X, 
  Search,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import KidsGallery from '../components/kids/KidsGallery';

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'KIDS_CORNER' | 'ORGANISATION'>('KIDS_CORNER');
  const [orgProjects, setOrgProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgSearchQuery, setOrgSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrgProjects = async () => {
      try {
        await autoSeedCollectionsIfEmpty();
        const q = query(collection(db, 'portfolio'), where('status', '==', 'PUBLISHED'));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const orgList = docs.filter((p: any) => p.portfolioType === 'CLIENT_WORK' || p.portfolioType === 'ORGANISATION' || !p.portfolioType);
        setOrgProjects(docs.length > 0 ? (orgList.length > 0 ? orgList : docs) : defaultOrganisationProjects);
      } catch (error) {
        console.error('Error fetching organisation portfolio:', error);
        setOrgProjects(defaultOrganisationProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgProjects();
  }, []);

  // Filter org projects
  const filteredOrgProjects = orgProjects.filter(p => {
    const matchesSearch = !orgSearchQuery || 
      p.title?.toLowerCase().includes(orgSearchQuery.toLowerCase()) || 
      p.client?.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(orgSearchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <MainLayout>
      <SEO 
        title="Portfolio & Kids Corner" 
        description="Explore client platforms, enterprise solutions, and our vibrant Kids Game Zone showcasing young coders' interactive Scratch & web projects." 
      />

      {/* Header Banner */}
      <div className="bg-brand-slate text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
              Our Work & Showcase
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Explore custom digital platforms built for organizations alongside interactive arcade games engineered by our junior student coders.
            </p>
          </div>

          {/* 3 Interactive Unfolding Banner Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            
            {/* Tab 1: Kids Corner & Arcade */}
            <div
              onClick={() => setActiveTab('KIDS_CORNER')}
              className={`cursor-pointer rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden group border ${
                activeTab === 'KIDS_CORNER'
                  ? 'bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl transition-colors ${
                  activeTab === 'KIDS_CORNER' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white/10 text-amber-400 group-hover:bg-amber-500/20'
                }`}>
                  <Gamepad2 size={24} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  activeTab === 'KIDS_CORNER' ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white/60 group-hover:text-amber-300'
                }`}>
                  {activeTab === 'KIDS_CORNER' ? 'Active Zone' : 'Explore'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                <span>Kids Corner & Arcade</span>
                <ChevronRight size={16} className={`transition-transform duration-200 ${activeTab === 'KIDS_CORNER' ? 'translate-x-1 text-amber-400' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Play real Scratch & web games created by our young tech students with full arcade controls.
              </p>
            </div>

            {/* Tab 2: Organisation Featured Projects */}
            <div
              onClick={() => setActiveTab('ORGANISATION')}
              className={`cursor-pointer rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden group border ${
                activeTab === 'ORGANISATION'
                  ? 'bg-gradient-to-br from-brand-red/25 via-red-950/20 to-transparent border-brand-red/60 shadow-lg shadow-brand-red/10 ring-1 ring-brand-red/40'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-brand-red/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl transition-colors ${
                  activeTab === 'ORGANISATION' ? 'bg-brand-red text-white shadow-md' : 'bg-white/10 text-red-400 group-hover:bg-brand-red/20'
                }`}>
                  <Briefcase size={24} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  activeTab === 'ORGANISATION' ? 'bg-brand-red text-white' : 'bg-white/10 text-white/60 group-hover:text-red-300'
                }`}>
                  {activeTab === 'ORGANISATION' ? 'Active Case Studies' : 'Explore'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-300 transition-colors flex items-center gap-2">
                <span>Organisation Solutions</span>
                <ChevronRight size={16} className={`transition-transform duration-200 ${activeTab === 'ORGANISATION' ? 'translate-x-1 text-brand-red' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Enterprise EdTech portals, assessment suites, and hardware workshop toolkits.
              </p>
            </div>

            {/* Tab 3: Magic 3D Particles */}
            <Link
              to="/magic-particles"
              className="rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden group border bg-white/5 hover:bg-gradient-to-br hover:from-cyan-500/20 hover:to-blue-600/10 border-white/10 hover:border-cyan-400/60 shadow-sm hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-xl bg-white/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <Sparkles size={24} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                  Interactive Lab
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                <span>Magic 3D Particles</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-cyan-400" />
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Control 5,500+ glowing 3D particles with real-time mouse, touch, and webcam gesture physics.
              </p>
            </Link>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-14 md:py-20 bg-brand-neutral dark:bg-slate-900 min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* TAB 1: KIDS CORNER & INTERACTIVE GAME ZONE */}
          {activeTab === 'KIDS_CORNER' && (
            <KidsGallery showHeroBanner={true} />
          )}

          {/* TAB 2: ORGANISATION FEATURED PROJECTS */}
          {activeTab === 'ORGANISATION' && (
            <div className="space-y-10">
              
              {/* Search Bar for Organisation Projects */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-950 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search organisation projects..."
                    value={orgSearchQuery}
                    onChange={(e) => setOrgSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                  {orgSearchQuery && (
                    <button onClick={() => setOrgSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Showing {filteredOrgProjects.length} client & institutional platforms
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Organisation & Client Projects ({filteredOrgProjects.length})
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Enterprise web platforms, school digital systems, and tech consulting solutions.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
                </div>
              ) : filteredOrgProjects.length === 0 ? (
                <EmptyState 
                  title="No Organisation Projects Found"
                  description="We are currently curating our case studies. Check back soon or contact us for a demo."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredOrgProjects.map((project) => (
                    <Card key={project.id} hoverEffect className="flex flex-col group overflow-hidden border-0 ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-950">
                      {project.featuredImage ? (
                        <div className="h-64 w-full relative border-b border-slate-200 dark:border-slate-700 overflow-hidden">
                          <img 
                            src={project.featuredImage} 
                            alt={project.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      ) : (
                        <div className="h-56 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center border-b border-slate-200 dark:border-slate-700 relative p-8">
                          <div className="text-center">
                            <span className="font-bold text-white/20 text-5xl tracking-widest uppercase block mb-2">
                              {project.title.substring(0, 3)}
                            </span>
                            <span className="text-xs font-mono text-brand-red uppercase tracking-widest">
                              {project.category || 'Enterprise Solution'}
                            </span>
                          </div>
                        </div>
                      )}

                      <CardContent className="p-6 md:p-8 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Badge variant="brand" className="mb-2.5">
                              {project.category || 'Client Project'}
                            </Badge>
                            <h3 className="text-xl md:text-2xl font-bold text-brand-slate dark:text-white leading-tight">
                              {project.title}
                            </h3>
                          </div>
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-brand-slate/50 dark:text-gray-400 hover:bg-brand-red hover:text-white transition-colors shrink-0 shadow-sm border border-slate-100 dark:border-slate-800"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>

                        {project.client && (
                          <div className="text-xs text-brand-slate/60 dark:text-gray-400 mb-4 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Briefcase size={14} className="text-brand-red" />
                            <span>Client: {project.client}</span>
                          </div>
                        )}

                        <div 
                          className="text-brand-slate/70 dark:text-gray-400 text-sm leading-relaxed font-medium quill-content mb-6 flex-grow" 
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description || '') }} 
                        />

                        {project.liveUrl && (
                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-wider hover:text-red-700"
                            >
                              View Live System <ExternalLink size={14} />
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default Portfolio;
