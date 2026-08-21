import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import SEO from '../components/ui/SEO';
import { 
  VERIFIED_TUTORS, 
  type VerifiedTutor 
} from '../data/learningEcosystem';
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  X, 
  Check,
  UserCheck
} from 'lucide-react';
import Button from '../components/ui/Button';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SUBJECT_FILTERS = [
  'ALL',
  'Mathematics',
  'Coding',
  'Python',
  'Scratch',
  'Keyboard',
  'Violin',
  'Graphic Design',
  'Digital Literacy',
  'AI Tools',
  'Chess',
  'English',
  'Physics',
  'Chemistry'
];

const FindTutor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState<'ALL' | 'Online' | 'Physical'>('ALL');
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<VerifiedTutor | null>(null);

  // Booking Modal Form State
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDays, setPreferredDays] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredTutors = VERIFIED_TUTORS.filter((tutor) => {
    const matchesSearch = 
      !searchQuery ||
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = 
      selectedSubject === 'ALL' ||
      tutor.subjects.includes(selectedSubject);

    const matchesMode = 
      selectedMode === 'ALL' ||
      tutor.teachingModes.includes(selectedMode);

    return matchesSearch && matchesSubject && matchesMode;
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim() || !email.trim() || !selectedTutorForBooking) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        type: 'TUTOR_REQUEST',
        tutorId: selectedTutorForBooking.id,
        tutorName: selectedTutorForBooking.name,
        tutorSpecialization: selectedTutorForBooking.title,
        parentName,
        studentName: studentName || 'Not specified',
        phone,
        email,
        preferredDays,
        bookingNotes,
        teachingMode: selectedMode === 'ALL' ? 'Flexible' : selectedMode,
        status: 'PENDING',
        createdAt: serverTimestamp()
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error('Error submitting tutor request:', err);
      setBookingSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedTutorForBooking(null);
    setBookingSuccess(false);
    setParentName('');
    setStudentName('');
    setPhone('');
    setEmail('');
    setPreferredDays('');
    setBookingNotes('');
  };

  return (
    <MainLayout>
      <SEO 
        title="Find a Tutor & Mentor" 
        description="Connect with verified mentors in Mathematics, Coding, Music, Graphic Design, Digital Literacy, and Exam Preparation." 
      />

      {/* Hero Header */}
      <div className="bg-brand-slate text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Find Your Child's Dedicated Mentor
            </h1>
            <p className="text-base sm:text-lg text-white/80 mt-3 leading-relaxed">
              Match with certified educators across technology, music, sciences, creative arts, and academic excellence. Available for 1-on-1 private lessons at home or interactive live online.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-[52px] sm:top-[64px] z-30 shadow-xs">
        <div className="container mx-auto px-4 max-w-7xl py-3.5 space-y-3">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutor by name, skill (e.g. Python, Piano, Math)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-red outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <span className="text-xs font-bold text-slate-500">Delivery:</span>
              {(['ALL', 'Online', 'Physical'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedMode === mode
                      ? 'bg-brand-red text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {mode === 'ALL' ? 'All Modes' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar items-center">
            {SUBJECT_FILTERS.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => setSelectedSubject(subject)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSubject === subject
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {subject === 'ALL' ? 'All Subjects' : subject}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Tutor Cards Grid */}
      <div className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Showing {filteredTutors.length} Verified Instructors
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Flexible scheduling • Zero public markups
            </span>
          </div>

          {filteredTutors.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-4">
              <UserCheck size={40} className="mx-auto text-slate-400" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">No Tutors Match Your Filter</h3>
              <p className="text-xs text-slate-500">Try clearing your search query or subject filters to view more mentors.</p>
              <Button onClick={() => { setSearchQuery(''); setSelectedSubject('ALL'); setSelectedMode('ALL'); }} variant="outline" className="text-xs font-bold">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-brand-red/30 transition-all group"
                >
                  <div className="space-y-4">
                    
                    {/* Tutor Header */}
                    <div className="flex items-start gap-4">
                      <img
                        src={tutor.avatarUrl}
                        alt={tutor.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-black mb-0.5">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          <span>{tutor.rating}</span>
                          <span className="text-slate-400 font-normal">({tutor.reviewCount} reviews)</span>
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                          {tutor.name}
                        </h3>
                        <p className="text-xs text-brand-red font-bold truncate">
                          {tutor.title}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {tutor.bio}
                    </p>

                    {/* Specializations Chips */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1.5">
                        Specializations
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta info: Modes & Availability */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-brand-red shrink-0" />
                        <span>Delivery: <strong>{tutor.teachingModes.join(' & ')}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-brand-red shrink-0" />
                        <span>Available: <strong>{tutor.availability}</strong></span>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      onClick={() => setSelectedTutorForBooking(tutor)}
                      className="w-full bg-brand-red hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-brand-red/10"
                    >
                      Request This Mentor
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Booking Modal */}
      {selectedTutorForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Request Submitted!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  We've received your request for <strong>{selectedTutorForBooking.name}</strong>. Our academic coordinator will contact you at <strong>{phone}</strong> to confirm timetable alignment and schedule your first introductory session.
                </p>
                <Button onClick={closeModal} className="font-bold text-xs">
                  Done
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={selectedTutorForBooking.avatarUrl}
                    alt={selectedTutorForBooking.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-md">
                      Mentor Booking
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Request {selectedTutorForBooking.name}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedTutorForBooking.title}</p>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Mr. Kolawole"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Student Name & Age
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Femi (Age 10)"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 801 234 5678"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="parent@email.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Day(s) & Time
                    </label>
                    <input
                      type="text"
                      value={preferredDays}
                      onChange={(e) => setPreferredDays(e.target.value)}
                      placeholder="e.g. Saturdays 10:00 AM or Tuesday afternoons"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Learning Objectives / Focus Areas (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="e.g. Needs help starting Scratch game coding and building confidence in mathematics."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-brand-red hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-3"
                    >
                      {submitting ? 'Submitting Request...' : 'Confirm Learning Plan Request'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </MainLayout>
  );
};

export default FindTutor;
