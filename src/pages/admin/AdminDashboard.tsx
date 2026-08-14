import React from 'react';
import { Users, BookOpen, MessageSquare, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const stats = [
    { name: 'Total Users', value: '0', icon: Users, color: 'bg-blue-500', href: '/admin/users' },
    { name: 'Programs', value: '0', icon: BookOpen, color: 'bg-indigo-500', href: '/admin/programs' },
    { name: 'Active Inquiries', value: '0', icon: MessageSquare, color: 'bg-orange-500', href: '/admin/inquiries' },
    { name: 'Services', value: '0', icon: Briefcase, color: 'bg-teal-500', href: '/admin/services' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white dark:bg-slate-900 dark:border-slate-800 overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${item.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.name}</dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-950 px-5 py-3">
                <div className="text-sm">
                  <Link to={item.href} className="font-medium text-brand-red hover:text-red-700 transition-colors">
                    View all
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity found.</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/programs/new" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-brand-red hover:bg-brand-red/5 transition-colors group">
              <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-brand-red mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-brand-red">Add Program</span>
            </Link>
            <Link to="/admin/blog/new" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-brand-red hover:bg-brand-red/5 transition-colors group">
              <MessageSquare className="h-6 w-6 text-gray-400 group-hover:text-brand-red mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-brand-red">New Post</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
