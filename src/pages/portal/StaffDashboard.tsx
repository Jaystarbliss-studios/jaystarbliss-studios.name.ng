import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { Users, Calendar, FileText } from 'lucide-react';

const StaffDashboard: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const q = query(collection(db, 'staffGeneralResources'));
        const snap = await getDocs(q);
        setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-brand-slate rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-2">Staff Portal</h2>
          <p className="text-white/70 text-lg mb-6">Manage your classes, students, and access staff resources here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-slate dark:text-white">0</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Assigned Students</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-slate dark:text-white">0</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Upcoming Classes</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-slate dark:text-white">{resources.length}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Staff Resources</p>
          </div>
        </div>
      </div>

      {/* Resources Area */}
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-brand-slate dark:text-white mb-6">Staff General Resources</h3>
        {loading ? (
          <div className="text-gray-500">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-gray-500">No resources available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(res => (
              <a key={res.id} href={res.url || '#'} target="_blank" rel="noreferrer" className="group border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50 dark:bg-slate-950 flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 text-brand-red">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-slate dark:text-white mb-1 group-hover:text-brand-red transition-colors">{res.title || 'Untitled Resource'}</h4>
                  {res.description && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{res.description}</p>}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
