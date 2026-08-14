const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

if (!file.includes('ThemeContext')) {
  file = file.replace(/import \{ BrowserRouter/, "import { ThemeProvider } from './contexts/ThemeContext';\nimport { BrowserRouter");
  file = file.replace(/<Router>/, "<ThemeProvider>\n    <Router>");
  file = file.replace(/<\/Router>/, "</Router>\n    </ThemeProvider>");
  fs.writeFileSync('src/App.tsx', file);
}
