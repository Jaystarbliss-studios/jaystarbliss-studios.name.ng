const fs = require('fs');

let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// The problematic structure:
// <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand-slate border border-white/20 rounded-full flex items-center justify-center text-brand-red shadow-lg animate-[spin_20s_linear_infinite_reverse] group-hover/inner:[animation-play-state:paused] hover:scale-125 hover:bg-white hover:text-brand-red transition-all cursor-pointer group/icon">
//   <Code size={20} />
//   <span className="...">Development</span>
// </div>

// Let's replace the inner orbit items:
content = content.replace(
  /<div className="absolute -top-6 left-1\/2 -translate-x-1\/2 w-12 h-12 bg-brand-slate border border-white\/20 rounded-full flex items-center justify-center text-brand-red shadow-lg animate-\[spin_20s_linear_infinite_reverse\] group-hover\/inner:\[animation-play-state:paused\] hover:scale-125 hover:bg-white hover:text-brand-red transition-all cursor-pointer group\/icon">([\s\S]*?)<\/div>/g,
  `<div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 animate-[spin_20s_linear_infinite_reverse] group-hover/inner:[animation-play-state:paused] z-30">
              <div className="w-full h-full bg-brand-slate border border-white/20 rounded-full flex items-center justify-center text-brand-red shadow-lg hover:scale-125 hover:bg-white transition-all cursor-pointer group/icon relative">
                $1
              </div>
            </div>`
);

content = content.replace(
  /<div className="absolute -bottom-6 left-1\/2 -translate-x-1\/2 w-12 h-12 bg-brand-slate border border-white\/20 rounded-full flex items-center justify-center text-brand-red shadow-lg animate-\[spin_20s_linear_infinite_reverse\] group-hover\/inner:\[animation-play-state:paused\] hover:scale-125 hover:bg-white hover:text-brand-red transition-all cursor-pointer group\/icon">([\s\S]*?)<\/div>/g,
  `<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 animate-[spin_20s_linear_infinite_reverse] group-hover/inner:[animation-play-state:paused] z-30">
              <div className="w-full h-full bg-brand-slate border border-white/20 rounded-full flex items-center justify-center text-brand-red shadow-lg hover:scale-125 hover:bg-white transition-all cursor-pointer group/icon relative">
                $1
              </div>
            </div>`
);

// Outer orbit items
content = content.replace(
  /<div className="absolute top-1\/2 -left-6 -translate-y-1\/2 w-14 h-14 bg-brand-slate border border-white\/20 rounded-full flex items-center justify-center text-white\/80 shadow-lg animate-\[spin_35s_linear_infinite\] group-hover\/outer:\[animation-play-state:paused\] hover:scale-125 hover:bg-white hover:text-brand-red transition-all cursor-pointer group\/icon">([\s\S]*?)<\/div>/g,
  `<div className="absolute top-1/2 -left-6 -translate-y-1/2 w-14 h-14 animate-[spin_35s_linear_infinite] group-hover/outer:[animation-play-state:paused] z-30">
              <div className="w-full h-full bg-brand-slate border border-white/20 rounded-full flex items-center justify-center text-white/80 shadow-lg hover:scale-125 hover:bg-white hover:text-brand-red transition-all cursor-pointer group/icon relative">
                $1
              </div>
            </div>`
);

content = content.replace(
  /<div className="absolute top-1\/2 -right-6 -translate-y-1\/2 w-14 h-14 bg-brand-slate border border-white\/20 rounded-full flex items-center justify-center text-white\/80 shadow-lg animate-\[spin_35s_linear_infinite\] group-hover\/outer:\[animation-play-state:paused\] hover:scale-125 hover:bg-white hover:text-brand-red transition-all cursor-pointer group\/icon">([\s\S]*?)<\/div>/g,
  `<div className="absolute top-1/2 -right-6 -translate-y-1/2 w-14 h-14 animate-[spin_35s_linear_infinite] group-hover/outer:[animation-play-state:paused] z-30">
              <div className="w-full h-full bg-brand-slate border border-white/20 rounded-full flex items-center justify-center text-white/80 shadow-lg hover:scale-125 hover:bg-white hover:text-brand-red transition-all cursor-pointer group/icon relative">
                $1
              </div>
            </div>`
);

content = content.replace(
  /<div className="absolute -top-2 right-\[15%\] w-10 h-10 bg-brand-red\/20 border border-brand-red\/30 rounded-full flex items-center justify-center text-brand-red shadow-lg animate-\[spin_35s_linear_infinite\] group-hover\/outer:\[animation-play-state:paused\] hover:scale-125 hover:bg-brand-red hover:text-white transition-all cursor-pointer group\/icon">([\s\S]*?)<\/div>/g,
  `<div className="absolute -top-2 right-[15%] w-10 h-10 animate-[spin_35s_linear_infinite] group-hover/outer:[animation-play-state:paused] z-30">
              <div className="w-full h-full bg-brand-red/20 border border-brand-red/30 rounded-full flex items-center justify-center text-brand-red shadow-lg hover:scale-125 hover:bg-brand-red hover:text-white transition-all cursor-pointer group/icon relative">
                $1
              </div>
            </div>`
);

// We should also fix the tooltip positioning so it appears ABOVE the scaled circle regardless of orientation.
// Previously: absolute -top-8, absolute -bottom-8, absolute -left-20, absolute -right-16
// Let's standardise the tooltips so they pop up nicely above the icon in all cases!
content = content.replace(/<span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover\/icon:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">/g, '<span className="absolute bottom-full mb-2 bg-black text-white text-sm font-semibold px-3 py-1.5 rounded opacity-0 group-hover/icon:opacity-100 whitespace-nowrap transition-opacity pointer-events-none shadow-xl">');
content = content.replace(/<span className="absolute -bottom-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover\/icon:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">/g, '<span className="absolute bottom-full mb-2 bg-black text-white text-sm font-semibold px-3 py-1.5 rounded opacity-0 group-hover/icon:opacity-100 whitespace-nowrap transition-opacity pointer-events-none shadow-xl">');
content = content.replace(/<span className="absolute -left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover\/icon:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">/g, '<span className="absolute bottom-full mb-2 bg-black text-white text-sm font-semibold px-3 py-1.5 rounded opacity-0 group-hover/icon:opacity-100 whitespace-nowrap transition-opacity pointer-events-none shadow-xl">');
content = content.replace(/<span className="absolute -right-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover\/icon:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">/g, '<span className="absolute bottom-full mb-2 bg-black text-white text-sm font-semibold px-3 py-1.5 rounded opacity-0 group-hover/icon:opacity-100 whitespace-nowrap transition-opacity pointer-events-none shadow-xl">');

fs.writeFileSync('src/components/Hero.tsx', content);
console.log("Tooltips fixed");
