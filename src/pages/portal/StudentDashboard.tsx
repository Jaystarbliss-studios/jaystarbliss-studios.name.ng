import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Trophy, Video, ExternalLink, 
  FileText, Download, Bell, Sparkles 
} from 'lucide-react';
import { 
  collection, query, where, getDocs, doc, getDoc, 
  limit, updateDoc 
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import SEO from '../../components/ui/SEO';

interface StudentInfo {
  id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  accessCode?: string;
  plan?: string;
  subjects?: string[];
  schedule?: string;
  status?: string;
  notes?: string;
}

interface ResourceItem {
  id: string;
  title: string;
  url?: string;
  type?: string;
  description?: string;
  subject?: string;
  createdAt?: any;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  platform?: string;
  description?: string;
  meetingTime?: string;
}

interface ExamItem {
  id: string;
  title: string;
  link?: string;
  url?: string;
  subject?: string;
  dueDate?: string;
  duration?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: string;
  createdAt?: any;
  readBy?: string[];
}

const StudentDashboard: React.FC = () => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [personalResources, setPersonalResources] = useState<ResourceItem[]>([]);
  const [personalLinks, setPersonalLinks] = useState<LinkItem[]>([]);
  const [generalResources, setGeneralResources] = useState<ResourceItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        const studentDocId = sessionStorage.getItem('studentDocId');
        const studentUsername = sessionStorage.getItem('studentUsername');

        let sData: StudentInfo | null = null;
        let sId = studentDocId || '';

        // 1. Fetch Student Profile
        if (sId) {
          try {
            const sSnap = await getDoc(doc(db, 'individualStudents', sId));
            if (sSnap.exists()) {
              sData = { id: sSnap.id, ...sSnap.data() };
            }
          } catch (e) {
            console.warn('Direct sId fetch error:', e);
          }
        }

        if (!sData && currentUser) {
          try {
            const q = query(
              collection(db, 'individualStudents'),
              where('firebaseUid', '==', currentUser.uid)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
              sId = snap.docs[0].id;
              sData = { id: snap.docs[0].id, ...snap.docs[0].data() };
            }
          } catch (e) {
            console.warn('Uid lookup error:', e);
          }
        }

        if (!sData && studentUsername) {
          try {
            const q = query(
              collection(db, 'individualStudents'),
              where('username', '==', studentUsername.toLowerCase())
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
              sId = snap.docs[0].id;
              sData = { id: snap.docs[0].id, ...snap.docs[0].data() };
            }
          } catch (e) {
            console.warn('Username lookup error:', e);
          }
        }

        // Fallback mock profile if standalone demo
        if (!sData) {
          sData = {
            id: currentUser?.uid || 'temp-id',
            fullName: sessionStorage.getItem('userName') || currentUser?.displayName || 'Active Student',
            username: studentUsername || 'student',
            email: currentUser?.email || 'student@jdh.institute',
            plan: 'Premium Tech Track',
            subjects: ['Web Development', 'Robotics & AI', 'Creative Design'],
            schedule: 'Mon / Wed / Fri (4:00 PM - 6:00 PM)',
            status: 'ACTIVE'
          };
        }
        setStudent(sData);

        // 2. Fetch Personal Resources
        if (sId || currentUser?.uid) {
          try {
            const prSnap = await getDocs(collection(db, 'personalResources'));
            const pRes: ResourceItem[] = [];
            prSnap.forEach(d => {
              const data = d.data();
              if (data.studentId === sId || data.studentId === currentUser?.uid || data.userId === currentUser?.uid) {
                pRes.push({ id: d.id, ...data } as ResourceItem);
              }
            });
            setPersonalResources(pRes);
          } catch (e) {
            console.warn('Personal resources query error:', e);
          }

          // 3. Fetch Personal Links
          try {
            const plSnap = await getDocs(collection(db, 'personalLinks'));
            const pLinks: LinkItem[] = [];
            plSnap.forEach(d => {
              const data = d.data();
              if (data.studentId === sId || data.studentId === currentUser?.uid || data.userId === currentUser?.uid) {
                pLinks.push({ id: d.id, ...data } as LinkItem);
              }
            });
            setPersonalLinks(pLinks);
          } catch (e) {
            console.warn('Personal links query error:', e);
          }
        }

        // 4. Fetch General Resources
        try {
          const resSnap = await getDocs(query(collection(db, 'resources'), limit(6)));
          setGeneralResources(resSnap.docs.map(d => ({ id: d.id, ...d.data() } as ResourceItem)));
        } catch (e) {
          console.warn('General resources fetch error:', e);
        }

        // 5. Fetch Exams & Mock Tests
        try {
          const exSnap = await getDocs(query(collection(db, 'exams'), limit(6)));
          setExams(exSnap.docs.map(d => ({ id: d.id, ...d.data() } as ExamItem)));
        } catch (e) {
          console.warn('Exams fetch error:', e);
        }

        // 6. Fetch Announcements / Notifications
        try {
          const nSnap = await getDocs(query(collection(db, 'notifications'), limit(5)));
          setNotifications(nSnap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationItem)));
        } catch (e) {
          console.warn('Notifications fetch error:', e);
        }

      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const markNotificationRead = async (notifId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      const nDoc = doc(db, 'notifications', notifId);
      const snap = await getDoc(nDoc);
      if (snap.exists()) {
        const readBy = snap.data().readBy || [];
        if (!readBy.includes(uid)) {
          await updateDoc(nDoc, { readBy: [...readBy, uid] });
          setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, readBy: [...(n.readBy || []), uid] } : n));
        }
      }
    } catch (e) {
      console.warn('Could not update notification state:', e);
    }
  };

  const activeSubjects = student?.subjects || ['Web Development Fundamentals', 'Scratch & Python AI', 'Creative Design'];

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Synchronizing student portal profile & resources...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SEO 
        title="Student Workspace Dashboard" 
        description="Access student classes, mentor feedback, assignments, and learning resources." 
        noindex={true}
      />

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-slate rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-700/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red text-xs font-bold tracking-wider uppercase mb-3">
              <Sparkles size={12} />
              Student Learning Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Welcome, {student?.fullName || 'Cadet'}!
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-1 max-w-xl">
              Track your enrolled courses, live classroom links, mentor feedback, and interactive assessments.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col gap-2 min-w-[200px]">
            <div className="text-xs text-white/70">Plan / Track:</div>
            <div className="text-sm font-bold text-white uppercase">{student?.plan || 'Dynamic Coding Plan'}</div>
            {student?.schedule && (
              <div className="text-xs text-brand-red font-medium flex items-center gap-1.5 pt-1 border-t border-white/10">
                <Clock size={13} /> {student.schedule}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled Subjects</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{activeSubjects.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center flex-shrink-0">
            <Video size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personal Links</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{personalLinks.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center flex-shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Study Resources</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{personalResources.length + generalResources.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Exams & Tests</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{exams.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Live Links & Resources */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Class & Live Stream Links */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center">
                  <Video size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Classroom & Sessions</h2>
              </div>
              <span className="text-xs text-gray-500">Assigned by Mentor</span>
            </div>

            {personalLinks.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-slate-950 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                <Video size={32} className="mx-auto text-gray-400 mb-2 opacity-50" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No scheduled personal live links at this moment.</p>
                <p className="text-xs text-gray-500 mt-1">Your tutor will post Zoom, Google Meet, or scratch room links here prior to class.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personalLinks.map((link) => (
                  <div key={link.id} className="p-4 rounded-xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 hover:border-brand-red/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-red/10 text-brand-red uppercase">
                          {link.platform || 'Class Link'}
                        </span>
                        {link.meetingTime && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} /> {link.meetingTime}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{link.title}</h3>
                      {link.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{link.description}</p>
                      )}
                    </div>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center justify-center gap-2 w-full px-3 py-2 bg-brand-red text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                    >
                      Join Class Room <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal & General Resources */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Learning Materials & Handouts</h2>
              </div>
            </div>

            {personalResources.length === 0 && generalResources.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-slate-950 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                <FileText size={32} className="mx-auto text-gray-400 mb-2 opacity-50" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Materials are being prepared by the curriculum department.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...personalResources, ...generalResources].map((res) => (
                  <div key={res.id} className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-sm transition-shadow flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-brand-red/10 text-brand-red flex-shrink-0 mt-0.5">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{res.title}</h3>
                        {res.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{res.description}</p>
                        )}
                      </div>
                    </div>
                    {res.url && (
                      <a 
                        href={res.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-slate-800 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        <Download size={13} /> Access
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Assessments & Quizzes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  <Trophy size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Assessments & Quizzes</h2>
              </div>
            </div>

            {exams.length === 0 ? (
              <div className="p-6 text-center bg-gray-50 dark:bg-slate-950 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                <p className="text-xs text-gray-500">No active examinations pending submission.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exams.map(exam => (
                  <div key={exam.id} className="p-4 rounded-xl border border-gray-200/80 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400">
                        {exam.subject || 'Practical Assessment'}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mt-2">{exam.title}</h3>
                      {exam.duration && <p className="text-xs text-gray-500 mt-1">Duration: {exam.duration}</p>}
                    </div>
                    {(exam.link || exam.url) && (
                      <a 
                        href={exam.link || exam.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-brand-red dark:hover:bg-brand-red text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Start Test <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar: Profile card & Announcements */}
        <div className="space-y-8">

          {/* Student Identity Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Cadet Profile</h2>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-gray-500 dark:text-gray-400">Student Username:</span>
                <span className="font-bold text-gray-900 dark:text-white font-mono">{student?.username || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                <span className="font-bold text-green-600 dark:text-green-400">Active Learner</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-gray-500 dark:text-gray-400">Primary Track:</span>
                <span className="font-bold text-gray-900 dark:text-white text-right">{student?.plan || 'Dynamic Coding'}</span>
              </div>
              {student?.notes && (
                <div className="py-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Mentor Remarks:</span>
                  <p className="text-xs bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg text-amber-800 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/50">
                    {student.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Institute Announcements */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-brand-red" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Announcements</h2>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500">No new announcements today.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => {
                  const isRead = auth.currentUser?.uid && n.readBy?.includes(auth.currentUser.uid);
                  return (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isRead 
                          ? 'border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 text-gray-500' 
                          : 'border-brand-red/30 bg-brand-red/5 dark:bg-brand-red/10 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center justify-between">
                        <span>{n.title}</span>
                        {!isRead && <span className="w-2 h-2 rounded-full bg-brand-red"></span>}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{n.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;

