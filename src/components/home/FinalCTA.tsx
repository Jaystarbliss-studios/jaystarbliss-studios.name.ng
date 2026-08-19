import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const FinalCTA: React.FC = () => {
  return (
    <section className="py-24 bg-brand-slate text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      
      <Reveal className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
          READY TO LEARN, <br />
          BUILD OR CREATE?
        </h2>
        <p className="text-xl text-brand-neutral/80 mb-12 max-w-2xl mx-auto">
          Take the next step in your digital journey. Whether you want to master a new skill or build a professional project, we're ready to start.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="relative inline-flex w-full sm:w-auto overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-xl shadow-brand-red/20 group">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#B91C1C_0%,#F8FAFC_50%,#B91C1C_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-brand-slate px-8 py-4 font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-brand-red/90">
              START LEARNING
              <ArrowRight size={20} />
            </span>
          </Link>
          <Link to="/contact" className="w-full sm:w-auto bg-white dark:bg-slate-900 dark:border-slate-800 text-brand-slate dark:text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            START A PROJECT
          </Link>
        </div>
      </Reveal>
    </section>
  );
};

export default FinalCTA;
