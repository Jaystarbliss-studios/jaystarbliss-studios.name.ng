const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

// The makeCard function is already updated, we just need to replace the calls.
// Resources
code = code.replace(/grid\.appendChild\(makeCard\([\s\S]*?`[\s\S]*?<div class="card-meta">\$\{fmt\(data\.timestamp\)\}<\/div>\n\s*`\)\);/g, function(match) {
    if (match.includes('📝 Open Exam') && match.includes('pill-gold')) {
        return "grid.appendChild(makeCard({...data, id: d.id, colName: 'schoolExams'}, 'exam'));";
    } else if (match.includes('📝 Open Exam')) {
        return "grid.appendChild(makeCard({...data, id: d.id, colName: 'exams'}, 'exam'));";
    } else if (match.includes('Open Link') && !match.includes('pill-gold')) {
        return "grid.appendChild(makeCard({...data, id: d.id, colName: 'links'}, 'link'));";
    } else {
        return "grid.appendChild(makeCard({...data, id: d.id, colName: 'resources'}, 'resource'));";
    }
});

// School Resources
code = code.replace(/grid\.appendChild\(makeCard\([\s\S]*?`[\s\S]*?<div class="card-meta">\$\{fmt\(item\.timestamp\)\}<\/div>\n\s*`\)\);/g, function(match) {
    if (match.includes('👤')) { // Student resources
       return "grid.appendChild(makeCard({...item, studentName, id: item.id, colName: item.colName}, item.type));";
    }
    return "grid.appendChild(makeCard({...item, id: item.id, colName: item.col}, item.type));";
});


fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', code);
