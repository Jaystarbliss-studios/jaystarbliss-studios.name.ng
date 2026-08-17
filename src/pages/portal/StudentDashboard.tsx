import React from 'react';
import { BookOpen, Calendar, Clock, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Student!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Courses</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-brand-red/10 text-brand-red rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Classes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hours Learned</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificates</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Current Programs</h2>
              <Link to="/portal/student/courses" className="text-sm font-medium text-brand-red hover:text-red-700">View All</Link>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 dark:border-slate-700 rounded-lg hover:border-brand-red/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">Web Development Fundamentals</h3>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded">ACTIVE</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                  <div className="bg-brand-red h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">60% Complete - Next session: Tomorrow, 10:00 AM</p>
              </div>

              <div className="p-4 border border-gray-100 dark:border-slate-700 rounded-lg hover:border-brand-red/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">Digital Literacy Basics</h3>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded">ACTIVE</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                  <div className="bg-brand-red h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">85% Complete - Next session: Friday, 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Announcements</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-brand-red pl-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Submit your final project for Web Fundamentals by Friday.</p>
              </div>
              <div className="border-l-2 border-gray-300 dark:border-slate-700 pl-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Yesterday</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">New advanced Scratch module has been unlocked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
