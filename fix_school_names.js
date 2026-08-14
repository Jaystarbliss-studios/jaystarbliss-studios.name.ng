const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html', 'utf8');

const target = `            const schoolDoc = await getDoc(doc(db, 'schools', currentSchoolId));
            if (schoolDoc.exists()) {
                document.getElementById('schoolNameDisplay').textContent = schoolDoc.data().name || currentSchoolId;
            } else {
                document.getElementById('schoolNameDisplay').textContent = currentSchoolId;
            }`;

const replacement = `            const schoolNames = {
                'peniel': 'Peniel Lily Montessori',
                'southgold': 'South Gold Montessori',
                'sapphire': 'Sapphire Explorer Montessori',
                'easystars': 'Easy Stars Early Years',
                'christycaleb': 'Christy Caleb International',
                'royalbreed': 'Royal Breed Academy'
            };
            
            const schoolDoc = await getDoc(doc(db, 'schools', currentSchoolId));
            if (schoolDoc.exists() && schoolDoc.data().name) {
                document.getElementById('schoolNameDisplay').textContent = schoolDoc.data().name;
            } else {
                document.getElementById('schoolNameDisplay').textContent = schoolNames[currentSchoolId] || currentSchoolId;
            }`;

html = html.replace(target, replacement);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html', html);
console.log("Updated school names display logic");
