import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectPath = '/admin/login' 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            let role = userData.role || 'USER';
            if (currentUser.email === 'johnrufai242@gmail.com') {
              role = 'SUPER_ADMIN';
            }
            
            // If no specific roles required, but it's an admin path, check for ADMIN
            if (!allowedRoles) {
              if (location.pathname.startsWith('/admin')) {
                 setIsAuthorized(role.includes('ADMIN'));
              } else {
                 setIsAuthorized(true);
              }
            } else {
              // Super admin can access anything
              if (role === 'SUPER_ADMIN') {
                setIsAuthorized(true);
              } else {
                setIsAuthorized(allowedRoles.includes(role));
              }
            }
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedRoles, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-neutral dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
