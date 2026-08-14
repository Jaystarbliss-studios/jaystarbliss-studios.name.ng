import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Users, User, ArrowLeft, Sun, GraduationCap, Phone, UserPlus, BookOpen, FileText } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import jaystarblissLogo from '../assets/jaystarbliss-logo.png';

type Role = 'student' | 'parent' | 'staff';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Role>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student Fields
  const [grade, setGrade] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [goals, setGoals] = useState('');

  // Staff Fields
  const [subjectFocus, setSubjectFocus] = useState('');
  const [resumeLink, setResumeLink] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const baseUserData = {
        fullName,
        phone,
        email,
        role: activeTab,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      let specificData = {};
      if (activeTab === 'student') {
        specificData = { grade, parentPhone, goals };
      } else if (activeTab === 'staff') {
        specificData = { subjectFocus, resumeLink };
      }

      await setDoc(doc(db, 'users', user.uid), {
        ...baseUserData,
        ...specificData
      });

      // Navigate based on role or to login
      navigate(`/portal`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Role; label: string; icon: React.ReactNode }[] = [
    { id: 'student', label: 'STUDENTS', icon: <GraduationCap size={18} /> },
    { id: 'parent', label: 'PARENTS', icon: <Users size={18} /> },
    { id: 'staff', label: 'STAFF / TUTOR', icon: <User size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F5] relative flex items-center justify-center p-4 sm:p-8">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(#f05637 1px, transparent 1px), linear-gradient(90deg, #f05637 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="w-full max-w-[1000px] h-[800px] max-h-[90vh] flex flex-col md:flex-row bg-[#FAFAFA] rounded-[32px] shadow-2xl overflow-hidden relative z-10 border border-red-100/50">
        
        {/* LEFT SIDE (DARK) */}
        <div className="md:w-[40%] bg-[#0A0706] p-10 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-black rounded flex items-center justify-center overflow-hidden border border-gray-800">
              <img src={jaystarblissLogo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xs font-bold tracking-[0.2em] font-mono leading-tight">JAYSTARBLISS</span>
              <span className="text-white text-xs font-bold tracking-[0.2em] font-mono leading-tight">DYNAMIC HUB</span>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] z-0 flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border border-[#f05637]/10 animate-[spin_20s_linear_infinite]">
              <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-[#f05637] rounded-full shadow-[0_0_15px_#f05637]"></div>
            </div>
            <div className="absolute w-[220px] h-[220px] rounded-full border border-[#f05637]/20 animate-[spin_15s_linear_infinite_reverse]">
              <div className="absolute top-[10%] -right-1 w-2 h-2 bg-[#f97316] rounded-full shadow-[0_0_15px_#f97316]"></div>
            </div>
            <div className="absolute w-[140px] h-[140px] rounded-full border border-[#f05637]/30"></div>
            
            <div className="absolute w-24 h-24 bg-[#f05637]/20 rounded-full blur-xl"></div>
            <div className="relative z-10 w-16 h-16 rounded-full border border-[#f05637] flex items-center justify-center bg-[#0A0706]">
              <UserPlus className="text-[#f05637] w-6 h-6" />
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <h2 className="text-[32px] font-extrabold text-white mb-8 font-mono tracking-tighter leading-[1.1]">
              Initialize.<br/>
              <span className="text-[#f05637]">Connect.</span><br/>
              Thrive.
            </h2>
            <div className="text-[#888888] font-mono text-[10px] space-y-1.5 uppercase tracking-widest">
              <p>&gt; PROTOCOL: NEW-NODE-REG</p>
              <p className="text-[#993311]">&gt; STATUS: AWAITING INPUT</p>
              <p>&gt; NODE: 0XFF-JDH-NEW</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (LIGHT) */}
        <div className="md:w-[60%] flex flex-col relative bg-white h-full overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`flex-1 py-5 flex flex-col items-center gap-2 transition-all text-[9px] font-bold tracking-[0.15em] font-mono uppercase ${
                    isActive ? 'text-[#f05637] border-b-2 border-[#f05637] bg-red-50/50' : 'text-[#A0A0A0] hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="opacity-80 mb-1">{tab.icon}</div>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Scrollable Form Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight font-mono">
                Create <span className="text-[#f05637]">{activeTab === 'staff' ? 'Staff/Tutor' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span> Account
              </h2>
              <p className="text-gray-500 text-sm mt-2">Register as a {activeTab} in the Hub</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5 pb-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={16} />
                    </div>
                    <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl pl-10 pr-3 py-3 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all placeholder:text-gray-400 font-mono text-xs"
                      placeholder="John Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={16} />
                    </div>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl pl-10 pr-3 py-3 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all placeholder:text-gray-400 font-mono text-xs"
                      placeholder="+234 xxx xxx xxxx" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                  Terminal ID (Email) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl pl-10 pr-3 py-3 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all placeholder:text-gray-400 font-mono text-xs"
                    placeholder="you@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                  Access Code (Password) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input type={showPassword ? 'text' : 'password'} required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl pl-10 pr-10 py-3 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all placeholder:text-gray-400 font-mono text-xs tracking-widest"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#f05637] transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Student Fields */}
              {activeTab === 'student' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 border-t border-gray-100 pt-5 mt-2">
                  <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl">
                    <p className="text-xs text-orange-800 font-mono"><strong>Student Request:</strong> Submit your details. An admin will review and assign you to your class portal.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                        Class / Grade
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <BookOpen size={16} />
                        </div>
                        <select value={grade} onChange={e => setGrade(e.target.value)}
                          className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl pl-10 pr-3 py-3 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all appearance-none font-mono text-xs">
                          <option value="">Select class...</option>
                          <option value="Primary 1-3">Primary 1–3</option>
                          <option value="Primary 4-6">Primary 4–6</option>
                          <option value="JSS 1">JSS 1</option>
                          <option value="JSS 2">JSS 2</option>
                          <option value="JSS 3">JSS 3</option>
                          <option value="SS 1">SS 1</option>
                          <option value="SS 2">SS 2</option>
                          <option value="SS 3">SS 3</option>
                          <option value="University / Tertiary">University / Tertiary</option>
                          <option value="Adult Learner">Adult Learner</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                        Parent's Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Phone size={16} />
                        </div>
                        <input type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)}
                          className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl pl-10 pr-3 py-3 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all placeholder:text-gray-400 font-mono text-xs"
                          placeholder="Emergency contact" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                      Learning Goals / Notes
                    </label>
                    <textarea value={goals} onChange={e => setGoals(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl p-4 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all placeholder:text-gray-400 font-mono text-xs min-h-[80px]"
                      placeholder="Tell us your goals, requirements, or how you heard about us..." />
                  </div>
                </div>
              )}

              {/* Parent Fields */}
              {activeTab === 'parent' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 border-t border-gray-100 pt-5 mt-2">
                  <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl">
                    <p className="text-xs text-orange-800 font-mono"><strong>Parent Account:</strong> Register to enroll your children, track their progress, and manage payments from one dashboard.</p>
                  </div>
                </div>
              )}

              {/* Staff Fields */}
              {activeTab === 'staff' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 border-t border-gray-100 pt-5 mt-2">
                  <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl">
                    <p className="text-xs text-orange-800 font-mono"><strong>Staff Registration:</strong> Apply to join our network of dynamic educators and administrators.</p>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                      Subject Focus / Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <BookOpen size={16} />
                      </div>
                      <input type="text" value={subjectFocus} onChange={e => setSubjectFocus(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl pl-10 pr-3 py-3 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all placeholder:text-gray-400 font-mono text-xs"
                        placeholder="e.g. Mathematics, Programming, Admin" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-[#f05637] mb-2 font-mono tracking-widest uppercase">
                      Resume / Portfolio Link
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FileText size={16} />
                      </div>
                      <input type="url" value={resumeLink} onChange={e => setResumeLink(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#F0EBE6] rounded-xl pl-10 pr-3 py-3 text-gray-900 focus:outline-none focus:border-[#f05637] focus:ring-1 focus:ring-[#f05637] transition-all placeholder:text-gray-400 font-mono text-xs"
                        placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative inline-flex w-full mt-6 overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-[0_10px_20px_rgba(223,70,39,0.3)] group disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#df4627_0%,#F8FAFC_50%,#df4627_100%)]" />
                <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#df4627] to-[#b3290e] px-8 py-4 text-xs font-bold tracking-widest font-mono uppercase text-white backdrop-blur-3xl transition-colors group-hover:opacity-95 border border-transparent">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </span>
                ) : (
                  <>Compile Node Profile &rarr;</>
                )}
              </span>
              </button>
              
              <div className="mt-6 text-center">
                <Link to="/portal" className="text-[10px] font-bold tracking-widest text-[#f05637] font-mono uppercase hover:text-[#b3290e] transition-colors border-b border-transparent hover:border-[#b3290e]">
                  Already have an account? Login
                </Link>
              </div>

            </form>
          </div>

          {/* Footer inside the right panel */}
          <div className="border-t border-gray-100 p-6 flex items-center justify-between text-[9px] font-bold font-mono tracking-widest text-[#A0A0A0] bg-[#FAFAFA] flex-shrink-0">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:text-[#f05637] transition-colors">
                <ArrowLeft size={14} /> Main Site
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span>BUILD V4.4.0</span>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors text-[#f05637] bg-white shadow-sm hover:shadow">
                <Sun size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
