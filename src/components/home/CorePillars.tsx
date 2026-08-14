import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Monitor, Palette } from 'lucide-react';

const pillars = [
  {
    title: 'EDUCATION',
    description: 'We teach academic, digital, technology, creative and music skills in a practical and engaging way. Our programs are designed around understanding, practice and real projects — not simply memorizing information.',
    icon: <BookOpen size={40} className="text-brand-red mb-6" />,
    ctaText: 'EXPLORE LEARNING',
    ctaLink: '/programs',
    bgColor: 'bg-blue-50/50'
  },
  {
    title: 'TECHNOLOGY',
    description: 'We design and build websites, web applications and digital solutions for businesses, schools, organizations and individuals. We also help with the technical side of getting a digital product online and working properly.',
    icon: <Monitor size={40} className="text-brand-red mb-6" />,
    ctaText: 'EXPLORE TECHNOLOGY',
    ctaLink: '/services',
    bgColor: 'bg-gray-50 dark:bg-slate-950'
  },
  {
    title: 'CREATIVE SERVICES',
    description: 'From logos and brand identities to flyers, presentations and digital graphics, we create visual work that helps people and businesses communicate clearly and professionally.',
    icon: <Palette size={40} className="text-brand-red mb-6" />,
    ctaText: 'EXPLORE CREATIVE SERVICES',
    ctaLink: '/services',
    bgColor: 'bg-red-50/50'
  }
];

const CorePillars: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 dark:border-slate-800 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white mb-6 tracking-tight">WHAT WE DO</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            Three areas. One goal: helping people learn, build and create with confidence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index}
              className={`p-10 rounded-[2rem] border border-gray-100 flex flex-col ${pillar.bgColor} hover:-translate-y-2 transition-transform duration-300`}
            >
              {pillar.icon}
              <h3 className="text-2xl font-bold text-brand-slate dark:text-white mb-4">{pillar.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-10 flex-grow">
                {pillar.description}
              </p>
              <Link 
                to={pillar.ctaLink}
                className="inline-flex font-bold text-sm uppercase tracking-wider text-brand-red hover:text-red-700 transition-colors items-center gap-2"
              >
                {pillar.ctaText} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorePillars;
