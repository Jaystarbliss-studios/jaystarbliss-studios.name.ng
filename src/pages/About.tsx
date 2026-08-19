import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Target, CheckCircle2, Users, Lightbulb, Eye } from 'lucide-react';
import Button from '../components/ui/Button';
import { stockImages } from '../lib/stockImages';
import { StaggerGroup, staggerItem, Reveal } from '../components/ui/Reveal';
import { motion } from 'framer-motion';

const beliefs = [
  {
    title: 'PRACTICAL SKILLS MATTER',
    description: 'Learning should prepare people to do something, not simply remember something.',
    icon: <Lightbulb size={26} />,
    image: stockImages.build,
  },
  {
    title: 'CREATIVITY MATTERS',
    description: 'Technology is powerful, but creativity is what helps people use it in meaningful ways.',
    icon: <Target size={26} />,
    image: stockImages.create,
  },
  {
    title: 'GOOD WORK TAKES CARE',
    description: "Whether we're teaching a student or building a website for a client, we believe the details matter.",
    icon: <CheckCircle2 size={26} />,
    image: stockImages.care,
  },
  {
    title: 'PEOPLE COME FIRST',
    description: 'Every student, parent, school and client has different needs. We listen before we recommend.',
    icon: <Users size={26} />,
    image: stockImages.businesses,
  },
];

const About: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-brand-slate text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight">
            WE TEACH. WE BUILD.<br className="hidden md:block" /> WE CREATE.
          </h1>
          <div className="max-w-3xl mx-auto space-y-6 text-xl text-white/80 leading-relaxed font-medium">
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
      <div className="py-24 bg-brand-neutral dark:bg-slate-900 dark:border-slate-800 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white tracking-tight">WHAT WE BELIEVE</h2>
          </Reveal>
          
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beliefs.map((belief, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="group relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row min-h-[220px]"
              >
                <div className="relative sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                  <img
                    src={belief.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-brand-slate/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 sm:top-4 sm:bottom-auto w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-red shadow-lg">
                    {belief.icon}
                  </div>
                </div>
                <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-brand-slate dark:text-white mb-3">{belief.title}</h3>
                  <p className="text-brand-slate/70 dark:text-gray-400 leading-relaxed font-medium">{belief.description}</p>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </div>

      {/* Our Approach */}
      <div className="py-24 bg-white dark:bg-slate-950">
        <Reveal className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-brand-slate dark:text-white mb-8 tracking-tight">OUR APPROACH</h2>
          <div className="space-y-6 text-xl text-brand-slate/80 dark:text-gray-400 leading-relaxed font-medium">
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
        </Reveal>
      </div>

      {/* Vision & Mission */}
      <div className="py-24 bg-brand-slate text-white border-t border-brand-slate">
        <div className="container mx-auto px-4 max-w-7xl">
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div variants={staggerItem} className="bg-white/5 p-12 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-brand-red/20 transition-colors">
                <Eye size={120} strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-extrabold mb-6 relative z-10 text-brand-red tracking-tight">OUR VISION</h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium relative z-10">
                To build a company where education, technology and creativity work together to give people practical skills, useful digital tools and better opportunities to create.
              </p>
            </motion.div>
            
            <motion.div variants={staggerItem} className="bg-white/5 p-12 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-brand-red/20 transition-colors">
                <Target size={120} strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-extrabold mb-6 relative z-10 text-brand-red tracking-tight">OUR MISSION</h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium relative z-10">
                To provide practical education, reliable digital solutions and thoughtful creative services that help individuals and organizations learn, build and grow.
              </p>
            </motion.div>
          </StaggerGroup>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-brand-neutral dark:bg-slate-900 text-center border-t border-slate-200 dark:border-slate-800">
        <Reveal className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-slate dark:text-white mb-8 tracking-tight">READY TO WORK WITH US?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button to="/programs" size="lg" className="shadow-lg shadow-brand-red/20">
              START LEARNING
            </Button>
            <Button to="/contact" variant="secondary" size="lg" className="shadow-lg">
              GET IN TOUCH
            </Button>
          </div>
        </Reveal>
      </div>
    </MainLayout>
  );
};

export default About;
