import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, setDoc, addDoc, updateDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';

const AdminApprovals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'tutors' | 'enrollments'>('students');
  const [studentReqs, setStudentReqs] = useState<any[]>([]);
  const [tutorReqs, setTutorReqs] = useState<any[]>([]);
  const [enrollmentReqs, setEnrollmentReqs] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch pending student requests
    const qStudents = query(collection(db, 'student_requests'), where('status', '==', 'pending'));
    const unsubStudents = onSnapshot(qStudents, (snap) => {
      setStudentReqs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qTutors = query(collection(db, 'tutor_applications'), where('status', '==', 'pending'));
    const unsubTutors = onSnapshot(qTutors, (snap) => {
      setTutorReqs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qEnrollments = query(collection(db, 'enrollment_requests'), where('status', '==', 'pending'));
    const unsubEnrollments = onSnapshot(qEnrollments, (snap) => {
      setEnrollmentReqs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubStudents();
      unsubTutors();
      unsubEnrollments();
    };
  }, []);

  const generateAccessCode = (length = 7) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => chars[b % chars.length]).join('');
  };

  const approveStudent = async (req: any) => {
    if (!window.confirm(`Approve student ${req.name}?`)) return;
    setLoadingId(req.id);
    try {
      const accessCode = generateAccessCode();
      const subjects = Array.isArray(req.subjects) ? req.subjects : (req.subjects || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      
      await addDoc(collection(db, 'students'), {
        fullName: req.name,
        username: (req.email || req.name).split('@')[0].replace(/\s+/g,'').toLowerCase(),
        email: (req.email || '').toLowerCase(),
        accessCode,
        parentId: req.parentId || null,
        subjects,
        registeredAt: serverTimestamp()
      });

      await updateDoc(doc(db, 'student_requests', req.id), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      alert(`Approved! Access code: ${accessCode}`);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const approveTutor = async (req: any) => {
    if (!window.confirm(`Approve tutor ${req.name}?`)) return;
    setLoadingId(req.id);
    try {
      const subjects = Array.isArray(req.subjects) ? req.subjects : (req.subjects || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      await setDoc(doc(db, 'tutors', req.id), {
        name: req.name,
        email: req.email,
        phone: req.phone || '',
        subjects,
        bio: req.bio || '',
        role: 'tutor',
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'tutor_applications', req.id), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      alert('Tutor approved!');
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const rejectRequest = async (collectionName: string, id: string) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;
    setLoadingId(id);
    try {
      await updateDoc(doc(db, collectionName, id), {
        status: 'rejected',
        rejectedAt: serverTimestamp()
      });
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approvals & Requests</h1>
      
      <div className="flex border-b border-gray-200 dark:border-slate-800">
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'students' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('students')}
        >
          Student Requests ({studentReqs.length})
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'tutors' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('tutors')}
        >
          Tutor Apps ({tutorReqs.length})
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === 'enrollments' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('enrollments')}
        >
          Enrollments ({enrollmentReqs.length})
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
          <thead className="bg-gray-50 dark:bg-slate-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
            {activeTab === 'students' && studentReqs.map(req => (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{req.name}</div>
                  <div className="text-sm text-gray-500">{req.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">{Array.isArray(req.subjects) ? req.subjects.join(', ') : req.subjects}</div>
                  <div className="text-sm text-gray-500">{req.grade || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {req.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => approveStudent(req)} disabled={loadingId === req.id} className="text-green-600 hover:text-green-900 disabled:opacity-50">Approve</button>
                  <button onClick={() => rejectRequest('student_requests', req.id)} disabled={loadingId === req.id} className="text-red-600 hover:text-red-900 disabled:opacity-50">Reject</button>
                </td>
              </tr>
            ))}
            
            {activeTab === 'tutors' && tutorReqs.map(req => (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{req.name}</div>
                  <div className="text-sm text-gray-500">{req.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">{Array.isArray(req.subjects) ? req.subjects.join(', ') : req.subjects}</div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">{req.bio || 'No bio'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {req.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => approveTutor(req)} disabled={loadingId === req.id} className="text-green-600 hover:text-green-900 disabled:opacity-50">Approve</button>
                  <button onClick={() => rejectRequest('tutor_applications', req.id)} disabled={loadingId === req.id} className="text-red-600 hover:text-red-900 disabled:opacity-50">Reject</button>
                </td>
              </tr>
            ))}
            
            {activeTab === 'enrollments' && enrollmentReqs.map(req => (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{req.studentName}</div>
                  <div className="text-sm text-gray-500">{req.studentEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">Plan: {req.plan}</div>
                  <div className="text-sm text-gray-500">Parent: {req.parentEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {req.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => rejectRequest('enrollment_requests', req.id)} disabled={loadingId === req.id} className="text-red-600 hover:text-red-900 disabled:opacity-50">Reject</button>
                </td>
              </tr>
            ))}

            {((activeTab === 'students' && studentReqs.length === 0) || 
              (activeTab === 'tutors' && tutorReqs.length === 0) || 
              (activeTab === 'enrollments' && enrollmentReqs.length === 0)) && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                  No pending requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApprovals;
