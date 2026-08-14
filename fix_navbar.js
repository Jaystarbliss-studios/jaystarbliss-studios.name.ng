const fs = require('fs');
let file = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const glowingButtonDesktop = `
            <Link to="/portal" className="relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none hover:-translate-y-0.5 transition-transform shadow-md shadow-brand-red/20 group">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#B91C1C_0%,#F8FAFC_50%,#B91C1C_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-lg bg-brand-slate px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-3xl transition-colors group-hover:bg-brand-red/90">
                LOGIN / SIGNUP
              </span>
            </Link>
`.trim();

const glowingButtonMobile = `
            <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="relative inline-flex w-full overflow-hidden rounded-xl p-[1px] focus:outline-none shadow-lg shadow-brand-red/20 group">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#B91C1C_0%,#F8FAFC_50%,#B91C1C_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-brand-slate px-6 py-4 text-center font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-brand-red/90">
                LOGIN / SIGNUP
              </span>
            </Link>
`.trim();

// Replace desktop button
file = file.replace(/<Link to="\/programs" className="bg-brand-red[^>]*>[\s\S]*?<\/Link>/, glowingButtonDesktop);
// Replace mobile button
file = file.replace(/<Link[\s\S]*?to="\/learn"[\s\S]*?>[\s\S]*?BROWSE PROGRAMS[\s\S]*?<\/Link>/, glowingButtonMobile);

fs.writeFileSync('src/components/layout/Navbar.tsx', file);
