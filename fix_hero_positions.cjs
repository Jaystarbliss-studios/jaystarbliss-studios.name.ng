const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Replace Top/Bottom orbit items
// <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 animate-[spin_20s_linear_infinite_reverse] ...
content = content.replace(
  /className="absolute -top-6 left-1\/2 -translate-x-1\/2 w-12 h-12/g,
  'className="absolute -top-6 left-[calc(50%-24px)] w-12 h-12'
);
content = content.replace(
  /className="absolute -bottom-6 left-1\/2 -translate-x-1\/2 w-12 h-12/g,
  'className="absolute -bottom-6 left-[calc(50%-24px)] w-12 h-12'
);

// Replace Left/Right orbit items (w-14 -> 56px -> 28px)
content = content.replace(
  /className="absolute top-1\/2 -left-6 -translate-y-1\/2 w-14 h-14/g,
  'className="absolute top-[calc(50%-28px)] -left-6 w-14 h-14'
);
content = content.replace(
  /className="absolute top-1\/2 -right-6 -translate-y-1\/2 w-14 h-14/g,
  'className="absolute top-[calc(50%-28px)] -right-6 w-14 h-14'
);

// Replace random position (Database)
// <div className="absolute -top-2 right-[15%] w-10 h-10 animate-[spin_35s_linear_infinite] group-hover/outer:[animation-play-state:paused] z-30">
// We don't have translate-y-1/2 on this one, so it's fine.

fs.writeFileSync('src/components/Hero.tsx', content);
console.log("Fixed hero positions");
