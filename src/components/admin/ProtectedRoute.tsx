import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Loader2 } from 'lucide-react';
import ChangePasswordModal from '../portal/ChangePasswordModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectPath = '/portal' 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mustResetPassword, setMustResetPassword] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        // 1. Check Super Admin by email
        if (currentUser.email === 'johnrufai242@gmail.com') {
          sessionStorage.setItem('userRole', 'super_admin');
          sessionStorage.setItem('userId', currentUser.uid);
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        let userRole = '';
        let userName = currentUser.displayName || '';
        let forceReset = false;

        // 2. Check users collection
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const uData = userDoc.data();
          userRole = (uData.role || '').toUpperCase();
          if (uData.name && !userName) userName = uData.name;
          if (uData.forcePasswordReset === true) forceReset = true;
        }

        // 3. Fallback: check individualStudents collection
        if (!userRole) {
          const studentQuery = query(
            collection(db, 'individualStudents'),
            where('firebaseUid', '==', currentUser.uid)
          );
          const studentSnap = await getDocs(studentQuery);
          if (!studentSnap.empty) {
            const sData = studentSnap.docs[0].data();
            userRole = 'STUDENT';
            sessionStorage.setItem('studentDocId', studentSnap.docs[0].id);
            if (sData.fullName) userName = sData.fullName;
            if (sData.forcePasswordReset === true) forceReset = true;
          }
        }

        // 4. Fallback: check parents collection
        if (!userRole) {
          const parentDoc = await getDoc(doc(db, 'parents', currentUser.uid));
          if (parentDoc.exists()) {
            const pData = parentDoc.data();
            userRole = 'PARENT';
            if (pData.name) userName = pData.name;
            if (pData.forcePasswordReset === true) forceReset = true;
          }
        }

        // 5. Fallback: check schools collection
        if (!userRole) {
          const schoolDoc = await getDoc(doc(db, 'schools', currentUser.uid));
          if (schoolDoc.exists()) {
            const scData = schoolDoc.data();
            userRole = 'SCHOOL';
            if (scData.name) userName = scData.name;
            if (scData.forcePasswordReset === true) forceReset = true;
          }
        }

        // 6. Fallback: check tutors collection
        if (!userRole) {
          const tutorDoc = await getDoc(doc(db, 'tutors', currentUser.uid));
          if (tutorDoc.exists()) {
            const tData = tutorDoc.data();
            userRole = 'TUTOR';
            if (tData.name) userName = tData.name;
            if (tData.forcePasswordReset === true) forceReset = true;
          }
        }

        // Default to USER if nothing found
        if (!userRole) {
          userRole = (sessionStorage.getItem('userRole') || 'USER').toUpperCase();
        }

        sessionStorage.setItem('userRole', userRole.toLowerCase());
        sessionStorage.setItem('userId', currentUser.uid);
        if (userName) sessionStorage.setItem('userName', userName);

        // Check if forced password reset is triggered
        if (forceReset) {
          setMustResetPassword(true);
        }

        // Normalize roles comparison
        const normalizedRole = userRole.toUpperCase();

        if (normalizedRole.includes('ADMIN')) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        if (!allowedRoles || allowedRoles.length === 0) {
          if (location.pathname.startsWith('/admin')) {
            setIsAuthorized(normalizedRole.includes('ADMIN'));
          } else {
            setIsAuthorized(true);
          }
        } else {
          const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
          
          // Map aliases (e.g. INDIVIDUALSTUDENT -> STUDENT, TUTOR -> STAFF)
          const isAllowed = normalizedAllowed.some(allowed => {
            if (allowed === normalizedRole) return true;
            if (allowed === 'STUDENT' && (normalizedRole === 'INDIVIDUALSTUDENT' || normalizedRole === 'STUDENT')) return true;
            if (allowed === 'STAFF' && (normalizedRole === 'TUTOR' || normalizedRole === 'STAFF')) return true;
            if (allowed === 'TUTOR' && (normalizedRole === 'STAFF' || normalizedRole === 'TUTOR')) return true;
            return false;
          });

          setIsAuthorized(isAllowed);
        }
      } catch (error) {
        console.error("Error fetching user role in ProtectedRoute:", error);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedRoles, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <>
      {mustResetPassword && (
        <ChangePasswordModal
          isOpen={true}
          isForced={true}
          onSuccess={() => setMustResetPassword(false)}
        />
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
