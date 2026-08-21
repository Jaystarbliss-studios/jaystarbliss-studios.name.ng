import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LEARNING_SCHOOLS, 
  type LearningSchool
} from '../../data/learningEcosystem';
import { 
  Laptop, 
  Palette, 
  Music, 
  Brain, 
  GraduationCap, 
  Gamepad2, 
  Baby, 
  Users,
  ArrowRight,
  Layers,
  CheckCircle2,
  Compass
} from 'lucide-react';
import Button from '../ui/Button';

const SCHOOL_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Laptop,
  Palette,
  Music,
  Brain,
  GraduationCap,
  Gamepad2,
  Baby,
  Users
};

export const LearningSchoolsGrid: React.FC<{
  onSelectSchool?: (school: LearningSchool) => void;
  defaultExpandedSchoolId?: string;
  selectedSchoolId?: string;
  onSchoolChange?: (schoolId: string) => void;
}> = ({ defaultExpandedSchoolId, selectedSchoolId: controlledSchoolId, onSchoolChange, onSelectSchool }) => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(() => {
    const initialId = controlledSchoolId || defaultExpandedSchoolId || LEARNING_SCHOOLS[0].id;
    const match = LEARNING_SCHOOLS.find(s => s.id === initialId || s.slug === initialId);
    return match ? match.id : LEARNING_SCHOOLS[0].id;
  });
  const [activePathwayTab, setActivePathwayTab] = useState<number>(0);

  // Synchronize when parent passes a new selectedSchoolId
  React.useEffect(() => {
    if (controlledSchoolId) {
      const match = LEARNING_SCHOOLS.find(s => s.id === controlledSchoolId || s.slug === controlledSchoolId);
      if (match && match.id !== selectedSchoolId) {
        setSelectedSchoolId(match.id);
        setActivePathwayTab(0);
      }
    }
  }, [controlledSchoolId, selectedSchoolId]);

  const currentSchool = LEARNING_SCHOOLS.find(s => s.id === selectedSchoolId) || LEARNING_SCHOOLS[0];
  const SchoolIcon = SCHOOL_ICONS[currentSchool.iconName] || Layers;

  const handleSelectSchool = (school: LearningSchool) => {
    setSelectedSchoolId(school.id);
    setActivePathwayTab(0);
    if (onSchoolChange) onSchoolChange(school.id);
    if (onSelectSchool) onSelectSchool(school);
  };

  return (
    <div id="school-hub" className="space-y-10 scroll-mt-24">
      
      {/* 8 Schools Tab Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        {LEARNING_SCHOOLS.map((school) => {
          const isSelected = school.id === selectedSchoolId;
          const Icon = SCHOOL_ICONS[school.iconName] || Layers;

          return (
            <button
              key={school.id}
              id={`school-tab-${school.id}`}
              type="button"
              onClick={() => handleSelectSchool(school)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-brand-red shadow-lg shadow-brand-red/5 scale-[1.02] ring-2 ring-brand-red/20'
                  : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'bg-brand-red text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:text-brand-red'
                  }`}
                >
                  <Icon size={20} />
                </div>
                
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                )}
              </div>

              <div>
                <h3 className={`font-black text-xs sm:text-sm tracking-tight line-clamp-1 ${
                  isSelected ? 'text-brand-red' : 'text-slate-900 dark:text-white'
                }`}>
                  {school.name.replace('School of ', '')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {school.shortDescription}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Interactive School Hub */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* School Header Banner */}
        <div className="p-6 sm:p-8 lg:p-10 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center font-bold">
                  <SchoolIcon size={20} />
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {currentSchool.name}
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium">
                {currentSchool.tagline}
              </p>
              
              <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                {currentSchool.longDescription}
              </p>

              {/* Disciplines Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                {currentSchool.disciplines.map((d) => (
                  <span 
                    key={d}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="shrink-0 flex flex-col gap-3 bg-white/5 p-5 rounded-2xl border border-white/10 self-start lg:self-center">
              <span className="text-xs text-slate-300 font-bold">Ready to enroll or request a school plan?</span>
              <Button
                to="/contact"
                className="bg-brand-red hover:bg-red-700 text-white font-extrabold uppercase tracking-wider text-xs shadow-lg shadow-brand-red/20"
                rightIcon={<ArrowRight size={14} />}
              >
                Request This Programme
              </Button>
              <Link 
                to="/register" 
                className="text-xs font-bold text-center text-slate-300 hover:text-white underline"
              >
                Enroll in Live Cohort
              </Link>
            </div>
          </div>
        </div>

        {/* Pathways & Curriculum Tab Section */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-8">
          
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Compass size={18} className="text-brand-red" />
              <span>Progressive Learning Pathways</span>
            </h3>

            {/* Pathway Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
              {currentSchool.pathways.map((pathway, idx) => (
                <button
                  key={pathway.id}
                  type="button"
                  onClick={() => setActivePathwayTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    activePathwayTab === idx
                      ? 'bg-brand-red text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {pathway.title} ({pathway.ageRange})
                </button>
              ))}
            </div>

            {/* Pathway Content */}
            {currentSchool.pathways[activePathwayTab] && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {currentSchool.pathways[activePathwayTab].title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {currentSchool.pathways[activePathwayTab].description}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-brand-red/10 text-brand-red dark:bg-brand-red/20 self-start sm:self-auto">
                    {currentSchool.pathways[activePathwayTab].ageRange}
                  </span>
                </div>

                {/* Pathway Levels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentSchool.pathways[activePathwayTab].levels.map((lvl, index) => (
                    <div 
                      key={lvl.title + index}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3 hover:border-brand-red/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-md">
                            {lvl.level}
                          </span>
                          <span className="text-slate-400 text-xs font-bold">Step 0{index + 1}</span>
                        </div>
                        <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {lvl.title}
                        </h5>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {lvl.topics.map((topic) => (
                          <div key={topic} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5-Stage Discipline Specific Breakdown */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Discipline Progression in {currentSchool.name}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { stage: 'Stage 1: Discover', items: currentSchool.stagesFramework.discover },
                { stage: 'Stage 2: Build', items: currentSchool.stagesFramework.build },
                { stage: 'Stage 3: Apply', items: currentSchool.stagesFramework.apply },
                { stage: 'Stage 4: Create', items: currentSchool.stagesFramework.create },
                { stage: 'Stage 5: Master', items: currentSchool.stagesFramework.master }
              ].map((s) => (
                <div key={s.stage} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-black text-brand-red uppercase mb-2">
                    {s.stage}
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                    {s.items.map((item) => (
                      <li key={item} className="line-clamp-2">• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LearningSchoolsGrid;
