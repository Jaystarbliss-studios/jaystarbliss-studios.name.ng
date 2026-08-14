const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', 'utf8');

let blocks = code.split("grid.appendChild(makeCard(`");
for (let i = 1; i < blocks.length; i++) {
  let endIdx = blocks[i].indexOf("`));");
  if (endIdx !== -1) {
    let blockContent = blocks[i].substring(0, endIdx);
    let afterBlock = blocks[i].substring(endIdx + 4);
    
    let replacement = "";
    if (blockContent.includes('📝 Open Exam') && blockContent.includes('pill-gold')) {
        replacement = "grid.appendChild(makeCard({...data, id: d.id, colName: 'schoolExams'}, 'exam'));";
    } else if (blockContent.includes('📝 Open Exam')) {
        replacement = "grid.appendChild(makeCard({...data, id: d.id, colName: 'exams'}, 'exam'));";
    } else if (blockContent.includes('🔗 Open Link') && !blockContent.includes('pill-gold')) {
        replacement = "grid.appendChild(makeCard({...data, id: d.id, colName: 'links'}, 'link'));";
    } else if (blockContent.includes('🔗 View Resource')) {
        replacement = "grid.appendChild(makeCard({...data, id: d.id, colName: 'resources'}, 'resource'));";
    } else if (blockContent.includes('👤')) {
        replacement = "grid.appendChild(makeCard({...item, studentName, id: item.id, colName: item.colName}, item.type));";
    } else {
        // school resources
        replacement = "grid.appendChild(makeCard({...item, id: item.id, colName: item.col}, item.type));";
    }
    blocks[i] = replacement + afterBlock;
  }
}
code = blocks[0] + blocks.slice(1).join("");

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/staff-portal.html', code);
