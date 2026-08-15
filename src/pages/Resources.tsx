import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { BookOpen, FileText, HelpCircle, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';


const Resources: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            RESOURCES & INSIGHTS
          </h1>
          <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto">
            Tools, articles, and answers to help you learn, build, and grow with Jaystarbliss.
          </p>
        </div>
      </div>

      <div className="py-24 bg-brand-neutral dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <Link to="/faq" className="group">
              <Card hoverEffect className="h-full border-0 ring-1 ring-slate-200 dark:ring-slate-800">
                <CardContent className="p-10 flex flex-col h-full items-start">
                  <div className="w-16 h-16 bg-red-50 dark:bg-brand-red/10 text-brand-red rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <HelpCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-slate dark:text-white mb-4">FAQ</h2>
                  <p className="text-brand-slate/70 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                    Find answers to common questions about our educational programs, digital services, timelines, and how we collaborate.
                  </p>
                  <span className="text-brand-red font-bold text-sm uppercase tracking-wider group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors mt-auto">
                    VIEW FAQs &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Link to="/blog" className="group">
              <Card hoverEffect className="h-full border-0 ring-1 ring-slate-200 dark:ring-slate-800">
                <CardContent className="p-10 flex flex-col h-full items-start">
                  <div className="w-16 h-16 bg-red-50 dark:bg-brand-red/10 text-brand-red rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <PenTool size={32} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-brand-slate dark:text-white">Blog</h2>
                    
                  </div>
                  <p className="text-brand-slate/70 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                    Articles, case studies, and insights on education, technology, and creativity. Read our thoughts on building better digital experiences.
                  </p>
                  <span className="text-brand-red font-bold text-sm uppercase tracking-wider group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors mt-auto">
                    VIEW POSTS &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Link to="#" className="group opacity-75">
              <Card hoverEffect className="h-full border-0 ring-1 ring-slate-200 dark:ring-slate-800">
                <CardContent className="p-10 flex flex-col h-full items-start">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-brand-slate/40 dark:text-gray-400 rounded-xl flex items-center justify-center mb-8">
                    <FileText size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-slate dark:text-white mb-4">Privacy Policy</h2>
                  <p className="text-brand-slate/70 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                    Learn how we collect, use, and protect your personal information when you use our services or enroll in our programs.
                  </p>
                  <span className="text-brand-slate/40 dark:text-gray-500 font-bold text-sm uppercase tracking-wider mt-auto">
                    VIEW POLICY
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Link to="#" className="group opacity-75">
              <Card hoverEffect className="h-full border-0 ring-1 ring-slate-200 dark:ring-slate-800">
                <CardContent className="p-10 flex flex-col h-full items-start">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-brand-slate/40 dark:text-gray-400 rounded-xl flex items-center justify-center mb-8">
                    <BookOpen size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-slate dark:text-white mb-4">Terms of Service</h2>
                  <p className="text-brand-slate/70 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                    Read the terms and conditions that govern your use of Jaystarbliss Studios' website, programs, and digital services.
                  </p>
                  <span className="text-brand-slate/40 dark:text-gray-500 font-bold text-sm uppercase tracking-wider mt-auto">
                    VIEW TERMS
                  </span>
                </CardContent>
              </Card>
            </Link>
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;
