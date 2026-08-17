import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, CheckCircle2, Users, GraduationCap, AlertCircle, 
  User, Phone, Mail, Lock, ShieldCheck, BookOpen, Contact, UserPlus, Send,
  ArrowRight, ArrowLeft
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, addDoc, doc, setDoc, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
import { useTheme } from '../hooks/useTheme';
import ProgressStepper from '../components/ui/ProgressStepper';
import Tooltip from '../components/ui/Tooltip';
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
  const [currentStep, setCurrentStep] = useState(0);
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

  const parentSteps = [
    { id: 'contact', title: 'Basic Info', subtitle: 'Name & email' },
    { id: 'security', title: 'Security', subtitle: 'Set password' },
    { id: 'review', title: 'Confirmation', subtitle: 'Review & submit' },
  ];

  const studentSteps = [
    { id: 'contact', title: 'Contact Info', subtitle: 'Your details' },
    { id: 'academics', title: 'Subjects', subtitle: 'Class & topics' },
    { id: 'goals', title: 'Goals & Send', subtitle: 'Submit request' },
  ];

  const steps = mode === 'parent' ? parentSteps : studentSteps;

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

  const validateStep = (stepIdx: number): boolean => {
    setError('');
    if (stepIdx === 0) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return false;
      }
      if (!phone.trim()) {
        setError('Please enter your phone number.');
        return false;
      }
      if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setError('Please enter a valid email address.');
        return false;
      }
      return true;
    }

    if (stepIdx === 1) {
      if (mode === 'parent') {
        if (!password) {
          setError('Please enter a password.');
          return false;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          return false;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return false;
        }
        return true;
      } else {
        if (selectedSubjects.length === 0) {
          setError('Please select at least one subject of interest.');
          return false;
        }
        return true;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'parent') {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
        
        let finalRole = email === 'johnrufai242@gmail.com' ? 'super_admin' : mode;
        try {
          const inviteDocRef = doc(db, 'invites', email.toLowerCase());
          const inviteSnap = await getDoc(inviteDocRef);
          if (inviteSnap.exists()) {
             finalRole = inviteSnap.data().role.toLowerCase();
             await deleteDoc(inviteDocRef);
          }
        } catch(e) {
          console.error(e);
        }
        
        const data = {
          name: fullName,
          email: email.toLowerCase(),
          phone,
          role: finalRole,
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
        setCurrentStep(0);
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
            <Tooltip content="Toggle dark/light theme" placement="bottom">
              <button className="reg-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {isDarkMode ? <Moon className="w-[15px] h-[15px]" /> : <Sun className="w-[15px] h-[15px]" />}
              </button>
            </Tooltip>
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
                onClick={() => { setMode('parent'); setCurrentStep(0); setError(''); setSuccess(''); }}
              >
                <Users />
                Parent Account
              </button>
              <button 
                className={`reg-mode-btn ${mode === 'student' ? 'active' : ''}`}
                onClick={() => { setMode('student'); setCurrentStep(0); setError(''); setSuccess(''); }}
              >
                <GraduationCap />
                Student Request
              </button>
            </div>

            {/* VISUAL PROGRESS STEPPER */}
            <div className="mb-8 pt-2">
              <ProgressStepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={(idx) => {
                  if (idx < currentStep) setCurrentStep(idx);
                }}
                allowStepClick={true}
              />
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
              
              {/* STEP 1: CONTACT / BASIC INFO */}
              {currentStep === 0 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="reg-info-box" style={{ marginBottom: '1rem' }}>
                    <strong>Step 1 of 3:</strong> Enter your basic contact details to get started.
                  </div>

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
                </div>
              )}

              {/* STEP 2: PARENT SECURITY OR STUDENT SUBJECTS */}
              {currentStep === 1 && mode === 'parent' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="reg-info-box" style={{ marginBottom: '1rem' }}>
                    <strong>Step 2 of 3:</strong> Create a secure password for your Parent Account dashboard.
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

              {currentStep === 1 && mode === 'student' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="reg-info-box" style={{ marginBottom: '1rem' }}>
                    <strong>Step 2 of 3:</strong> Select your class level and subjects of interest.
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
                      <label htmlFor="sParentPhone">Parent / Guardian Phone</label>
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
                </div>
              )}

              {/* STEP 3: REVIEW & SUBMIT */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="reg-info-box" style={{ marginBottom: '1rem' }}>
                    <strong>Step 3 of 3:</strong> Review your details before finalizing your {mode === 'parent' ? 'account' : 'request'}.
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-sm">
                    <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Type:</span>
                      <span className="font-bold text-slate-800 dark:text-white capitalize">{mode} Account</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Name:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{fullName}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Email:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{email}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">Phone:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{phone}</span>
                    </div>
                    {mode === 'student' && (
                      <div>
                        <span className="text-slate-500 font-medium block mb-1">Subjects Selected ({selectedSubjects.length}):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSubjects.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-brand-red/10 text-brand-red text-xs font-bold rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {mode === 'student' && (
                    <div className="reg-form-group">
                      <label htmlFor="sNotes">Learning Goals / Notes (Optional)</label>
                      <textarea 
                        className="reg-input-bare" id="sNotes" 
                        value={notes} onChange={e => setNotes(e.target.value)}
                        placeholder="Tell us your goals, requirements, or how you heard about us…" 
                        maxLength={2000}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center gap-3 pt-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 px-6 rounded-xl bg-brand-red text-white font-bold text-sm hover:bg-red-700 shadow-md shadow-brand-red/20 transition-all flex items-center justify-center gap-2"
                  >
                    Next Step <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`flex-1 reg-btn-submit ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    <div className="reg-spinner"></div>
                    <span className="reg-btn-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                      {mode === 'parent' ? <UserPlus size={16} /> : <Send size={16} />}
                      {mode === 'parent' ? 'Complete Registration' : 'Submit Request'}
                    </span>
                  </button>
                )}
              </div>

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

