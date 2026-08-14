const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Replace LogoGlobe import
content = content.replace("import LogoGlobe from './home/LogoGlobe';", "import AtomicOrbitals from './home/AtomicOrbitals';");

// Use regex to replace the entire right side orbital area with just <AtomicOrbitals />
const startMarker = '{/* Right Animated Orb/Solar System Area (CRITICAL HERO REQUIREMENT) */}';
const endMarker = '</div>\n      </div>\n    </div>\n  );\n};';

const startIndex = content.indexOf(startMarker);
const endIndex = content.lastIndexOf('</div>\n      </div>\n    </div>');

if (startIndex !== -1 && endIndex !== -1) {
  const newRightSide = `
        {/* Right Animated Orb/Solar System Area */}
        <div className="relative h-[400px] sm:h-[500px] w-full max-w-[500px] mx-auto hidden md:flex items-center justify-center lg:-translate-y-16">
          <AtomicOrbitals />
        </div>
`;
  content = content.substring(0, startIndex) + newRightSide + content.substring(endIndex);
  fs.writeFileSync('src/components/Hero.tsx', content);
  console.log("Updated Hero.tsx successfully");
} else {
  console.error("Markers not found");
}
