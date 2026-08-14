const fs = require('fs');
let file = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

if (!file.includes('useTheme')) {
  file = file.replace(/import \{ Menu, X, ChevronRight \} from 'lucide-react';/, "import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';\nimport { useTheme } from '../../contexts/ThemeContext';");
  file = file.replace(/const location = useLocation\(\);/, "const location = useLocation();\n  const { theme, toggleTheme } = useTheme();");
  
  const desktopButtons = `
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-white dark:text-white" style={{ color: isScrolled ? 'inherit' : 'white' }}>
              {theme === 'dark' ? <Sun size={20} className={isScrolled ? "text-brand-slate dark:text-white" : "text-white"} /> : <Moon size={20} className={isScrolled ? "text-brand-slate" : "text-white"} />}
            </button>
            <Link to="/contact" className={\`text-sm font-semibold hover:text-brand-red transition-colors \${isScrolled ? 'text-brand-slate dark:text-white/80' : 'text-white/80'}\`}>
`.trim();

  file = file.replace(/<div className="hidden lg:flex items-center gap-4">\s*<Link to="\/contact"/, desktopButtons + '\n            <Link to="/contact"');
  
  // Actually, fixing the replace is easier via regex carefully
  // Let's rewrite it manually
}
