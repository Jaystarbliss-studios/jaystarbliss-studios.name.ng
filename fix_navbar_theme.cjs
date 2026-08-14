const fs = require('fs');
let file = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

if (!file.includes('ThemeContext')) {
  file = file.replace(/import \{ Menu, X, ChevronRight \} from 'lucide-react';/, "import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';\nimport { useTheme } from '../../contexts/ThemeContext';");
  file = file.replace(/const location = useLocation\(\);/, "const location = useLocation();\n  const { theme, toggleTheme } = useTheme();");
  
  file = file.replace(/<div className="hidden lg:flex items-center gap-4">/, `<div className="hidden lg:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              {theme === 'dark' ? <Sun size={20} className={isScrolled ? "text-brand-slate dark:text-white" : "text-white"} /> : <Moon size={20} className={isScrolled ? "text-brand-slate" : "text-white"} />}
            </button>`);
            
  file = file.replace(/<div className="mt-auto pt-8 flex flex-col gap-4">/, `<div className="mt-auto pt-8 flex flex-col gap-4">
            <button onClick={toggleTheme} className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-800 text-brand-slate dark:text-white px-6 py-4 rounded-xl font-bold">
              {theme === 'dark' ? <><Sun size={20} /> LIGHT MODE</> : <><Moon size={20} /> DARK MODE</>}
            </button>`);
            
  fs.writeFileSync('src/components/layout/Navbar.tsx', file);
}
