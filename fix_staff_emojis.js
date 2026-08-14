const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

code = code.replace(/💻 Coding/g, 'Coding');
code = code.replace(/🎵 Music/g, 'Music');
code = code.replace(/🎨 Art/g, 'Art');
code = code.replace(/📐 Mathematics/g, 'Mathematics');
code = code.replace(/🔬 Science/g, 'Science');
code = code.replace(/📚 General/g, 'General');
code = code.replace(/📹 Tutorial/g, 'Tutorial');
code = code.replace(/🛠️ Tool/g, 'Tool');
code = code.replace(/📖 Reference/g, 'Reference');
code = code.replace(/🎮 Game/g, 'Game');
code = code.replace(/🔖 Other/g, 'Other');
code = code.replace(/🔗 Link/g, 'Link');
code = code.replace(/📚 Christy Caleb/g, 'Christy Caleb');
code = code.replace(/<h4>👤 /g, '<h4><i data-lucide="user" class="w-4 h-4 inline align-text-bottom mr-1"></i> ');

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', code);
