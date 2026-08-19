import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  School, GraduationCap, Users, ShieldCheck, Mail, Lock, 
  Eye, EyeOff, ArrowLeft, Sun, Moon 
} from 'lucide-react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useTheme } from '../hooks/useTheme';
import { JaystarblissIcon } from '../components/common/JaystarblissLogo';
import SEO from '../components/ui/SEO';
import './Portal.css'; // Import custom styling

type Role = 'school' | 'student' | 'parent' | 'staff';

const Portal: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<Role>('school');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const userRole = cred.user.email === 'johnrufai242@gmail.com' ? 'SUPER_ADMIN' : (userData.role || 'USER').toUpperCase();
        const expectedRole = activeTab.toUpperCase();

        if (userRole.includes('ADMIN')) {
           navigate('/admin');
           return;
        }

        const isStaffTab = expectedRole === 'STAFF';
        const isStaffUser = userRole === 'STAFF' || userRole === 'TUTOR';

        if (userRole !== expectedRole && !(isStaffTab && isStaffUser)) {
           throw new Error(`Wrong tab for this account. Please use the ${userData.role || 'USER'} tab.`);
        }
      }
      
      navigate(`/portal/${activeTab}`);
    } catch (err: any) {
      console.error(err);
      let msg = 'Invalid credentials. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') msg = 'No account found. Please click Sign up (Register) below to create one.';
      if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
      if (err.message && err.message.includes('tab')) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

const handleGoogleLogin = async () => {
    setError('');
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
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || '',
          role: userRole,
          createdAt: serverTimestamp()
        });
      } else {
        const userData = userSnap.data();
        userRole = user.email === 'johnrufai242@gmail.com' ? 'SUPER_ADMIN' : (userData.role || 'USER').toUpperCase();
      }

      const expectedRole = activeTab.toUpperCase();

      if (userRole.includes('ADMIN')) {
         navigate('/admin');
         return;
      }

      const isStaffTab = expectedRole === 'STAFF';
      const isStaffUser = userRole === 'STAFF' || userRole === 'TUTOR';

      if (userRole !== expectedRole && !(isStaffTab && isStaffUser)) {
         throw new Error(`This account belongs to a ${userRole || 'USER'}. Please switch tabs.`);
      }
      
      navigate(`/portal/${activeTab}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Role; label: string; icon: React.ReactNode }[] = [
    { id: 'school', label: 'Schools', icon: <School size={16} /> },
    { id: 'student', label: 'Students', icon: <GraduationCap size={16} /> },
    { id: 'parent', label: 'Parents', icon: <Users size={16} /> },
    { id: 'staff', label: 'Staff', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <div className="jdh-portal">
      <SEO 
        title="Academy & Client Portal" 
        description="Access your student dashboard, parent reports, staff tools, and school management portal at Jaystarbliss Studios." 
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
              <span className="sys-stat">Protocol: AES-256-GCM</span>
              <span className="sys-stat">Status: Surveillance Active</span>
              <span className="sys-stat">Node: 0xFF-JDH-init</span>
            </div>
          </div>
          
          <div className="orbital-wrap">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-4"></div>
            <div className="ring ring-3"></div>
            <div className="orbital-core">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
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
                onClick={() => { setActiveTab(tab.id); setError(''); setEmail(''); setPassword(''); }}
              >
                <span className="tab-ico">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="form-body">
            <div className="pane">
              <div className="form-title capitalize">{activeTab} <em>Login</em></div>
              <div className="form-sub">Sign in with your {activeTab} credentials</div>
              
              {error && <div className="msg msg-error show">{error}</div>}
              
              <form onSubmit={handleLogin} autoComplete="on">
                <div className="field">
                  <label>Terminal ID (Email)</label>
                  <div className="input-wrap">
                    <span className="input-icon"><Mail size={15} /></span>
                    <input 
                      type="email" 
                      placeholder={`${activeTab}@example.com`} 
                      required 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="field">
                  <label>Access Code (Password)</label>
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
                
                <div className="field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '-0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="rememberMe" 
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ width: 'auto' }} 
                  />
                  <label htmlFor="rememberMe" style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--muted)', textTransform: 'none', letterSpacing: 'normal' }}>
                    Remember me for 30 days
                  </label>
                </div>
                
                <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading && <div className="btn-spinner" style={{ display: 'block' }}></div>}
                  <span className="btn-text">Initialize Access &rarr;</span>
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
                Don't have an account? <Link to="/register">Sign up (Register) &rarr;</Link>
              </div>
            </div>
          </div>

          <div className="form-foot">
            <Link to="/" className="back-link"><ArrowLeft size={14} /> Main Site</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Build v4.4.0
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
