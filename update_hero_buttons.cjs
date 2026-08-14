const fs = require('fs');
const file = 'src/components/Hero.tsx';
let content = fs.readFileSync(file, 'utf8');
const target = `<div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Link to="/programs" className="bg-brand-red text-white px-8 py-4 rounded-xl font-bold hover:-translate-y-1 transition-transform shadow-lg shadow-brand-red/20 flex items-center gap-2">
              START LEARNING
            </Link>
            <Link to="/services" className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors">
              HIRE US
            </Link>
            <Link to="/portfolio" className="text-white/60 font-semibold hover:text-white transition-colors px-4 py-4 flex items-center gap-2">
              SEE OUR WORK <ArrowRight size={16} />
            </Link>
          </div>`;
const replacement = `<div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-8">
            <Link to="/register" className="relative inline-flex overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-[0_10px_20px_rgba(223,70,39,0.3)] group">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#df4627_0%,#F8FAFC_50%,#df4627_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#df4627] to-[#b3290e] px-8 py-4 text-sm font-bold tracking-widest font-mono uppercase text-white backdrop-blur-3xl transition-colors group-hover:opacity-95 border border-transparent">
                START LEARNING
              </span>
            </Link>
            
            <Link to="/services" className="relative inline-flex overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-lg group">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#475569_50%,#ffffff_100%)] opacity-30" />
              <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-brand-slate px-8 py-4 text-sm font-bold tracking-widest font-mono uppercase text-white backdrop-blur-3xl transition-colors group-hover:bg-slate-800 border border-white/10">
                HIRE US
              </span>
            </Link>

            <Link to="/portfolio" className="text-white/60 font-semibold hover:text-white transition-colors px-4 py-4 flex items-center gap-2">
              SEE OUR WORK <ArrowRight size={16} />
            </Link>
          </div>`;
if (content.includes(target)) {
  fs.writeFileSync(file, content.replace(target, replacement));
  console.log("Updated Hero.tsx successfully.");
} else {
  console.log("Target not found.");
}
