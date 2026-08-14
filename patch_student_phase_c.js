const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', 'utf8');

if(!code.includes('data-tab="quizzes"')) {
    const navItem = `<button class="nav-item " data-tab="quizzes" onclick="window.switchTab('quizzes')">
    <span class="material-symbols-outlined">quiz</span> Quizzes
</button>
<button class="nav-item " data-tab="leaderboard" onclick="window.switchTab('leaderboard')">
    <span class="material-symbols-outlined">leaderboard</span> Leaderboard
</button>`;
    
    code = code.replace(/<div class="sidebar-label">Community<\/div>/, navItem + '\n$&');
    
    const tabPane = `<div id="quizzes" class="tab-content">
    <div class="panel">
        <div class="panel-head"><div class="panel-title"><span class="material-symbols-outlined">quiz</span> Quizzes</div></div>
        <div class="panel-body" id="quizzesContainer">Loading...</div>
    </div>
</div>
<div id="leaderboard" class="tab-content">
    <div class="panel">
        <div class="panel-head"><div class="panel-title"><span class="material-symbols-outlined">leaderboard</span> Leaderboard</div></div>
        <div class="panel-body" id="leaderboardContainer">Loading...</div>
    </div>
</div>`;
    
    code = code.replace(/<div id="messages" class="tab-content">/, tabPane + '\n$&');
    
    const importCode = `
import { initPhaseCStudent } from '../../assets/js/phase_c_student.js';
const myUidForPhaseC = localStorage.getItem('userId');
if(myUidForPhaseC) {
    initPhaseCStudent(db, myUidForPhaseC);
}
`;
    code = code.replace(/const db\s*=\s*getFirestore\(app\);/g, "$&\n" + importCode);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/student-portal.html', code);
    console.log("Injected Phase C Student logic.");
}
