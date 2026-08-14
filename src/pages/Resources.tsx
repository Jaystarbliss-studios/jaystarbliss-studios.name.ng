import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { BookOpen, FileText, HelpCircle, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

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

      <div className="py-24 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <Link to="/faq" className="bg-white dark:bg-slate-900 dark:border-slate-800 p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col items-start">
              <div className="w-16 h-16 bg-red-50 text-brand-red rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <HelpCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">FAQ</h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                Find answers to common questions about our educational programs, digital services, timelines, and how we collaborate.
              </p>
              <span className="text-brand-red font-bold text-sm uppercase tracking-wider group-hover:text-red-700 transition-colors mt-auto">
                VIEW FAQs &rarr;
              </span>
            </Link>

            <Link to="#" className="bg-white dark:bg-slate-900 dark:border-slate-800 p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col items-start opacity-75">
              <div className="w-16 h-16 bg-red-50 text-brand-red rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <PenTool size={32} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h2>
                <span className="bg-gray-100 text-gray-500 dark:text-gray-400 px-3 py-1 text-xs font-bold uppercase rounded-full">Coming Soon</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                Articles, case studies, and insights on education, technology, and creativity. Read our thoughts on building better digital experiences.
              </p>
              <span className="text-gray-400 font-bold text-sm uppercase tracking-wider mt-auto">
                STAY TUNED
              </span>
            </Link>

            <Link to="#" className="bg-white dark:bg-slate-900 dark:border-slate-800 p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col items-start opacity-75">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-950 text-gray-400 rounded-xl flex items-center justify-center mb-8">
                <FileText size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                Learn how we collect, use, and protect your personal information when you use our services or enroll in our programs.
              </p>
              <span className="text-gray-400 font-bold text-sm uppercase tracking-wider mt-auto">
                VIEW POLICY
              </span>
            </Link>

            <Link to="#" className="bg-white dark:bg-slate-900 dark:border-slate-800 p-10 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col items-start opacity-75">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-950 text-gray-400 rounded-xl flex items-center justify-center mb-8">
                <BookOpen size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-grow">
                Read the terms and conditions that govern your use of Jaystarbliss Studios' website, programs, and digital services.
              </p>
              <span className="text-gray-400 font-bold text-sm uppercase tracking-wider mt-auto">
                VIEW TERMS
              </span>
            </Link>
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;
