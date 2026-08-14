const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const targetHtml = `<form id="addStudentForm">`;
const targetBtn = `<button type="submit" class="btn btn-primary">ADD_STUDENT</button>`;
const targetScript = `window.deleteStudent = async function(id) {`;

html = html.replace(targetBtn, `<button type="submit" class="btn btn-primary" id="btnAdminAddStudent">Add Student</button>`);

const replacementScript = `
  const addStudentForm = document.getElementById('addStudentForm');
  if (addStudentForm) {
      addStudentForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = document.getElementById('btnAdminAddStudent');
          const successMsg = document.getElementById('studentAddSuccess');
          btn.disabled = true;
          btn.textContent = 'Adding...';
          
          try {
              const name = document.getElementById('newStudentName').value.trim();
              const username = document.getElementById('newStudentUsername').value.trim().toLowerCase();
              const email = document.getElementById('newStudentEmail').value.trim();
              const code = document.getElementById('newStudentCode').value.trim();
              
              // Check if username exists
              const { getDocs, query, collection, where, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
              const checkQ = query(collection(db, 'students'), where('username', '==', username));
              const checkSnap = await getDocs(checkQ);
              if (!checkSnap.empty) {
                  alert('Username already exists. Please choose another.');
                  btn.disabled = false; btn.textContent = 'Add Student';
                  return;
              }
              
              await addDoc(collection(db, 'students'), {
                  fullName: name,
                  name: name,
                  username: username,
                  email: email,
                  accessCode: code,
                  accessCodeHash: null,
                  studentType: 'private', // Super admin adds private students by default? Let's just make it private or unassigned.
                  role: 'student',
                  authType: 'accessCode',
                  createdAt: serverTimestamp()
              });
              
              successMsg.style.display = 'block';
              setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
              addStudentForm.reset();
              loadStudentsList();
          } catch(err) {
              console.error(err);
              alert('Error adding student: ' + err.message);
          } finally {
              btn.disabled = false;
              btn.textContent = 'Add Student';
          }
      });
  }

window.deleteStudent = async function(id) {`;

html = html.replace(targetScript, replacementScript);
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log('Added addStudent logic to admin-dashboard');
