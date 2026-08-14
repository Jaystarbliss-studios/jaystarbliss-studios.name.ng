const fs = require('fs');
let content = fs.readFileSync('src/pages/Portal.tsx', 'utf8');

// Add useNavigate if not present
if (!content.includes('useNavigate')) {
  content = content.replace(
    "import { Link } from 'react-router-dom';",
    "import { Link, useNavigate } from 'react-router-dom';"
  );
  content = content.replace(
    "const Portal: React.FC = () => {",
    "const Portal: React.FC = () => {\n  const navigate = useNavigate();"
  );
}

// Update button to handle login
content = content.replace(
  `<button 
                    type="button" 
                    className="w-full bg-brand-red text-white font-bold rounded-xl px-5 py-4 mt-6 hover:bg-red-500 hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-red/20"
                  >`,
  `<button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); navigate(\`/portal/\${selectedRole}\`); }}
                    className="w-full bg-brand-red text-white font-bold rounded-xl px-5 py-4 mt-6 hover:bg-red-500 hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-red/20"
                  >`
);

fs.writeFileSync('src/pages/Portal.tsx', content);
