const fs = require('fs');

const files = [
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html',
    'jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html'
];

const fontSizeConfig = `,
                "fontSize": {
                    "headline-md": ["1.5rem", "2rem"],
                    "headline-lg": ["2rem", "2.5rem"],
                    "body-lg": ["1.125rem", "1.75rem"],
                    "headline-sm": ["1.25rem", "1.75rem"],
                    "headline-lg-mobile": ["1.75rem", "2.25rem"],
                    "body-sm": ["0.875rem", "1.25rem"],
                    "body-md": ["1rem", "1.5rem"],
                    "label-md": ["0.875rem", "1.25rem"],
                    "label-lg": ["1rem", "1.5rem"]
                }`;

files.forEach(file => {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    if(!content.includes('"fontSize": {')) {
        content = content.replace(/"fontFamily": \{[^}]+\}/, `$&${fontSizeConfig}`);
        fs.writeFileSync(file, content);
    }
});
console.log("Fixed font sizes.");
