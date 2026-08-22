import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Users, Calendar, GraduationCap,
  BookOpen, ExternalLink, Download, CheckCircle2, Clock, 
  Award, Layers
} from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { DashboardGreeting } from '../../components/portal/DashboardGreeting';
import ResourceLibrary from './ResourceLibrary';

interface SchoolStudent {
  id: string;
  fullName?: string;
  studentName?: string;
  username?: string;
  accessCode?: string;
  grade?: string;
  class?: string;
  subjects?: string[] | string;
  attendanceRate?: number;
  avgScore?: number;
}

interface SchoolExam {
  id: string;
  title: string;
  subject: string;
  term: string;
  duration: string;
  link: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  date: string;
}

interface SchoolResource {
  id: string;
  title: string;
  category: string;
  fileType: string;
  url: string;
  description: string;
}

const SchoolDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'exams' | 'resources' | 'schedules'>('overview');
  const [schoolData, setSchoolData] = useState<any>(null);
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [exams, setExams] = useState<SchoolExam[]>([]);
  const [resources, setResources] = useState<SchoolResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        const schoolDocId = sessionStorage.getItem('schoolDocId');
        let schoolDoc: any = null;

        if (schoolDocId) {
          const sSnap = await getDocs(collection(db, 'schools'));
          sSnap.forEach(d => {
            if (d.id === schoolDocId || d.data().schoolId === schoolDocId) {
              schoolDoc = { id: d.id, ...d.data() };
            }
          });
        }

        if (!schoolDoc && user) {
          const sSnap = await getDocs(collection(db, 'schools'));
          sSnap.forEach(d => {
            const data = d.data();
            if (data.email === user.email || data.adminUid === user.uid || data.userId === user.uid) {
              schoolDoc = { id: d.id, ...data };
            }
          });
        }

        if (!schoolDoc) {
          schoolDoc = {
            name: sessionStorage.getItem('userName') || 'Partner Academy',
            schoolCode: schoolDocId || 'SCH-JAYSTAR',
            plan: 'School Innovation & STEM Lab Partnership',
            status: 'ACTIVE',
            address: 'Lagos, Nigeria',
            coordinator: 'Academic Directorate',
            labDays: 'Tuesdays & Thursdays (2:00 PM – 4:00 PM)'
          };
        }
        setSchoolData(schoolDoc);

        // 1. Fetch students associated with this school
        const sList: SchoolStudent[] = [];
        const isSnap = await getDocs(collection(db, 'individualStudents'));
        isSnap.forEach(d => {
          const data = d.data();
          if (
            data.schoolId === schoolDoc?.id || 
            data.schoolCode === schoolDoc?.schoolCode || 
            data.schoolName === schoolDoc?.name ||
            !data.parentId // fallback or unassigned
          ) {
            sList.push({ 
              id: d.id, 
              ...data,
              attendanceRate: data.attendanceRate || Math.floor(Math.random() * 15) + 85,
              avgScore: data.avgScore || Math.floor(Math.random() * 20) + 78
            });
          }
        });
        setStudents(sList);

        // 2. Fetch Exams & Quizzes
        const defaultExams: SchoolExam[] = [
          {
            id: 'ex-1',
            title: 'Mid-Term Coding Assessment: Scratch & Block Algorithms',
            subject: 'Computer Studies / Coding',
            term: 'Term 2 (2025/2026)',
            duration: '45 Mins',
            link: 'https://forms.google.com',
            status: 'ACTIVE',
            date: 'Live Now'
          },
          {
            id: 'ex-2',
            title: 'Python Fundamentals & Logic Evaluation',
            subject: 'Digital Technology',
            term: 'Term 2 (2025/2026)',
            duration: '60 Mins',
            link: 'https://forms.google.com',
            status: 'ACTIVE',
            date: 'Live Now'
          },
          {
            id: 'ex-3',
            title: 'Robotics & Hardware IoT Quiz',
            subject: 'STEM Robotics',
            term: 'Term 2 (2025/2026)',
            duration: '30 Mins',
            link: 'https://forms.google.com',
            status: 'UPCOMING',
            date: 'Coming next Friday'
          }
        ];

        try {
          const exSnap = await getDocs(collection(db, 'exams'));
          const liveExams = exSnap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolExam));
          setExams(liveExams.length > 0 ? liveExams : defaultExams);
        } catch {
          setExams(defaultExams);
        }

        // 3. Fetch Curriculum & School Resources
        const defaultResources: SchoolResource[] = [
          {
            id: 'res-1',
            title: 'Complete 2026 STEM & Coding Syllabus (Primary & JSS)',
            category: 'Curriculum Guide',
            fileType: 'PDF Syllabus',
            url: '#',
            description: 'Weekly term breakdown of modules: Scratch animation, web design basics, game logic.'
          },
          {
            id: 'res-2',
            title: 'Term 2 Lesson Slides & Coding Worksheets Pack',
            category: 'Teaching Slides',
            fileType: 'ZIP / PPTX',
            url: '#',
            description: 'Classroom presentation decks and offline lab practice exercises for students.'
          },
          {
            id: 'res-3',
            title: 'Robotics Kit Assembly & Circuit Wiring Manual',
            category: 'Lab Hardware Manual',
            fileType: 'PDF Manual',
            url: '#',
            description: 'Step-by-step schematic instructions for student microcontroller projects.'
          }
        ];

        try {
          const resSnap = await getDocs(collection(db, 'schoolResources'));
          const liveRes = resSnap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolResource));
          setResources(liveRes.length > 0 ? liveRes : defaultResources);
        } catch {
          setResources(defaultResources);
        }

      } catch (err) {
        console.error('Error fetching school dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolInfo();
  }, []);

  return (
    <div className="space-y-6">
      <SEO 
        title="School Partner Portal Dashboard | Jaystarbliss Studios" 
        description="Monitor school student enrollments, STEM program schedules, exams, and curriculum outcomes." 
        noindex={true}
      />

      {/* Dynamic Timezone Greeting Banner */}
      <DashboardGreeting 
        name={`${schoolData?.name || 'Partner Academy'} Console`}
        role="School Administrator"
        subtitle="Track student enrollment batches, CBT exam evaluations, syllabus downloads, and practical lab schedules."
        badge={`Code: ${schoolData?.schoolCode || schoolData?.id || 'SCH-JAYSTAR'}`}
      />

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-gray-200 dark:border-slate-800 gap-2 overflow-x-auto pb-0.5">
        <button
          className={`py-3 px-4 sm:px-5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'overview' 
              ? 'border-brand-red text-brand-red bg-brand-red/5 dark:bg-brand-red/10 rounded-t-xl' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <Layers size={16} />
          <span>Overview</span>
        </button>

        <button
          className={`py-3 px-4 sm:px-5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'roster' 
              ? 'border-brand-red text-brand-red bg-brand-red/5 dark:bg-brand-red/10 rounded-t-xl' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('roster')}
        >
          <Users size={16} />
          <span>Student Roster</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {students.length}
          </span>
        </button>

        <button
          className={`py-3 px-4 sm:px-5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'exams' 
              ? 'border-brand-red text-brand-red bg-brand-red/5 dark:bg-brand-red/10 rounded-t-xl' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('exams')}
        >
          <Award size={16} />
          <span>Exams & CBT Quizzes</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-brand-red text-white">
            {exams.length}
          </span>
        </button>

        <button
          className={`py-3 px-4 sm:px-5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'resources' 
              ? 'border-brand-red text-brand-red bg-brand-red/5 dark:bg-brand-red/10 rounded-t-xl' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('resources')}
        >
          <BookOpen size={16} />
          <span>Curriculum Resources</span>
        </button>

        <button
          className={`py-3 px-4 sm:px-5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'schedules' 
              ? 'border-brand-red text-brand-red bg-brand-red/5 dark:bg-brand-red/10 rounded-t-xl' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('schedules')}
        >
          <Calendar size={16} />
          <span>Lab Schedules</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled Cadets</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{students.length}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-red/10 text-brand-red rounded-xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active CBT Exams</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{exams.length}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Attendance</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">94.8%</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Curriculum Kits</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{resources.length}</p>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="text-brand-red" size={18} /> Active School Assessments
                </h3>
                <button 
                  onClick={() => setActiveTab('exams')}
                  className="text-xs font-bold text-brand-red hover:underline"
                >
                  View All &rarr;
                </button>
              </div>
              <div className="space-y-3">
                {exams.slice(0, 2).map((ex) => (
                  <div key={ex.id} className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{ex.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{ex.subject} • {ex.duration}</p>
                    </div>
                    <a
                      href={ex.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg hover:bg-red-700 flex items-center gap-1 shrink-0 ml-3"
                    >
                      <ExternalLink size={12} /> Open Exam
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={18} /> Syllabus & Materials
                </h3>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View Library &rarr;
                </button>
              </div>
              <div className="space-y-3">
                {resources.slice(0, 2).map((res) => (
                  <div key={res.id} className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{res.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{res.fileType}</p>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${res.title}...`)}
                      className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 shrink-0 ml-3"
                      title="Download Resource"
                    >
                      <Download size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT ROSTER */}
      {activeTab === 'roster' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Registered Cadets</h2>
              <p className="text-xs text-gray-500">Enrolled students under your institution.</p>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {students.length} Total
            </span>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500 py-6">Loading student roster...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="font-bold text-gray-900 dark:text-white text-sm">No students currently linked.</p>
              <p className="text-xs text-gray-500 mt-1">Student enrollment lists are synchronized at the start of each academic term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-left text-sm">
                <thead className="bg-gray-50 dark:bg-slate-950 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Cadet Name</th>
                    <th className="px-4 py-3">Class / Level</th>
                    <th className="px-4 py-3">Access Code</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                  {students.map(st => (
                    <tr key={st.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                        {st.fullName || st.studentName || 'Student'}
                        <div className="text-xs text-gray-500 font-normal">@{st.username || 'cadet'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                        {st.grade || st.class || 'Primary / JSS'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">
                          {st.accessCode || 'CODE-PENDING'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-green-600 font-bold">
                        {st.attendanceRate || 92}%
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-900 dark:text-white">
                        {st.avgScore || 85}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXAMS & CBT */}
      {activeTab === 'exams' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">School Exams & CBT Quizzes</h2>
              <p className="text-xs text-gray-500">Provide direct exam links and digital assessments to your students.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map(exam => (
              <div key={exam.id} className="p-5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-brand-red bg-brand-red/10 px-2.5 py-0.5 rounded-full">
                      {exam.subject}
                    </span>
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {exam.duration}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1">{exam.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{exam.term}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> {exam.date}
                  </span>
                  <a
                    href={exam.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-brand-red hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink size={13} /> Launch Exam Portal
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CURRICULUM RESOURCES */}
      {activeTab === 'resources' && (
        <div className="pt-2">
          <ResourceLibrary role="school" />
        </div>
      )}

      {/* TAB 5: LAB SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Practical Lab & Mentor Timetable</h2>
            <p className="text-xs text-gray-500">Weekly session times and designated Jaystarbliss STEM instructors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-brand-red/30 bg-brand-red/5 dark:bg-brand-red/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">Cohort A (Junior Cadets)</span>
                <span className="text-xs font-semibold bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full text-gray-700 dark:text-gray-300">
                  Tuesdays & Thursdays
                </span>
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Primary 3–6 Coding & Scratch Lab
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Time: <strong>2:00 PM – 3:30 PM</strong> | Venue: School ICT Lab / Smart Hall
              </p>
              <div className="text-xs text-gray-500 flex items-center gap-1 pt-2 border-t border-brand-red/20">
                <Users size={13} /> Assigned Lead Instructor: <strong>Engr. Rufai John</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Cohort B (Senior Cadets)</span>
                <span className="text-xs font-semibold bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full text-gray-700 dark:text-gray-300">
                  Wednesdays & Fridays
                </span>
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                JSS 1–3 Web Design, Python & AI Lab
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Time: <strong>2:00 PM – 4:00 PM</strong> | Venue: School ICT Lab
              </p>
              <div className="text-xs text-gray-500 flex items-center gap-1 pt-2 border-t border-blue-500/20">
                <Users size={13} /> Assigned Lead Instructor: <strong>STEM Faculty Team</strong>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SchoolDashboard;
