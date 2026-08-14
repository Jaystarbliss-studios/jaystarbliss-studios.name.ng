const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_b_admin.js', 'utf8');

if(!code.includes('createQuiz')) {
    const quizLogic = `
window.createQuiz = async function() {
    const title = prompt("Quiz Title (e.g. 'Math Basics')");
    if(!title) return;
    const desc = prompt("Description");
    const q1 = prompt("Question 1 text?");
    if(!q1) return;
    const ans1 = prompt("Correct answer for Q1?");
    
    try {
        const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        await addDoc(collection(getFirestore(), 'quizzes'), {
            title: title,
            description: desc || 'Complete this quiz to earn coins!',
            rewardCoins: 50,
            questions: [
                {
                    text: q1,
                    options: [ans1, "Other Option 1", "Other Option 2"],
                    correctAnswer: ans1
                }
            ],
            createdAt: serverTimestamp()
        });
        alert("Quiz created!");
    } catch(e) {
        alert(e);
    }
};
`;
    fs.appendFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_b_admin.js', quizLogic);
    
    let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');
    html = html.replace(/<button class="btn btn-primary" style="margin-bottom:15px;" onclick="window.openCycleModal\(\)">Create New Cycle<\/button>/, `
    $&
    <button class="btn btn-secondary" style="margin-bottom:15px; margin-left:10px; border:1px solid var(--primary); padding:8px 12px; border-radius:4px; cursor:pointer;" onclick="window.createQuiz()">Create Sample Quiz</button>
    `);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
    
    console.log("Patched admin quiz logic");
}
