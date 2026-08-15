import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, Loader2 } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Fetch student enrollments
          const q = query(collection(db, 'enrollments'), where('studentId', '==', currentUser.uid));
          const snapshot = await getDocs(q);
          const enrollmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // In a real app we'd join this with the 'programs' collection, 
          // but for this MVP we'll just store the populated data or use what we got
          setEnrollments(enrollmentsData);
        } catch (error) {
          console.error("Error fetching enrollments:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-[50vh] flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-brand-red" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-brand-slate rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋</h2>
          <p className="text-white/70 text-lg mb-6">Ready to continue learning and building your future?</p>
          <Link to="/programs" className="bg-brand-red hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-red/20 inline-block">
            Browse Programs
          </Link>
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
                <h3 className="text-3xl font-black text-brand-slate dark:text-white">{enrollments.length}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Courses</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-brand-slate dark:text-white">0h</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Time Learned</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-brand-slate dark:text-white">0</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Certificates</p>
              </div>
            </div>
          </div>

          {/* Current Courses */}
          <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-brand-slate dark:text-white">My Learning</h3>
            </div>
            
            {enrollments.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-brand-slate dark:text-white mb-2">No active enrollments</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">You aren't enrolled in any programs yet.</p>
                <Link to="/programs" className="text-brand-red font-bold hover:text-red-700 transition-colors">
                  Explore available programs &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map(enrollment => (
                  <div key={enrollment.id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-gray-50 dark:bg-slate-950 p-5">
                    <h4 className="font-bold text-brand-slate dark:text-white mb-2">{enrollment.programName}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Status: {enrollment.status || 'Active'}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-red h-full rounded-full transition-all" style={{ width: `${enrollment.progress || 0}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-brand-slate dark:text-white mb-6">Upcoming Classes</h3>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm font-medium">
              No upcoming classes scheduled.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
