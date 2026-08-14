const fs = require('fs');
const files = [
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html'
];

files.forEach(f => {
    if(!fs.existsSync(f)) return;
    let code = fs.readFileSync(f, 'utf8');
    if(!code.includes('family=Poppins')) {
        code = code.replace(/<head>/, '<head>\n    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"/>');
        fs.writeFileSync(f, code);
    }
});
