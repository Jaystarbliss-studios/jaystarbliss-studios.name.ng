import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { GraduationCap, FileText, Calendar } from 'lucide-react';
import SEO from '../../components/ui/SEO';

const ParentDashboard: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        // Find students whose parentId matches the current user's email or uid
        // (Assuming parentId was stored as email during enrollment request)
        const q = query(collection(db, 'students'), where('parentId', '==', user.email));
        const snap = await getDocs(q);
        setChildren(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching children:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  return (
    <div className="space-y-8">
      <SEO 
        title="Parent Portal Dashboard" 
        description="Monitor your child's academic progress, attendance, and mentor feedback." 
        noindex={true}
      />
      {/* Welcome Banner */}
      <div className="bg-brand-slate rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-2">Parent Portal</h2>
          <p className="text-white/70 text-lg mb-6">Monitor your children's progress, upcoming classes, and resources.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-slate dark:text-white">{children.length}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Linked Students</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-slate dark:text-white">0</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Upcoming Events</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-brand-slate dark:text-white">0</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">School Notices</p>
          </div>
        </div>
      </div>

      {/* Children List Area */}
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-brand-slate dark:text-white mb-6">My Students</h3>
        {loading ? (
          <div className="text-gray-500">Loading student profiles...</div>
        ) : children.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>No students linked to your account yet.</p>
            <p className="text-sm mt-1">Make sure you used the same email during enrollment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map(student => (
              <div key={student.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50 dark:bg-slate-950 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-red text-white rounded-full flex items-center justify-center font-bold">
                    {student.fullName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-slate dark:text-white">{student.fullName}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{student.username}</p>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enrolled Subjects:</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(student.subjects) ? student.subjects.map((sub: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-gray-600 dark:text-gray-400">{sub}</span>
                    )) : (
                      <span className="text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-gray-600 dark:text-gray-400">{student.subjects || 'None'}</span>
                    )}
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Access Code: <strong className="text-brand-slate dark:text-white">{student.accessCode}</strong></span>
                  <button className="text-brand-red text-sm font-medium hover:underline">View Progress</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
