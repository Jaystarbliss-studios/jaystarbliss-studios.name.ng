import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  School, GraduationCap, Users, ShieldCheck, Mail, Lock, 
  Eye, EyeOff, ArrowLeft, Sun, Moon, KeyRound, UserCheck
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, updateDoc, collection, 
  query, where, getDocs, serverTimestamp, deleteDoc 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useTheme } from '../hooks/useTheme';
import { JaystarblissIcon } from '../components/common/JaystarblissLogo';
import SEO from '../components/ui/SEO';
import './Portal.css';

type Role = 'school' | 'student' | 'parent' | 'staff';

const STAFF_REG_CODE_FALLBACK = 'JAYSTAR2024';

function studentAuthEmail(username: string): string {
  return username.toLowerCase().replace(/[^a-z0-9]/g, '') + '@jdh-student.local';
}

function deriveStudentAuthPassword(code: string): string {
  // Firebase Auth requires passwords >= 6 characters.
  // Deterministically expand short student PINs/codes to maintain valid auth sessions.
  if (code.length >= 6) return code;
  return `jdh_std_${code}_2024`;
}

function deriveSchoolAuthPassword(code: string): string {
  if (code.length >= 6) return code;
  return `jdh_sch_${code}_2024`;
}

const Portal: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<Role>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState(''); // username, email, or school code
  const [password, setPassword] = useState('');     // password or access code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Staff registration toggle
  const [showStaffReg, setShowStaffReg] = useState(false);
  const [staffRegCode, setStaffRegCode] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPw, setStaffPw] = useState('');

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');

  const handleStudentLogin = async () => {
    const rawInput = identifier.trim();
    const code = password.trim();

    if (!rawInput || !code) {
      throw new Error('Please enter both your Student Username / Email and Access Code.');
    }

    // 1. Look up student in individualStudents (by username, email, or accessCode)
    let sdoc: any = null;
    let sdata: any = null;

    // Check by username
    const usernameQuery = query(
      collection(db, 'individualStudents'),
      where('username', '==', rawInput.toLowerCase())
    );
    const uSnap = await getDocs(usernameQuery);
    if (!uSnap.empty) {
      sdoc = uSnap.docs[0];
      sdata = sdoc.data();
    }

    // Check by email
    if (!sdoc) {
      const emailQuery = query(
        collection(db, 'individualStudents'),
        where('email', '==', rawInput.toLowerCase())
      );
      const eSnap = await getDocs(emailQuery);
      if (!eSnap.empty) {
        sdoc = eSnap.docs[0];
        sdata = sdoc.data();
      }
    }

    // Check in legacy students collection
    if (!sdoc) {
      const legacyQuery = query(
        collection(db, 'students'),
        where('email', '==', rawInput.toLowerCase())
      );
      const lSnap = await getDocs(legacyQuery);
      if (!lSnap.empty) {
        sdoc = lSnap.docs[0];
        sdata = sdoc.data();
      }
    }

    // If student record exists in Firestore, verify access code
    if (sdoc && sdata) {
      if (sdata.accessCode && sdata.accessCode !== code) {
        throw new Error('Invalid access code for this student username. Please contact your instructor.');
      }
    }

    const effectiveUsername = (sdata?.username || rawInput).toLowerCase().replace(/\s+/g, '');
    const isRealEmail = rawInput.includes('@') && !rawInput.endsWith('.local');
    const authEmailToUse = isRealEmail ? rawInput.toLowerCase() : studentAuthEmail(effectiveUsername);
    const authPassword = deriveStudentAuthPassword(code);

    let firebaseUid = '';

    try {
      const cred = await signInWithEmailAndPassword(auth, authEmailToUse, authPassword);
      firebaseUid = cred.user.uid;
    } catch (authErr: any) {
      if (
        authErr.code === 'auth/user-not-found' ||
        authErr.code === 'auth/invalid-credential' ||
        authErr.code === 'auth/invalid-login-credentials'
      ) {
        // First login — auto create Firebase Auth account
        try {
          const cred = await createUserWithEmailAndPassword(auth, authEmailToUse, authPassword);
          firebaseUid = cred.user.uid;
        } catch (createErr: any) {
          if (createErr.code === 'auth/email-already-in-use') {
            throw new Error('Incorrect access code for this student account.');
          }
          if (createErr.code === 'auth/weak-password') {
            throw new Error('Access code or password must be at least 6 characters.');
          }
          throw createErr;
        }
      } else if (authErr.code === 'auth/wrong-password') {
        throw new Error('Access code mismatch. Your instructor may have updated your code — please contact them.');
      } else if (authErr.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else {
        throw authErr;
      }
    }

    // Ensure users doc exists
    await setDoc(doc(db, 'users', firebaseUid), {
      email: authEmailToUse,
      name: sdata?.fullName || effectiveUsername,
      role: 'student',
      studentDocId: sdoc ? sdoc.id : firebaseUid,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Backfill firebaseUid into individualStudents doc if needed
    if (sdoc && (!sdata.firebaseUid || sdata.firebaseUid !== firebaseUid)) {
      try {
        await updateDoc(doc(db, 'individualStudents', sdoc.id), {
          firebaseUid,
          authEmail: authEmailToUse
        });
      } catch (upErr) {
        console.warn('Student firebaseUid backfill non-fatal:', upErr);
      }
    }

    sessionStorage.setItem('userRole', 'student');
    sessionStorage.setItem('userId', firebaseUid);
    sessionStorage.setItem('studentDocId', sdoc ? sdoc.id : firebaseUid);
    sessionStorage.setItem('userName', sdata?.fullName || effectiveUsername);
    sessionStorage.setItem('studentUsername', effectiveUsername);

    navigate('/portal/student');
  };

  const handleSchoolLogin = async () => {
    const rawInput = identifier.trim();
    const code = password.trim();

    if (!rawInput || !code) {
      throw new Error('Please enter your School Email / Access Code and Password.');
    }

    // 1. Try direct Firebase Auth
    if (rawInput.includes('@')) {
      try {
        const cred = await signInWithEmailAndPassword(auth, rawInput, code);
        const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
        const userData = userSnap.data() || {};
        
        if (cred.user.email === 'johnrufai242@gmail.com' || (userData.role || '').toUpperCase().includes('ADMIN')) {
          navigate('/admin');
          return;
        }

        sessionStorage.setItem('userRole', 'school');
        sessionStorage.setItem('userId', cred.user.uid);
        sessionStorage.setItem('userName', userData.name || 'Partner School');
        navigate('/portal/school');
        return;
      } catch (authErr) {
        console.warn('Direct auth failed, checking schools collection:', authErr);
      }
    }

    // 2. Query schools collection by accessCode or schoolId
    const schoolSnap = await getDocs(collection(db, 'schools'));
    let matchedSchool: any = null;
    schoolSnap.forEach(d => {
      const s = d.data();
      if (
        s.accessCode === code || 
        s.accessCode === rawInput ||
        s.email?.toLowerCase() === rawInput.toLowerCase() ||
        d.id === rawInput
      ) {
        matchedSchool = { id: d.id, ...s };
      }
    });

    if (!matchedSchool) {
      throw new Error('Invalid school credentials or access code. Contact administrator for school partnership access.');
    }

    // Sign in or create auth session for school
    const schoolAuthEmail = matchedSchool.email || `school-${matchedSchool.id}@jdh-school.local`;
    const schoolAuthPassword = deriveSchoolAuthPassword(code);
    let firebaseUid = '';

    try {
      const cred = await signInWithEmailAndPassword(auth, schoolAuthEmail, schoolAuthPassword);
      firebaseUid = cred.user.uid;
    } catch (e: any) {
      if (
        e.code === 'auth/user-not-found' || 
        e.code === 'auth/invalid-credential' ||
        e.code === 'auth/invalid-login-credentials'
      ) {
        const cred = await createUserWithEmailAndPassword(auth, schoolAuthEmail, schoolAuthPassword);
        firebaseUid = cred.user.uid;
      } else if (e.code === 'auth/weak-password') {
        throw new Error('Access code or password must be at least 6 characters.');
      } else {
        throw e;
      }
    }

    await setDoc(doc(db, 'users', firebaseUid), {
      email: schoolAuthEmail,
      name: matchedSchool.name || 'Partner School',
      role: 'school',
      schoolId: matchedSchool.id,
      updatedAt: serverTimestamp()
    }, { merge: true });

    sessionStorage.setItem('userRole', 'school');
    sessionStorage.setItem('userId', firebaseUid);
    sessionStorage.setItem('schoolId', matchedSchool.id);
    sessionStorage.setItem('userName', matchedSchool.name || 'Partner School');

    navigate('/portal/school');
  };

  const handleGeneralLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (activeTab === 'parent' || activeTab === 'staff') {
      if (password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }
    }

    setLoading(true);

    try {
      if (activeTab === 'student') {
        await handleStudentLogin();
        return;
      }

      if (activeTab === 'school') {
        await handleSchoolLogin();
        return;
      }

      // Parent or Staff Email Login
      const email = identifier.trim();
      if (!email || !password) {
        throw new Error('Please enter your email and password.');
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};
      const userRole = cred.user.email === 'johnrufai242@gmail.com' ? 'SUPER_ADMIN' : (userData.role || activeTab).toUpperCase();

      if (userRole.includes('ADMIN')) {
        navigate('/admin');
        return;
      }

      const expectedRole = activeTab.toUpperCase();
      const isStaffTab = expectedRole === 'STAFF';
      const isStaffUser = userRole === 'STAFF' || userRole === 'TUTOR';

      if (userRole !== expectedRole && !(isStaffTab && isStaffUser)) {
        throw new Error(`Wrong tab for this account. Please use the ${userData.role || 'USER'} tab.`);
      }

      sessionStorage.setItem('userRole', activeTab);
      sessionStorage.setItem('userId', cred.user.uid);
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userName', userData.name || email.split('@')[0]);

      navigate(`/portal/${activeTab}`);
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = err.message || 'Invalid credentials. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        msg = 'No account found with these credentials. Please check your details or sign up.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password or access code.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userSnap = await getDoc(doc(db, 'users', user.uid));

      let userRole = user.email === 'johnrufai242@gmail.com' ? 'SUPER_ADMIN' : activeTab.toUpperCase();

      if (!userSnap.exists()) {
        // Check for pending invite
        const inviteDocRef = doc(db, 'invites', (user.email || '').toLowerCase());
        const inviteSnap = await getDoc(inviteDocRef);
        
        if (inviteSnap.exists()) {
          userRole = inviteSnap.data().role;
          await deleteDoc(inviteDocRef);
        }

        // Auto-create for first-time Google sign-in
        const newRecord = {
          email: user.email,
          name: user.displayName || '',
          role: activeTab === 'parent' ? 'parent' : userRole.toLowerCase(),
          createdAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', user.uid), newRecord);
        if (activeTab === 'parent') {
          await setDoc(doc(db, 'parents', user.uid), newRecord, { merge: true });
        }
      } else {
        const userData = userSnap.data();
        userRole = user.email === 'johnrufai242@gmail.com' ? 'SUPER_ADMIN' : (userData.role || 'USER').toUpperCase();
      }

      if (userRole.includes('ADMIN') || user.email === 'johnrufai242@gmail.com') {
        navigate('/admin');
        return;
      }

      const expectedRole = activeTab.toUpperCase();
      const isStaffTab = expectedRole === 'STAFF';
      const isStaffUser = userRole === 'STAFF' || userRole === 'TUTOR';

      if (userRole !== expectedRole && !(isStaffTab && isStaffUser)) {
        throw new Error(`This Google account is registered as ${userRole}. Please switch to the ${userRole.toLowerCase()} tab.`);
      }
      
      sessionStorage.setItem('userRole', activeTab);
      sessionStorage.setItem('userId', user.uid);
      sessionStorage.setItem('userEmail', user.email || '');
      sessionStorage.setItem('userName', user.displayName || '');

      navigate(`/portal/${activeTab}`);
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Google sign-in failed.';
      if (err.code === 'auth/popup-closed-by-user') msg = 'Sign-in popup was closed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (staffPw.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      // Check registration code
      let validCode = STAFF_REG_CODE_FALLBACK;
      try {
        const codeSnap = await getDoc(doc(db, 'staffRegistration', 'code'));
        if (codeSnap.exists() && codeSnap.data().code) {
          validCode = codeSnap.data().code;
        }
      } catch (e) {
        console.warn('Could not read staffRegistration code doc, using default fallback:', e);
      }

      if (staffRegCode.trim() !== validCode) {
        throw new Error('Invalid staff registration code. Please contact your Institute Admin.');
      }

      const cred = await createUserWithEmailAndPassword(auth, staffEmail.trim(), staffPw);
      
      const staffDocData = {
        email: staffEmail.trim().toLowerCase(),
        name: staffName.trim(),
        role: 'staff',
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', cred.user.uid), staffDocData);
      await setDoc(doc(db, 'tutors', cred.user.uid), staffDocData);

      setSuccess('Staff account created successfully! You can now log in.');
      setShowStaffReg(false);
      setIdentifier(staffEmail.trim());
      setPassword(staffPw);
    } catch (err: any) {
      let msg = err.message || 'Staff registration failed.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered. Please log in instead.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Role; label: string; icon: React.ReactNode }[] = [
    { id: 'student', label: 'Students', icon: <GraduationCap size={16} /> },
    { id: 'school', label: 'Schools', icon: <School size={16} /> },
    { id: 'parent', label: 'Parents', icon: <Users size={16} /> },
    { id: 'staff', label: 'Staff', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <div className="jdh-portal">
      <SEO 
        title="Academy & Client Portal — Jaystarbliss Studios" 
        description="Access student dashboards, school portals, parent progress reports, and staff workspace." 
      />
      <div className="scanlines"></div>
      
      <div className="card">
        {/* LEFT DECO PANEL */}
        <div className="deco-panel">
          <div className="deco-left-col">
            <div className="deco-brand">
              <div className="brand-mark flex items-center justify-center">
                <JaystarblissIcon className="w-10 h-10" />
              </div>
              <div className="brand-name">Jaystarbliss<br/>Studios</div>
            </div>
            
            <div className="deco-content mt-8">
              <div className="deco-tagline">Learn. <br/><span>Grow.</span> <br/>Thrive.</div>
            </div>
            
            <div className="sys-stats">
              <span className="sys-stat">Security: Active (TLS 1.3)</span>
              <span className="sys-stat">Node: JDH-HUB-Lagos</span>
              <span className="sys-stat">Engine: Dynamic Institute 4.5</span>
            </div>
          </div>
          
          <div className="orbital-wrap">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-4"></div>
            <div className="ring ring-3"></div>
            <div className="orbital-core">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="form-panel">
          <div className="role-tabs">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                type="button"
                className={`role-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => { 
                  setActiveTab(tab.id); 
                  setError(''); 
                  setSuccess('');
                  setIdentifier(''); 
                  setPassword(''); 
                  setShowStaffReg(false);
                }}
              >
                <span className="tab-ico">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="form-body">
            {showStaffReg ? (
              <div className="pane">
                <div className="form-title">Staff <em>Registration</em></div>
                <div className="form-sub">Enter your staff authorization credentials</div>

                {error && <div className="msg msg-error show">{error}</div>}
                {success && <div className="msg msg-success show">{success}</div>}

                <form onSubmit={handleStaffRegistration}>
                  <div className="field">
                    <label>Staff Registration Code</label>
                    <div className="input-wrap">
                      <span className="input-icon"><KeyRound size={15} /></span>
                      <input 
                        type="text" 
                        placeholder="e.g. JAYSTAR2024" 
                        required 
                        value={staffRegCode}
                        onChange={e => setStaffRegCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Full Name</label>
                    <div className="input-wrap">
                      <span className="input-icon"><UserCheck size={15} /></span>
                      <input 
                        type="text" 
                        placeholder="Instructor Name" 
                        required 
                        value={staffName}
                        onChange={e => setStaffName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Official Email</label>
                    <div className="input-wrap">
                      <span className="input-icon"><Mail size={15} /></span>
                      <input 
                        type="email" 
                        placeholder="tutor@jaystarbliss.ng" 
                        required 
                        value={staffEmail}
                        onChange={e => setStaffEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Create Password</label>
                    <div className="input-wrap">
                      <span className="input-icon"><Lock size={15} /></span>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="has-eye" 
                        placeholder="Min 6 characters" 
                        required 
                        value={staffPw}
                        onChange={e => setStaffPw(e.target.value)}
                      />
                      <button type="button" className="pw-eye" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                    {loading && <div className="btn-spinner" style={{ display: 'block' }}></div>}
                    <span className="btn-text">Complete Staff Registration &rarr;</span>
                  </button>

                  <div className="toggle-link mt-4">
                    Already registered? <button type="button" onClick={() => setShowStaffReg(false)} className="text-brand-red font-semibold underline">Back to Login</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="pane">
                <div className="form-title capitalize">{activeTab} <em>Portal Login</em></div>
                <div className="form-sub">
                  {activeTab === 'student' && 'Enter your Student Username & Access Code'}
                  {activeTab === 'school' && 'Enter your School Email or Partner Access Code'}
                  {activeTab === 'parent' && 'Sign in to monitor your children’s classes & progress'}
                  {activeTab === 'staff' && 'Sign in to your tutor & instructor workspace'}
                </div>
                
                {error && <div className="msg msg-error show">{error}</div>}
                {success && <div className="msg msg-success show">{success}</div>}
                
                <form onSubmit={handleGeneralLogin} autoComplete="on">
                  <div className="field">
                    <label>
                      {activeTab === 'student' && 'Student Username or Email'}
                      {activeTab === 'school' && 'School Email or Terminal ID'}
                      {activeTab === 'parent' && 'Parent Email Address'}
                      {activeTab === 'staff' && 'Staff / Tutor Email'}
                    </label>
                    <div className="input-wrap">
                      <span className="input-icon"><Mail size={15} /></span>
                      <input 
                        type={activeTab === 'student' || activeTab === 'school' ? 'text' : 'email'} 
                        placeholder={
                          activeTab === 'student' ? 'e.g. john or john@example.com' :
                          activeTab === 'school' ? 'school@institution.edu' :
                          activeTab === 'parent' ? 'parent@example.com' : 'staff@jaystarbliss.ng'
                        } 
                        required 
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="field">
                    <label>
                      {activeTab === 'student' ? 'Student Access Code (Password)' : 'Password / Access Code'}
                    </label>
                    <div className="input-wrap">
                      <span className="input-icon"><Lock size={15} /></span>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="has-eye" 
                        placeholder="••••••••" 
                        required 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button type="button" className="pw-eye" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="field" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        id="rememberMe" 
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{ width: 'auto' }} 
                      />
                      <label htmlFor="rememberMe" style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--muted)', textTransform: 'none', letterSpacing: 'normal' }}>
                        Remember me
                      </label>
                    </div>

                    {activeTab === 'staff' && (
                      <button 
                        type="button" 
                        onClick={() => { setShowStaffReg(true); setError(''); setSuccess(''); }}
                        className="text-xs font-semibold text-brand-red hover:underline"
                      >
                        Register as Staff
                      </button>
                    )}
                  </div>
                  
                  <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                    {loading && <div className="btn-spinner" style={{ display: 'block' }}></div>}
                    <span className="btn-text">
                      {activeTab === 'student' ? 'Launch Student Hub &rarr;' : 'Initialize Access &rarr;'}
                    </span>
                  </button>
                </form>

                {(activeTab === 'parent' || activeTab === 'staff') && (
                  <>
                    <div className="auth-divider">or</div>
                    <button type="button" className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.5 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20c10.8 0 19.6-8.5 19.6-20 0-1.3-.1-2.6-.4-3.9z"/>
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
                        <path fill="#4CAF50" d="M24 45c4.9 0 9.3-1.8 12.7-4.8l-5.9-5c-1.8 1.3-4 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 41 16.2 45 24 45z"/>
                        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l5.9 5C36.7 39.8 44 34.3 44 25c0-1.3-.1-2.6-.4-3.9z"/>
                      </svg>
                      <span className="btn-text">Continue with Google</span>
                    </button>
                  </>
                )}

                <div className="toggle-link">
                  Don't have an account yet? <Link to="/register">Register / Enroll Here &rarr;</Link>
                </div>
              </div>
            )}
          </div>

          <div className="form-foot">
            <Link to="/" className="back-link"><ArrowLeft size={14} /> Main Site</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Build v4.5.0
              </span>
              <button type="button" className="theme-btn" onClick={toggleTheme} title="Toggle theme">
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;

