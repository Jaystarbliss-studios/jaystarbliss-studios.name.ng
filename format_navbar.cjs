const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

// Logo text color
content = content.replace(
  /className=\{`font-bold text-lg tracking-tight \$\{isScrolled \|\| mobileMenuOpen \? 'text-brand-slate' : 'text-brand-slate'\}`\}/g,
  "className={`font-bold text-lg tracking-tight ${isScrolled || mobileMenuOpen ? 'text-brand-slate' : 'text-white'}`}"
);

// Nav links color
content = content.replace(
  /className=\{`text-sm font-semibold hover:text-brand-red transition-colors \$\{\s*location\.pathname === link\.path \? 'text-brand-red' : 'text-brand-slate\/80'\s*\}`\}/g,
  "className={`text-sm font-semibold hover:text-brand-red transition-colors ${location.pathname === link.path ? 'text-brand-red' : isScrolled ? 'text-brand-slate/80' : 'text-white/80'}`}"
);

// Contact link color
content = content.replace(
  /className="text-sm font-semibold text-brand-slate hover:text-brand-red transition-colors"/g,
  "className={`text-sm font-semibold hover:text-brand-red transition-colors ${isScrolled ? 'text-brand-slate' : 'text-white/80'}`}"
);

// Menu button color
content = content.replace(
  /className="lg:hidden relative z-50 p-2 text-brand-slate"/g,
  "className={`lg:hidden relative z-50 p-2 ${isScrolled || mobileMenuOpen ? 'text-brand-slate' : 'text-white'}`}"
);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
