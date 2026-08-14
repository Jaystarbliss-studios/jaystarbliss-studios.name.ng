const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const targetHtml = `<div class="info-box">
            <strong>🔐 Access Codes:</strong> Set or update the access code for each school. Students need these codes to enter their school portal.
          </div>
          <div class="success-message" id="schoolManageSuccess">Access code updated successfully!</div>`;

const replacementHtml = `<div class="info-box">
            <strong><i data-lucide="user-plus" class="w-4 h-4 inline align-text-bottom mr-1"></i> Create School Admin:</strong> Create a School Admin account. They will log in using their email and a temporary password to manage their school's students.
          </div>
          <div class="success-message" id="schoolManageSuccess">Action completed successfully!</div>
          
          <form id="createSchoolAdminForm" class="mb-xl bg-surface-container-low p-md rounded-xl border border-outline-variant">
            <h3 class="text-title-md font-bold mb-md">Add School Admin</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div class="form-group mb-0">
                    <label>Admin Name</label>
                    <input type="text" id="schoolAdminName" required placeholder="e.g. John Doe">
                </div>
                <div class="form-group mb-0">
                    <label>Admin Email</label>
                    <input type="email" id="schoolAdminEmail" required placeholder="admin@school.com">
                </div>
                <div class="form-group mb-0">
                    <label>Select School</label>
                    <select id="schoolAdminSchoolId" required>
                        <option value="peniel">Peniel Lily Montessori</option>
                        <option value="southgold">South Gold Montessori</option>
                        <option value="sapphire">Sapphire Explorer Montessori</option>
                        <option value="easystars">Easy Stars Early Years</option>
                        <option value="christycaleb">Christy Caleb International</option>
                        <option value="royalbreed">Royal Breed Academy</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="btn btn-primary mt-md" id="btnCreateSchoolAdmin">Create Admin Account</button>
            <div id="schoolAdminResult" class="mt-sm text-sm font-medium"></div>
          </form>

          <hr class="my-xl border-outline-variant">
          <h3 class="text-title-md font-bold mb-md">School Access Codes</h3>`;

html = html.replace(targetHtml, replacementHtml);

const jsTarget = `window.updateStudentCode = async function(id) {`;
const jsReplacement = `
// School Admin Creation
document.addEventListener('DOMContentLoaded', () => {
    const createSchoolAdminForm = document.getElementById('createSchoolAdminForm');
    if (createSchoolAdminForm) {
        createSchoolAdminForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btnCreateSchoolAdmin');
            const res = document.getElementById('schoolAdminResult');
            
            btn.disabled = true;
            btn.textContent = 'Creating...';
            res.className = 'mt-sm text-sm font-medium';
            res.textContent = '';
            
            try {
                const name = document.getElementById('schoolAdminName').value.trim();
                const email = document.getElementById('schoolAdminEmail').value.trim();
                const schoolId = document.getElementById('schoolAdminSchoolId').value;
                
                const createAdmin = window.httpsCallable(window.functions, 'createSchoolAdminAccount');
                const result = await createAdmin({ name, email, schoolId });
                
                if (result.data && result.data.success) {
                    res.classList.add('text-[#006905]'); // Success green
                    res.textContent = 'Success! Temporary password: ' + result.data.tempPassword;
                    createSchoolAdminForm.reset();
                } else {
                    throw new Error(result.data ? result.data.message : 'Unknown error');
                }
            } catch (err) {
                console.error(err);
                res.classList.add('text-error');
                res.textContent = 'Error: ' + err.message;
            } finally {
                btn.disabled = false;
                btn.textContent = 'Create Admin Account';
            }
        });
    }
});

window.updateSchoolCode = async function(schoolId) {
  const code = document.getElementById(schoolId + 'Code').value;
  if (!code) return alert('Enter a code');
  try { 
      const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      await setDoc(doc(db, 'schools', schoolId), { accessCode: code }, { merge: true }); 
      alert('School access code updated!'); 
  } catch(e) { alert(e.message); }
};

window.updateStudentCode = async function(id) {`;

html = html.replace(jsTarget, jsReplacement);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
console.log("Added Create School Admin functionality");
