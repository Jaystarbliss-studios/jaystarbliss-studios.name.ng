const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', 'utf8');

if(!code.includes('phase_a_tutor.js')) {
    const importCode = `
import '../../assets/js/phase_a_tutor.js';
`;
    code = code.replace(/import \{ collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc \} from 'https:\/\/www.gstatic.com\/firebasejs\/10.7.1\/firebase-firestore.js';/g, "$&\n" + importCode);
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/tutor-portal.html', code);
    console.log("Injected Phase A Tutor logic.");
}
