import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, CheckCircle2, Users, GraduationCap, AlertCircle, 
  User, Phone, Mail, Lock, ShieldCheck, BookOpen, Contact, UserPlus, Send 
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useTheme } from '../hooks/useTheme';
import './Register.css';


const SUBJECTS = [
  'Mathematics','English','Physics','Chemistry','Biology',
  'Literature','Government','CRS','Accounting','Commerce',
  'Marketing','Programming','Web Dev','AI Tools','Tech Literacy',
  'Graphic Design','Music','Creative Arts','WAEC Prep','NECO Prep','JAMB Prep'
];

const Register = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<'parent' | 'student'>('parent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Common Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Parent Fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Student Fields
  const [studentClass, setStudentClass] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Password Strength
  const checkStrength = (pw: string) => {
    const criteria = [
      pw.length >= 8,
      /[A-Z]/.test(pw),
      /[0-9]/.test(pw),
      /[^A-Za-z0-9]/.test(pw)
    ];
    return criteria.filter(Boolean).length;
  };

  const pwScore = checkStrength(password);
  const pwColors = ['#ef4444','#f97316','#eab308','#22c55e'];

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !phone || !email) {
      return setError('Please fill in all required fields.');
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return setError('Please enter a valid email address.');
    }

    setLoading(true);

    if (mode === 'parent') {
      if (!password) {
        setLoading(false);
        return setError('Please enter a password.');
      }
      if (password.length < 8) {
        setLoading(false);
        return setError('Password must be at least 8 characters.');
      }
      if (password !== confirmPassword) {
        setLoading(false);
        return setError('Passwords do not match.');
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
        
        const data = {
          name: fullName,
          email: email.toLowerCase(),
          phone,
          role: 'parent',
          children: [],
          emailVerified: false,
          createdAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'parents', cred.user.uid), data);
        await setDoc(doc(db, 'users', cred.user.uid), data);
        
        localStorage.setItem('userId', cred.user.uid);
        localStorage.setItem('userRole', 'parent');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', fullName);
        
        setSuccess('Account created! A verification email has been sent. Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/portal/parent');
        }, 1500);
      } catch (err: any) {
        let msg = 'Registration failed. Please try again.';
        if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered. Try logging in instead.';
        if (err.code === 'auth/weak-password') msg = 'Password too weak — use at least 8 characters.';
        if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
        if (err.code === 'auth/network-request-failed') msg = 'Network error. Please check your connection.';
        setError(msg);
        setLoading(false);
      }
    } else {
      // Student Request
      if (selectedSubjects.length === 0) {
        setLoading(false);
        return setError('Please select at least one subject.');
      }

      try {
        await addDoc(collection(db, 'student_requests'), {
          name: fullName,
          email: email.toLowerCase(),
          phone,
          class: studentClass,
          parentPhone,
          subjects: selectedSubjects,
          notes,
          status: 'pending',
          createdAt: serverTimestamp()
        });
        
        setSuccess('Request submitted! An admin will review and email your access code within 24 hours.');
        // Clear form
        setFullName(''); setPhone(''); setEmail(''); setStudentClass(''); setParentPhone('');
        setSelectedSubjects([]); setNotes('');
      } catch (err) {
        setError('Error submitting request. Please try again or contact support.');
        console.error('Student request error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-page">
      {/* NAV */}
      <nav className="reg-nav">
        <div className="reg-nav-inner">
          <Link to="/" className="reg-nav-brand">
            <img className="reg-nav-brand-icon" src="/favicon-16x16.png" alt="Jaystarbliss Hub" />
            <span className="reg-nav-brand-name">
              Jaystarbliss <span className="hide-xs">Dynamic </span>
              <span style={{ color: 'var(--madder)' }}>Hub</span>
            </span>
          </Link>
          <div className="reg-nav-actions">
            <button className="reg-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <Moon className="w-[15px] h-[15px]" /> : <Sun className="w-[15px] h-[15px]" />}
            </button>
            <Link to="/portal" className="reg-nav-login">Sign In &rarr;</Link>
          </div>
        </div>
      </nav>

      {/* PAGE LAYOUT */}
      <div className="reg-page-layout">

        {/* LEFT HERO PANEL */}
        <section className="reg-hero-panel">
          <div className="reg-hero-content">
            <h1 className="reg-hero-headline">
              Ignite Your<br />
              <em>Potential</em><br />
              With Expert<br />
              Mentorship.
            </h1>
            <p className="reg-hero-sub">
              Join a community dedicated to mastery and brilliance. Your journey begins with a single step.
            </p>
          </div>
          <div className="reg-hero-features">
            <div className="reg-hero-feature">
              <div className="reg-hero-feature-icon red">
                <CheckCircle2 />
              </div>
              <div>
                <div className="reg-hero-feature-title">Personalized Learning</div>
                <div className="reg-hero-feature-desc">Tailored curriculums for every unique student.</div>
              </div>
            </div>
            <div className="reg-hero-feature">
              <div className="reg-hero-feature-icon gold">
                <Users />
              </div>
              <div>
                <div className="reg-hero-feature-title">Expert Tutors</div>
                <div className="reg-hero-feature-desc">Learn from the best in the industry.</div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT FORM PANEL */}
        <section className="reg-form-panel">
          <div className="reg-form-card">
            
            <div className="reg-form-heading">
              <h2>Create an account</h2>
              <p>Join Jaystarbliss Dynamic Hub today.</p>
            </div>

            {/* MODE TOGGLE */}
            <div className="reg-mode-toggle">
              <button 
                className={`reg-mode-btn ${mode === 'parent' ? 'active' : ''}`}
                onClick={() => { setMode('parent'); setError(''); setSuccess(''); }}
              >
                <Users />
                Parent Account
              </button>
              <button 
                className={`reg-mode-btn ${mode === 'student' ? 'active' : ''}`}
                onClick={() => { setMode('student'); setError(''); setSuccess(''); }}
              >
                <GraduationCap />
                Student Request
              </button>
            </div>

            {/* ALERTS */}
            {error && (
              <div className="reg-alert error" role="alert">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="reg-alert success" role="status">
                <CheckCircle2 />
                <span>{success}</span>
              </div>
            )}

            {/* FORM */}
            <form className="reg-form" onSubmit={handleSubmit} noValidate>
              
              {/* COMMON FIELDS */}
              <div className="reg-form-row">
                <div className="reg-form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <div className="reg-input-wrap">
                    <User />
                    <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required />
                  </div>
                </div>
                <div className="reg-form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <div className="reg-input-wrap">
                    <Phone />
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 xxx xxx xxxx" required />
                  </div>
                </div>
              </div>

              <div className="reg-form-group">
                <label htmlFor="email">Email Address *</label>
                <div className="reg-input-wrap">
                  <Mail />
                  <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
                </div>
              </div>

              {/* PARENT FIELDS */}
              {mode === 'parent' && (
                <div className="animate-in fade-in duration-300">
                  <div className="reg-info-box" style={{ marginBottom: '1rem' }}>
                    <strong>Parent Account:</strong> Register to enroll your children, track their progress, and manage payments from one dashboard.
                  </div>

                  <div className="reg-form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="pPassword">Password *</label>
                    <div className="reg-input-wrap">
                      <Lock />
                      <input 
                        type="password" id="pPassword" 
                        value={password} onChange={e => setPassword(e.target.value)} 
                        placeholder="Min. 8 characters" 
                      />
                    </div>
                    <div className="reg-pw-strength-bar">
                      {[0, 1, 2, 3].map(i => (
                        <div 
                          key={i} 
                          className="reg-pw-seg" 
                          style={{ background: (password.length > 0 && i < pwScore) ? pwColors[pwScore - 1] : '' }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="reg-form-group">
                    <label htmlFor="pConfirm">Confirm Password *</label>
                    <div className="reg-input-wrap">
                      <ShieldCheck />
                      <input 
                        type="password" id="pConfirm" 
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} 
                        placeholder="Repeat your password" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STUDENT FIELDS */}
              {mode === 'student' && (
                <div className="animate-in fade-in duration-300">
                  <div className="reg-info-box" style={{ marginBottom: '1rem' }}>
                    <strong>Student Request:</strong> Submit your details. An admin will review and send your access code to your email within 24 hours.
                  </div>

                  <div className="reg-form-row" style={{ marginBottom: '1rem' }}>
                    <div className="reg-form-group">
                      <label htmlFor="sClass">Class / Grade</label>
                      <div className="reg-input-wrap">
                        <BookOpen />
                        <select id="sClass" value={studentClass} onChange={e => setStudentClass(e.target.value)}>
                          <option value="">Select class</option>
                          <option>Primary 1–3</option>
                          <option>Primary 4–6</option>
                          <option>JSS 1</option><option>JSS 2</option><option>JSS 3</option>
                          <option>SS 1</option><option>SS 2</option><option>SS 3</option>
                          <option>University / Tertiary</option>
                          <option>Adult Learner</option>
                        </select>
                      </div>
                    </div>
                    <div className="reg-form-group">
                      <label htmlFor="sParentPhone">Parent's Phone</label>
                      <div className="reg-input-wrap">
                        <Contact />
                        <input type="tel" id="sParentPhone" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="Emergency contact" />
                      </div>
                    </div>
                  </div>

                  <div className="reg-form-group" style={{ marginBottom: '1rem' }}>
                    <label>Subjects of Interest *</label>
                    <div className="reg-subjects-grid">
                      {SUBJECTS.map((subject, idx) => (
                        <div className="reg-subject-chip" key={idx}>
                          <input 
                            type="checkbox" 
                            id={`subj_${idx}`} 
                            checked={selectedSubjects.includes(subject)}
                            onChange={() => handleSubjectChange(subject)}
                          />
                          <label htmlFor={`subj_${idx}`}>{subject}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="reg-form-group">
                    <label htmlFor="sNotes">Learning Goals / Notes</label>
                    <textarea 
                      className="reg-input-bare" id="sNotes" 
                      value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Tell us your goals, requirements, or how you heard about us…" 
                      maxLength={2000}
                    />
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button type="submit" className={`reg-btn-submit ${loading ? 'loading' : ''}`} disabled={loading}>
                <div className="reg-spinner"></div>
                <span className="reg-btn-text" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {mode === 'parent' ? <UserPlus size={16} /> : <Send size={16} />}
                  {mode === 'parent' ? 'Complete Registration' : 'Submit Request'}
                </span>
              </button>

            </form>

            <div className="reg-divider">or</div>
            <div className="reg-form-footer">
              Already have an account? <Link to="/portal">Login here</Link>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Register;
