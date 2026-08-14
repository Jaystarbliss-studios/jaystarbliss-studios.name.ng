import React from 'react';

const steps = [
  {
    num: '01',
    title: 'LEARN',
    description: 'Understand the idea before trying to use it.',
  },
  {
    num: '02',
    title: 'PRACTICE',
    description: 'Work through exercises with guidance and feedback.',
  },
  {
    num: '03',
    title: 'BUILD',
    description: 'Apply the skill to a real project.',
  },
  {
    num: '04',
    title: 'LAUNCH',
    description: 'Finish the work and, where appropriate, publish or present it.',
  },
  {
    num: '05',
    title: 'SHOWCASE',
    description: 'Keep the finished work as part of a growing portfolio.',
  }
];

const LearningMethod: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 dark:border-slate-800 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white mb-6 tracking-tight leading-[1.1]">
              LEARN. PRACTICE.<br />BUILD. SHOWCASE.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              We believe learning becomes much more meaningful when students get the chance to use what they've learned.
            </p>
          </div>
          
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-100 flex items-center justify-center text-xl font-black text-brand-red shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
export default LearningMethod;
