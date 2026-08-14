const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', 'utf8');

if(!code.includes('logo-block')) {
    const logoHtml = `
    <div class="logo-block" style="display:flex; align-items:center;">
      <img src="../../assets/images/logo.png" alt="Jaystarbliss Dynamic Hub" class="logo-img" style="height:48px;"
           onerror="this.style.display='none'; document.getElementById('logo-text').style.display='block'">
      <div id="logo-text" class="logo-text" style="display:none; color:white;">
        <span class="logo-name" style="font-weight:600; font-size:18px;">Jaystarbliss</span>
        <span class="logo-sub" style="font-size:11px; color:#C9A84C; display:block;">Dynamic Hub</span>
      </div>
    </div>
    `;
    code = code.replace(/<h2>Tutor Portal<\/h2>/, logoHtml);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', code);
    console.log("Added logo to tutor portal.");
}
