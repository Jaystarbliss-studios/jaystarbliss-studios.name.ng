const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

const targetPara = `<p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            From practical learning and digital skills to websites, applications and creative design, Jaystarbliss Studios helps people and organizations turn ideas into useful, real-world results.
          </p>`;
const inlineTargetPara = `<p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">            From practical learning and digital skills to websites, applications and creative design, Jaystarbliss Studios helps people and organizations turn ideas into useful, real-world results.          </p>`;

content = content.replace(targetPara, '');
content = content.replace(inlineTargetPara, '');

const targetTags = `<div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-white/40 tracking-widest uppercase">
            <span>Education</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span>Technology</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span>Creative Services</span>
          </div>`;
          
const inlineTargetTags = `<div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-white/40 tracking-widest uppercase">            <span>Education</span>            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>            <span>Technology</span>            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>            <span>Creative Services</span>          </div>`;

content = content.replace(targetTags, '');
content = content.replace(inlineTargetTags, '');

fs.writeFileSync('src/components/Hero.tsx', content);
