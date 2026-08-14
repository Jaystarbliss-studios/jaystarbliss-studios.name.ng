const fs = require('fs');
let file = fs.readFileSync('src/pages/Portal.tsx', 'utf8');

const registerLink = `
            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-gray-500 mb-2">Don't have an account?</p>
              <Link to="/register" className="inline-block text-sm font-bold tracking-widest text-brand-red uppercase hover:text-red-700 transition-colors">
                Sign Up / Initialize Node
              </Link>
            </div>
`;

if (!file.includes('Sign Up / Initialize Node')) {
  file = file.replace(/<\/form>/, "</form>" + registerLink);
  fs.writeFileSync('src/pages/Portal.tsx', file);
}
