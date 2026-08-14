const fs = require('fs');
const glob = require('glob');

const colorMap = {
  "outline": "#737784", "on-tertiary-container": "#ccced0", "inverse-primary": "#b0c6ff", "surface-container-lowest": "#ffffff", "inverse-on-surface": "#eaf1ff", "on-tertiary-fixed-variant": "#444749", "on-surface": "#0b1c30", "on-primary-fixed": "#001945", "on-tertiary-fixed": "#191c1e", "primary-fixed-dim": "#b0c6ff", "primary-fixed": "#d9e2ff", "on-secondary-fixed": "#00201c", "on-surface-variant": "#434653", "secondary": "#006b5f", "on-error": "#ffffff", "tertiary-fixed": "#e0e3e5", "inverse-surface": "#213145", "on-secondary": "#ffffff", "surface-container-high": "#dce9ff", "secondary-fixed-dim": "#3cddc7", "primary-container": "#0f52ba", "error-container": "#ffdad6", "surface": "#f8f9ff", "secondary-container": "#62fae3", "on-background": "#0b1c30", "tertiary": "#3d4143", "error": "#ba1a1a", "on-primary-container": "#bcceff", "surface-dim": "#cbdbf5", "on-secondary-container": "#007165", "tertiary-container": "#55585a", "surface-bright": "#f8f9ff", "on-error-container": "#93000a", "outline-variant": "#c3c6d5", "on-secondary-fixed-variant": "#005047", "background": "#f8f9ff", "tertiary-fixed-dim": "#c4c7c9", "surface-container": "#e5eeff", "on-tertiary": "#ffffff", "surface-tint": "#1d59c1", "on-primary-fixed-variant": "#00419c", "surface-container-highest": "#d3e4fe", "secondary-fixed": "#62fae3", "on-primary": "#ffffff", "primary": "#003c90", "surface-variant": "#d3e4fe", "surface-container-low": "#eff4ff"
};

const darkMap = {
  "--primary": "#b0c6ff", "--on-primary": "#002868", "--primary-container": "#1d59c1", "--on-primary-container": "#d9e2ff",
  "--secondary": "#62fae3", "--on-secondary": "#003730", "--secondary-container": "#005047", "--on-secondary-container": "#7ffdf1",
  "--tertiary": "#c4c7c9", "--on-tertiary": "#2d3133", "--tertiary-container": "#444749", "--on-tertiary-container": "#e0e3e5",
  "--error": "#ffb4ab", "--on-error": "#690005", "--error-container": "#93000a", "--on-error-container": "#ffdad6",
  "--background": "#0A0A0A", "--on-background": "#F0F0F0", "--surface": "#0A0A0A", "--on-surface": "#F0F0F0",
  "--surface-variant": "#222222", "--on-surface-variant": "#B3B3B3", "--outline": "#8c909f", "--outline-variant": "#333333",
  "--inverse-surface": "#F0F0F0", "--inverse-on-surface": "#0A0A0A",
  "--surface-container-lowest": "#050505", "--surface-container-low": "#111111", "--surface-container": "#181818",
  "--surface-container-high": "#222222", "--surface-container-highest": "#2D2D2D", "--surface-dim": "#0A0A0A", "--surface-bright": "#3A3A3A"
};

let cssVarsLight = ":root {\n";
let cssVarsDark = "[data-theme='dark'] {\n";

for (const [key, value] of Object.entries(colorMap)) {
  cssVarsLight += '  --' + key + ': ' + value + ';\n';
}
for (const [key, value] of Object.entries(darkMap)) {
  cssVarsDark += '  ' + key + ': ' + value + ';\n';
}
// Fill in missing dark mode vars with light mode
for (const [key, value] of Object.entries(colorMap)) {
  if (!darkMap['--' + key]) {
     cssVarsDark += '  --' + key + ': ' + value + ';\n';
  }
}

cssVarsLight += "}\n";
cssVarsDark += "}\n";

const newConfigColors = Object.keys(colorMap).map(k => '"' + k + '": "var(--' + k + ')"').join(', ');

const files = glob.sync('jaystarbliss-studios.name.ng/htdocs/pages/**/*.html');

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Replace config colors
  const colorRegex = /"colors":\s*{[^}]*}/;
  if (colorRegex.test(html)) {
      html = html.replace(colorRegex, '"colors": { ' + newConfigColors + ' }');
  }
  
  // Inject CSS Variables
  if (!html.includes("data-theme='dark'")) {
      const styleTagMatch = html.match(/<style[^>]*>/);
      if (styleTagMatch) {
          html = html.replace(styleTagMatch[0], styleTagMatch[0] + '\n' + cssVarsLight + '\n' + cssVarsDark);
      } else {
          html = html.replace('</head>', '<style>\n' + cssVarsLight + '\n' + cssVarsDark + '</style>\n</head>');
      }
  }

  // Ensure init theme logic is there
  if (!html.includes('const savedTheme = localStorage.getItem(')) {
    const initThemeScript = `
    <script>
        const savedTheme = localStorage.getItem('jdh-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') document.documentElement.classList.add('dark');
        
        window.toggleTheme = function() {
            const h = document.documentElement;
            const isDark = h.getAttribute('data-theme') === 'dark';
            const n = isDark ? 'light' : 'dark';
            h.setAttribute('data-theme', n);
            localStorage.setItem('jdh-theme', n);
            if (n === 'dark') h.classList.add('dark'); else h.classList.remove('dark');
        };
    </script>
    `;
    html = html.replace('</head>', initThemeScript + '\n</head>');
  }
  
  fs.writeFileSync(file, html);
  console.log("Updated", file);
}
