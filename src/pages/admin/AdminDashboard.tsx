import React, { useState, useEffect } from 'react';
import { Users, BookOpen, MessageSquare, Briefcase, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#1E293B', '#B91C1C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    users: 0,
    programs: 0,
    inquiries: 0,
    services: 0
  });

  const [inquiriesData, setInquiriesData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersSnap, programsSnap, inquiriesSnap, servicesSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'programs')),
          getDocs(collection(db, 'inquiries')),
          getDocs(collection(db, 'services'))
        ]);

        setMetrics({
          users: usersSnap.size,
          programs: programsSnap.size,
          inquiries: inquiriesSnap.size,
          services: servicesSnap.size
        });

        const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsersData(usersList);

        const inquiriesList = inquiriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInquiriesData(inquiriesList);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { name: 'Total Users', value: metrics.users, icon: Users, color: 'bg-blue-500', href: '/admin/users' },
    { name: 'Programs', value: metrics.programs, icon: BookOpen, color: 'bg-indigo-500', href: '/admin/programs' },
    { name: 'Inquiries', value: metrics.inquiries, icon: MessageSquare, color: 'bg-orange-500', href: '/admin/inquiries' },
    { name: 'Services', value: metrics.services, icon: Briefcase, color: 'bg-teal-500', href: '/admin/services' },
  ];

  const inquiriesByType = inquiriesData.reduce((acc, curr) => {
    const type = curr.type || 'UNKNOWN';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartDataInquiries = Object.keys(inquiriesByType).map(key => ({
    name: key,
    value: inquiriesByType[key]
  }));

  const usersByRole = usersData.reduce((acc, curr) => {
    const role = curr.role || 'USER';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const chartDataUsers = Object.keys(usersByRole).map(key => ({
    name: key,
    value: usersByRole[key]
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard & Analytics</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV(usersData, 'users_export')}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download size={16} /> Export Users
          </button>
          <button 
            onClick={() => exportToCSV(inquiriesData, 'inquiries_export')}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download size={16} /> Export Inquiries
          </button>
        </div>
      </div>
      
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
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {loading ? '...' : item.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-950 px-5 py-3 border-t border-gray-100 dark:border-slate-800">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-100 p-6 h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Inquiries by Type</h2>
          <div className="flex-grow">
            {loading ? (
               <div className="h-full flex items-center justify-center text-gray-500">Loading chart...</div>
            ) : chartDataInquiries.length === 0 ? (
               <div className="h-full flex items-center justify-center text-gray-500">No inquiry data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataInquiries} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#B91C1C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-sm border border-gray-100 p-6 h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">User Roles Distribution</h2>
          <div className="flex-grow">
            {loading ? (
               <div className="h-full flex items-center justify-center text-gray-500">Loading chart...</div>
            ) : chartDataUsers.length === 0 ? (
               <div className="h-full flex items-center justify-center text-gray-500">No user data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartDataUsers}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartDataUsers.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
