const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

const targetText = `<p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">            From practical learning and digital skills to websites, applications and creative design, Jaystarbliss Studios helps people and organizations turn ideas into useful, real-world results.          </p>`;

content = content.replace(targetText, '');
fs.writeFileSync('src/components/Hero.tsx', content);
