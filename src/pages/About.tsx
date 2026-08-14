import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Target, Eye, Lightbulb, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-brand-slate text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight">
            WE TEACH. WE BUILD.<br className="hidden md:block" /> WE CREATE.
          </h1>
          <div className="max-w-3xl mx-auto space-y-6 text-xl text-white/80 leading-relaxed">
            <p>
              Jaystarbliss Studios is a learning, technology and creative company built around a simple idea: people learn better when they get the opportunity to actually use what they're learning.
            </p>
            <p>
              What started from a focus on teaching has grown into a broader ecosystem where education, technology and creativity meet.
            </p>
            <p>
              Today, Jaystarbliss supports students, families, schools and businesses through practical learning programs, digital services and creative work.
            </p>
          </div>
        </div>
      </div>

      {/* What We Believe */}
      <div className="py-24 bg-gray-50 dark:bg-slate-950 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white tracking-tight">WHAT WE BELIEVE</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 p-10 rounded-[2rem] shadow-sm border border-gray-100 flex gap-6">
              <div className="w-14 h-14 bg-red-50 text-brand-red rounded-xl flex items-center justify-center shrink-0">
                <Lightbulb size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">PRACTICAL SKILLS MATTER</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Learning should prepare people to do something, not simply remember something.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 p-10 rounded-[2rem] shadow-sm border border-gray-100 flex gap-6">
              <div className="w-14 h-14 bg-red-50 text-brand-red rounded-xl flex items-center justify-center shrink-0">
                <Target size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">CREATIVITY MATTERS</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Technology is powerful, but creativity is what helps people use it in meaningful ways.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 p-10 rounded-[2rem] shadow-sm border border-gray-100 flex gap-6">
              <div className="w-14 h-14 bg-red-50 text-brand-red rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">GOOD WORK TAKES CARE</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Whether we're teaching a student or building a website for a client, we believe the details matter.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 p-10 rounded-[2rem] shadow-sm border border-gray-100 flex gap-6">
              <div className="w-14 h-14 bg-red-50 text-brand-red rounded-xl flex items-center justify-center shrink-0">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">PEOPLE COME FIRST</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Every student, parent, school and client has different needs. We listen before we recommend.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="py-24 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white mb-8 tracking-tight">OUR APPROACH</h2>
          <div className="space-y-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            <p>
              We don't believe in forcing everyone into the same solution.
            </p>
            <p>
              A five-year-old learning Scratch needs a different experience from a business owner launching a website. A school needs something different from a graphic design client.
            </p>
            <p>
              That's why our approach starts with understanding the person, the goal and the situation — then building the right path from there.
            </p>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-24 bg-brand-slate text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800/5 p-12 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:bg-white dark:bg-slate-900 dark:border-slate-800/10 transition-colors">
              <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-brand-red/20 transition-colors">
                <Eye size={120} strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-extrabold mb-6 relative z-10 text-brand-red tracking-tight">OUR VISION</h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium relative z-10">
                To build a company where education, technology and creativity work together to give people practical skills, useful digital tools and better opportunities to create.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800/5 p-12 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:bg-white dark:bg-slate-900 dark:border-slate-800/10 transition-colors">
              <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-brand-red/20 transition-colors">
                <Target size={120} strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-extrabold mb-6 relative z-10 text-brand-red tracking-tight">OUR MISSION</h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium relative z-10">
                To provide practical education, reliable digital solutions and thoughtful creative services that help individuals and organizations learn, build and grow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gray-50 dark:bg-slate-950 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-slate dark:text-white mb-8 tracking-tight">READY TO WORK WITH US?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/programs" className="bg-brand-red text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg">
              START LEARNING
            </Link>
            <Link to="/contact" className="bg-brand-slate text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
