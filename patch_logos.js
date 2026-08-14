const fs = require('fs');
const files = [
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html'
];

const logoHTML = `
<div class="logo-block" style="padding: 24px 20px 16px; border-bottom: 1px solid rgba(201,168,76,0.3);">
  <img src="../../assets/images/logo.png" alt="Jaystarbliss Dynamic Hub" class="logo-img" style="height: 48px; width: auto; display: block;"
       onerror="this.style.display='none'; document.getElementById('logo-text').style.display='block'">
  <div id="logo-text" class="logo-text" style="display:none">
    <span class="logo-name" style="display: block; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 18px; color: #2C2C59;">Jaystarbliss</span>
    <span class="logo-sub" style="display: block; font-size: 11px; color: #C9A84C; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500;">Dynamic Hub</span>
  </div>
</div>
`;

files.forEach(f => {
    if(!fs.existsSync(f)) return;
    let code = fs.readFileSync(f, 'utf8');
    
    // Replace the old text logo
    if(code.match(/<h1 class="[^"]*text-primary[^"]*">Jaystarbliss<\/h1>/)) {
        code = code.replace(/<div>\s*<h1 class="[^"]*text-primary[^"]*">Jaystarbliss<\/h1>[\s\S]*?<\/div>/, logoHTML);
        fs.writeFileSync(f, code);
        console.log("Patched logo in " + f);
    }
});
