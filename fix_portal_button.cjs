const fs = require('fs');
let file = fs.readFileSync('src/pages/Portal.tsx', 'utf8');

const oldButton = `
              <button
                type="submit"
                className="w-full bg-gradient-to-b from-[#df4627] to-[#b3290e] text-white font-bold tracking-widest font-mono text-xs uppercase rounded-xl py-4 mt-2 shadow-[0_10px_20px_rgba(223,70,39,0.3)] hover:shadow-[0_15px_30px_rgba(223,70,39,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-[#f05637]"
              >
                Initialize Access &rarr;
              </button>
`.trim();

const newButton = `
              <button
                type="submit"
                className="relative inline-flex w-full mt-2 overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-[0_10px_20px_rgba(223,70,39,0.3)] group"
              >
                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#df4627_0%,#F8FAFC_50%,#df4627_100%)]" />
                <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#df4627] to-[#b3290e] px-8 py-4 text-xs font-bold tracking-widest font-mono uppercase text-white backdrop-blur-3xl transition-colors group-hover:opacity-95 border border-transparent">
                  Initialize Access &rarr;
                </span>
              </button>
`.trim();

file = file.replace(oldButton, newButton);
fs.writeFileSync('src/pages/Portal.tsx', file);
