import React from 'react';
import { BookOpen, Clock, Award, ArrowRight } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const upcomingClasses = [
    { id: 1, name: 'Web Development Basics', time: '10:00 AM Today', instructor: 'Sarah Jenkins', type: 'Live Class' },
    { id: 2, name: 'UI/UX Design Principles', time: '2:30 PM Tomorrow', instructor: 'Marcus Chen', type: 'Workshop' },
  ];

  const currentCourses = [
    { id: 1, name: 'Full-Stack Web Development', progress: 65, totalModules: 12, completedModules: 8, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Digital Marketing Fundamentals', progress: 30, totalModules: 8, completedModules: 2, image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-brand-slate rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-2">Welcome back, Jane! 👋</h2>
          <p className="text-white/70 text-lg mb-6">You've completed 8 modules this week. Keep up the great work!</p>
          <button className="bg-brand-red hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-red/20">
            Resume Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-brand-slate dark:text-white">4</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Courses</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-brand-slate dark:text-white">32h</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Time Learned</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-brand-slate dark:text-white">2</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Certificates</p>
              </div>
            </div>
          </div>

          {/* Current Courses */}
          <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-brand-slate dark:text-white">My Learning</h3>
              <button className="text-sm font-bold text-brand-red hover:text-red-700 transition-colors flex items-center gap-1">
                View all <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentCourses.map(course => (
                <div key={course.id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-gray-50 dark:bg-slate-950">
                  <div className="h-32 overflow-hidden relative">
                    <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-brand-slate dark:text-white mb-1 line-clamp-1">{course.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{course.completedModules} of {course.totalModules} modules</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-red h-full rounded-full transition-all" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Classes */}
          <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-brand-slate dark:text-white mb-6">Upcoming Classes</h3>
            <div className="space-y-4">
              {upcomingClasses.map(cls => (
                <div key={cls.id} className="p-4 rounded-xl border border-gray-100 hover:border-brand-red/30 hover:bg-red-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded">{cls.type}</span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{cls.time}</span>
                  </div>
                  <h4 className="font-bold text-brand-slate dark:text-white text-sm mb-1">{cls.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">with {cls.instructor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
