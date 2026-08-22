import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Sunset, Moon, Clock, Globe } from 'lucide-react';

interface DashboardGreetingProps {
  name?: string;
  role?: string;
  subtitle?: string;
  badge?: string;
}

const QUOTES = [
  "Mastery is built through consistency and code.",
  "Every line of code is a step toward building the future.",
  "Innovation begins with curiosity and experimentation.",
  "Excellence is not an act, but a habit of continuous learning.",
  "Empowering the next generation of STEM leaders."
];

export const DashboardGreeting: React.FC<DashboardGreetingProps> = ({
  name = 'Cadet',
  role = 'student',
  subtitle,
  badge
}) => {
  const [greeting, setGreeting] = useState('Welcome');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(<Sun size={22} className="text-amber-400" />);
  const [timeString, setTimeString] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 5 && hours < 12) {
        setGreeting('Good Morning');
        setGreetingIcon(<Sun size={24} className="text-amber-400 animate-pulse" />);
      } else if (hours >= 12 && hours < 17) {
        setGreeting('Good Afternoon');
        setGreetingIcon(<Sun size={24} className="text-yellow-400" />);
      } else if (hours >= 17 && hours < 21) {
        setGreeting('Good Evening');
        setGreetingIcon(<Sunset size={24} className="text-orange-400" />);
      } else {
        setGreeting('Good Night');
        setGreetingIcon(<Moon size={24} className="text-indigo-300" />);
      }

      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(tz.replace('_', ' '));
      } catch {
        setTimeZone('WAT (GMT+1)');
      }
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 30000);
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));

    return () => clearInterval(interval);
  }, []);

  const defaultSubtitle = subtitle || QUOTES[quoteIndex];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-slate rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-700/50">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            {greetingIcon}
            <span className="text-xs sm:text-sm font-semibold text-brand-red tracking-wide uppercase">
              {greeting}
            </span>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/15">
                {badge}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {name}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400 shrink-0 hidden sm:inline" />
            <span>{defaultSubtitle}</span>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col gap-2 min-w-[200px] self-start md:self-auto">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Clock size={12} /> Local Time
            </span>
            <span className="font-mono font-bold text-white text-sm">{timeString}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-white/70 pt-1.5 border-t border-white/10">
            <span className="flex items-center gap-1 truncate max-w-[130px]">
              <Globe size={12} /> {timeZone || 'System Timezone'}
            </span>
            <span className="font-bold text-green-400 capitalize text-[11px] bg-green-500/10 px-2 py-0.5 rounded">
              {role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGreeting;
