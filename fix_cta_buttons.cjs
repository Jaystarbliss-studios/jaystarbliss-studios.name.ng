const fs = require('fs');
let cta = fs.readFileSync('src/components/home/FinalCTA.tsx', 'utf8');

const glowingCTA = `
          <Link to="/register" className="relative inline-flex w-full sm:w-auto overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-xl shadow-brand-red/20 group">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#B91C1C_0%,#F8FAFC_50%,#B91C1C_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-brand-slate px-8 py-4 font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-brand-red/90">
              START LEARNING
              <ArrowRight size={20} />
            </span>
          </Link>
`.trim();

cta = cta.replace(/<Link to="\/register" className="w-full sm:w-auto bg-brand-red text-white[^>]*>[\s\S]*?<\/Link>/, glowingCTA);
fs.writeFileSync('src/components/home/FinalCTA.tsx', cta);

let prog = fs.readFileSync('src/pages/ProgramDetails.tsx', 'utf8');

const glowingEnroll = `
            <Link to="/register" className="relative inline-flex overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-xl shadow-brand-red/20 group">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#B91C1C_0%,#F8FAFC_50%,#B91C1C_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-brand-slate px-8 py-4 font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-brand-red/90">
                Enroll Now
              </span>
            </Link>
`.trim();

prog = prog.replace(/<Link to="\/register" className="bg-brand-red text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors">[\s\S]*?<\/Link>/, glowingEnroll);
fs.writeFileSync('src/pages/ProgramDetails.tsx', prog);
