const fs = require('fs');
const glob = require('glob');

const files = glob.sync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/*.html');

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  
  if (!html.includes('onclick="window.toggleTheme()"') && !html.includes("onclick='window.toggleTheme()'")) {
     // For parent portal
     const target1 = `<a class="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer" onclick="window.globalPerformLogout()">`;
     const replacement1 = `
     <a class="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer mb-2" onclick="window.toggleTheme()">
         <span class="material-symbols-outlined">contrast</span>
         <span class="font-label-lg text-label-lg">Theme</span>
     </a>
     <a class="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer" onclick="window.globalPerformLogout()">`;
     
     // For other portals
     const target2 = `<button class="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer border-none bg-transparent w-full text-left" onclick="window.globalPerformLogout()">`;
     const replacement2 = `
     <button class="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer border-none bg-transparent w-full text-left mb-2" onclick="window.toggleTheme()">
         <span class="material-symbols-outlined">contrast</span>
         <span class="font-label-lg text-label-lg">Theme</span>
     </button>
     <button class="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-colors rounded-lg cursor-pointer border-none bg-transparent w-full text-left" onclick="window.globalPerformLogout()">`;

     if (html.includes(target1)) {
         html = html.replace(target1, replacement1);
     } else if (html.includes(target2)) {
         html = html.replace(target2, replacement2);
     }
     
     fs.writeFileSync(file, html);
     console.log("Added theme button to", file);
  }
}
