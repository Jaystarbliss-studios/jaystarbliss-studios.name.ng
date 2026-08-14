import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, School, Building2, UserCircle } from 'lucide-react';

const pathways = [
  {
    title: 'STUDENTS',
    description: 'Learn useful skills, build projects and develop work you can actually show.',
    icon: <GraduationCap size={32} className="text-brand-red mb-4" />,
    ctaText: 'LEARN WITH US',
    ctaLink: '/programs'
  },
  {
    title: 'PARENTS',
    description: 'Find practical academic, digital and creative programs designed to help your child grow.',
    icon: <Users size={32} className="text-brand-red mb-4" />,
    ctaText: 'EXPLORE PROGRAMS',
    ctaLink: '/programs'
  },
  {
    title: 'SCHOOLS',
    description: 'Bring digital literacy, coding, creative education, music and technology programs into your school.',
    icon: <School size={32} className="text-brand-red mb-4" />,
    ctaText: 'PARTNER WITH US',
    ctaLink: '/contact'
  },
  {
    title: 'BUSINESSES',
    description: 'Get the websites, applications, designs and digital support your business needs.',
    icon: <Building2 size={32} className="text-brand-red mb-4" />,
    ctaText: 'START A PROJECT',
    ctaLink: '/services'
  },
  {
    title: 'TUTORS',
    description: 'Join a learning environment where teaching, practical skills and student development come together.',
    icon: <UserCircle size={32} className="text-brand-red mb-4" />,
    ctaText: 'BECOME A TUTOR',
    ctaLink: '/register'
  }
];

const AudiencePathways: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-950 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white mb-6 tracking-tight">
            BUILT AROUND PEOPLE, NOT JUST PRODUCTS.
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            Different people come to Jaystarbliss for different reasons. Our services and programs are designed to meet them where they are.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((pathway, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-900 dark:border-slate-800 p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col"
            >
              <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {pathway.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{pathway.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow font-medium leading-relaxed">
                {pathway.description}
              </p>
              <Link 
                to={pathway.ctaLink}
                className="w-full text-center bg-gray-50 dark:bg-slate-950 text-brand-slate dark:text-white font-bold py-3 rounded-lg hover:bg-brand-red hover:text-white transition-colors uppercase tracking-wide text-sm"
              >
                {pathway.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudiencePathways;
