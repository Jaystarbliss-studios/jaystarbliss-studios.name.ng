import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Monitor, Palette, Users } from 'lucide-react';

const pillars = [
  {
    title: 'LEARN WITH US',
    description: 'Master academic subjects, learn programming, and build digital skills. We teach mathematics, sciences, web development, graphic design, and music in a practical and engaging way.',
    icon: <BookOpen size={40} className="text-brand-red mb-6" />,
    ctaText: 'EXPLORE PROGRAMS',
    ctaLink: '/programs',
    bgColor: 'bg-blue-50/50 dark:bg-blue-950/20'
  },
  {
    title: 'BUILD WITH US',
    description: 'We design and build websites, web applications, and complete digital solutions for businesses, schools, organizations, and individuals who want a professional online presence.',
    icon: <Monitor size={40} className="text-brand-red mb-6" />,
    ctaText: 'EXPLORE TECH SERVICES',
    ctaLink: '/services',
    bgColor: 'bg-gray-50 dark:bg-slate-950'
  },
  {
    title: 'CREATE WITH US',
    description: 'From logos and brand identities to flyers, presentations, and digital graphics, we create professional visual work that helps you and your business communicate clearly.',
    icon: <Palette size={40} className="text-brand-red mb-6" />,
    ctaText: 'EXPLORE CREATIVE SERVICES',
    ctaLink: '/services',
    bgColor: 'bg-red-50/50 dark:bg-red-950/20'
  },
  {
    title: 'PARTNER WITH US',
    description: 'We partner with schools and organizations to run on-site Smart Tech Clubs, Coding Clubs, Music Clubs, and Digital Literacy programs customized for their students.',
    icon: <Users size={40} className="text-brand-red mb-6" />,
    ctaText: 'EXPLORE SCHOOL PROGRAMS',
    ctaLink: '/programs#schools',
    bgColor: 'bg-green-50/50 dark:bg-green-950/20'
  }
];

const CorePillars: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 dark:border-slate-800 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white mb-6 tracking-tight">THE JAYSTARBLISS ECOSYSTEM</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            Education. Technology. Creative Services. Digital Consulting.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index}
              className={`p-10 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex flex-col ${pillar.bgColor} hover:-translate-y-2 transition-transform duration-300`}
            >
              {pillar.icon}
              <h3 className="text-xl font-bold text-brand-slate dark:text-white mb-4">{pillar.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-10 flex-grow text-sm">
                {pillar.description}
              </p>
              <Link 
                to={pillar.ctaLink}
                className="inline-flex font-bold text-xs uppercase tracking-wider text-brand-red hover:text-red-700 transition-colors items-center gap-2 mt-auto"
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
