const fs = require('fs');

let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html', 'utf8');

// I will extract the header and footer parts and replace the content inside the body.
// We need to keep the Tailwind config and styling.
const bodyStart = html.indexOf('<body');
const bodyEnd = html.lastIndexOf('</body>');

let newBody = `<body class="bg-surface text-on-surface min-h-screen flex overflow-hidden">
    <!-- Sidebar -->
    <div id="mobileOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden md:hidden" onclick="toggleSidebar()"></div>
    <aside id="appSidebar" class="fixed md:static left-0 top-0 h-full w-64 flex-shrink-0 flex flex-col p-md z-50 bg-surface shadow-sm border-r border-outline-variant transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto">
        <div class="mb-xl px-md mt-4 md:mt-0 flex justify-between items-center">
            <div class="logo-block" style="padding: 24px 20px 16px; border-bottom: 1px solid rgba(201,168,76,0.3);">
              <img src="../../assets/img/android-chrome-192x192.png" alt="Jaystarbliss Dynamic Hub" class="logo-img" style="height: 48px; width: auto; display: block;" onerror="this.style.display='none'; document.getElementById('logo-text').style.display='block'">
              <div id="logo-text" class="logo-text" style="display:none">
                <span class="logo-name" style="display: block; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 18px; color: #2C2C59;">Jaystarbliss</span>
                <span class="logo-sub" style="display: block; font-size: 11px; color: #C9A84C; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500;">Dynamic Hub</span>
              </div>
            </div>
            <button class="md:hidden text-on-surface border-none bg-transparent" onclick="toggleSidebar()">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <nav class="sidebar-menu flex-1 flex flex-col gap-xs mt-lg">
            <div class="sidebar-label">Main</div>
            <button class="nav-item active" data-tab="overview" onclick="window.switchTab('overview')">
                <span class="material-symbols-outlined">dashboard</span> Overview
            </button>
            <button class="nav-item" data-tab="students" onclick="window.switchTab('students')">
                <span class="material-symbols-outlined">groups</span> My Students
                <span class="nav-badge ml-auto bg-primary text-on-primary rounded-full px-2 py-0.5 text-xs" id="studentCountBadge">0</span>
            </button>
            <button class="nav-item" data-tab="settings" onclick="window.switchTab('settings')">
                <span class="material-symbols-outlined">settings</span> Settings
            </button>
            
            <div class="sidebar-label mt-auto">Account</div>
            <button class="nav-item" onclick="window.toggleTheme()">
                <span class="material-symbols-outlined">dark_mode</span> Toggle Theme
            </button>
            <button class="nav-item text-error hover:bg-error-container hover:text-on-error-container" onclick="window.globalPerformLogout()">
                <span class="material-symbols-outlined">logout</span> Log Out
            </button>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 h-full overflow-y-auto relative flex flex-col bg-surface-container-lowest">
        <!-- Header -->
        <header class="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-outline-variant p-md lg:px-xl flex items-center justify-between">
            <div class="flex items-center gap-md">
                <button class="md:hidden border-none bg-transparent text-on-surface" onclick="toggleSidebar()">
                    <span class="material-symbols-outlined">menu</span>
                </button>
                <div>
                    <h1 class="font-headline-md text-headline-md text-on-surface m-0" id="headerTitle">School Dashboard</h1>
                    <p class="text-body-sm text-on-surface-variant m-0" id="headerSubtitle">Manage your school's students and settings</p>
                </div>
            </div>
            
            <div class="flex items-center gap-sm">
                <div class="hidden sm:flex flex-col items-end mr-sm">
                    <span class="font-label-lg text-label-lg text-on-surface" id="userNameDisplay">School Admin</span>
                    <span class="text-body-xs text-on-surface-variant" id="schoolNameDisplay">Loading...</span>
                </div>
                <div class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-label-lg" id="userAvatarDisplay">
                    SA
                </div>
            </div>
        </header>

        <!-- Content Area -->
        <div class="p-md lg:p-xl flex-1 max-w-7xl mx-auto w-full">
            
            <!-- OVERVIEW TAB -->
            <div class="tab-pane active" id="tab-overview">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
                    <div class="bg-primary-container text-on-primary-container p-lg rounded-2xl flex items-center gap-md relative overflow-hidden">
                        <span class="material-symbols-outlined text-[48px] opacity-20 absolute right-4 bottom-4">groups</span>
                        <div>
                            <p class="text-label-md opacity-80 mb-1 uppercase tracking-wider">Total Students</p>
                            <h2 class="text-display-sm m-0 font-bold" id="statTotalStudents">0</h2>
                        </div>
                    </div>
                    <div class="bg-secondary-container text-on-secondary-container p-lg rounded-2xl flex items-center gap-md relative overflow-hidden">
                        <span class="material-symbols-outlined text-[48px] opacity-20 absolute right-4 bottom-4">assignment_turned_in</span>
                        <div>
                            <p class="text-label-md opacity-80 mb-1 uppercase tracking-wider">Active Students</p>
                            <h2 class="text-display-sm m-0 font-bold" id="statActiveStudents">0</h2>
                        </div>
                    </div>
                </div>
                
                <div class="panel">
                    <div class="panel-head">
                        <h2 class="panel-title">Recent Activity</h2>
                    </div>
                    <div class="panel-body">
                        <div class="text-center text-on-surface-variant py-xl italic bg-surface-container-low rounded-lg">
                            Activity tracking will appear here soon.
                        </div>
                    </div>
                </div>
            </div>

            <!-- STUDENTS TAB -->
            <div class="tab-pane" id="tab-students">
                <div class="flex justify-between items-center mb-md">
                    <h2 class="text-title-lg font-bold text-on-surface">Manage Students</h2>
                    <button class="btn btn-primary" onclick="document.getElementById('addStudentModal').style.display='flex'">
                        <span class="material-symbols-outlined">person_add</span> Add New Student
                    </button>
                </div>
                
                <div class="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-surface-container text-on-surface-variant border-b border-outline-variant">
                                    <th class="p-4 font-semibold text-sm">Student Name</th>
                                    <th class="p-4 font-semibold text-sm">Username/Email</th>
                                    <th class="p-4 font-semibold text-sm">Access Code</th>
                                    <th class="p-4 font-semibold text-sm">Added On</th>
                                    <th class="p-4 font-semibold text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="studentsListTable">
                                <tr>
                                    <td colspan="5" class="p-8 text-center text-on-surface-variant italic">Loading students...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- SETTINGS TAB -->
            <div class="tab-pane" id="tab-settings">
                <h2 class="text-title-lg font-bold text-on-surface mb-md">Account Settings</h2>
                
                <div class="panel max-w-2xl">
                    <div class="panel-head">
                        <h2 class="panel-title"><span class="material-symbols-outlined">lock</span> Change Password</h2>
                    </div>
                    <div class="panel-body">
                        <form id="changePasswordForm">
                            <div class="form-group">
                                <label>New Password</label>
                                <input type="password" id="newPassword" required minlength="6" placeholder="Enter new password">
                            </div>
                            <div class="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" id="confirmPassword" required minlength="6" placeholder="Confirm new password">
                            </div>
                            <button type="submit" class="btn btn-primary mt-sm" id="btnChangePassword">
                                Update Password
                            </button>
                            <p id="passwordMessage" class="mt-sm text-sm hidden"></p>
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
    </main>
    
    <!-- Add Student Modal -->
    <div id="addStudentModal" class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-surface rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-outline-variant">
            <div class="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low rounded-t-2xl">
                <h3 class="text-title-lg font-bold text-on-surface m-0 flex items-center gap-2"><span class="material-symbols-outlined text-primary">person_add</span> Add New Student</h3>
                <button class="text-on-surface-variant hover:text-on-surface bg-transparent border-none p-1" onclick="document.getElementById('addStudentModal').style.display='none'">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="p-lg">
                <form id="addStudentForm">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="addName" required placeholder="e.g. John Doe">
                    </div>
                    <div class="form-group">
                        <label>Username (used for login)</label>
                        <input type="text" id="addUsername" required placeholder="e.g. johndoe">
                    </div>
                    <div class="form-group">
                        <label>Email Address (Optional)</label>
                        <input type="email" id="addEmail" placeholder="johndoe@example.com">
                    </div>
                    
                    <div class="info-box flex items-start gap-sm mt-md">
                        <span class="material-symbols-outlined text-primary">info</span>
                        <div>An access code will be generated automatically for this student.</div>
                    </div>
                    
                    <div class="mt-xl flex gap-md justify-end">
                        <button type="button" class="btn bg-surface-container hover:bg-surface-container-high text-on-surface" onclick="document.getElementById('addStudentModal').style.display='none'">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="btnSubmitStudent">Add Student</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
  import { getAuth, signOut, onAuthStateChanged, updatePassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
  import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp, doc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

  // Get config from localStorage or fallback
  let firebaseConfig;
  try {
    firebaseConfig = JSON.parse(localStorage.getItem('jdh_firebase_config'));
  } catch(e){}
  
  if (!firebaseConfig) {
    firebaseConfig = {
      apiKey: "AIzaSyD_lq2Z4qBrZZkzYmEMPPMtCKQmfSx2rkY",
      authDomain: "jaystarbliss-studios.firebaseapp.com",
      projectId: "jaystarbliss-studios",
      storageBucket: "jaystarbliss-studios.firebasestorage.app",
      messagingSenderId: "885364100276",
      appId: "1:885364100276:web:1159c4cbd9159aaa0e1be1"
    };
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  let currentSchoolId = null;
  let currentUser = null;

  // Sidebar toggle
  window.toggleSidebar = function() {
      const sidebar = document.getElementById('appSidebar');
      const overlay = document.getElementById('mobileOverlay');
      const isClosed = sidebar.classList.contains('-translate-x-full');
      if (isClosed) {
          sidebar.classList.remove('-translate-x-full');
          overlay.classList.remove('hidden');
      } else {
          sidebar.classList.add('-translate-x-full');
          overlay.classList.add('hidden');
      }
  };

  // Tab switching logic
  window.switchTab = function(tabId) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.sidebar-menu .nav-item').forEach(el => el.classList.remove('active'));
      const targetPane = document.getElementById('tab-' + tabId);
      if (targetPane) targetPane.classList.add('active');
      const targetNav = document.querySelector('.sidebar-menu .nav-item[data-tab="' + tabId + '"]');
      if (targetNav) targetNav.classList.add('active');
      if(window.innerWidth < 768) { window.toggleSidebar(); }
  };

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = '../auth/login.html';
      return;
    }
    
    // Check if the user is a school admin
    try {
        const adminDoc = await getDoc(doc(db, 'schoolAdmins', user.uid));
        if (adminDoc.exists()) {
            const data = adminDoc.data();
            currentSchoolId = data.schoolId;
            currentUser = user;
            
            document.getElementById('userNameDisplay').textContent = data.name || 'School Admin';
            document.getElementById('userAvatarDisplay').textContent = (data.name || 'SA').substring(0,2).toUpperCase();
            
            // Get school name
            const schoolDoc = await getDoc(doc(db, 'schools', currentSchoolId));
            if (schoolDoc.exists()) {
                document.getElementById('schoolNameDisplay').textContent = schoolDoc.data().name || currentSchoolId;
            } else {
                document.getElementById('schoolNameDisplay').textContent = currentSchoolId;
            }
            
            loadStudents();
        } else {
            // Not a school admin, maybe regular admin or student?
            alert('Access Denied. You are not registered as a School Admin.');
            await signOut(auth);
            window.location.href = '../auth/login.html';
        }
    } catch (e) {
        console.error("Error loading profile:", e);
    }
  });

  async function loadStudents() {
      if (!currentSchoolId) return;
      const tbody = document.getElementById('studentsListTable');
      tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-on-surface-variant italic">Loading students...</td></tr>';
      
      try {
          const q = query(collection(db, 'students'), where('schoolId', '==', currentSchoolId));
          const snap = await getDocs(q);
          
          document.getElementById('studentCountBadge').textContent = snap.size;
          document.getElementById('statTotalStudents').textContent = snap.size;
          document.getElementById('statActiveStudents').textContent = snap.size; // Assuming all active for now
          
          if (snap.empty) {
              tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-on-surface-variant italic">No students found. Add one above!</td></tr>';
              return;
          }
          
          tbody.innerHTML = '';
          snap.forEach(docSnap => {
              const data = docSnap.data();
              const dateAdded = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toLocaleDateString() : 'N/A';
              
              const tr = document.createElement('tr');
              tr.className = 'border-b border-outline-variant hover:bg-surface-container-high transition-colors';
              tr.innerHTML = \`
                  <td class="p-4">
                      <div class="font-semibold text-on-surface">\${data.name || data.fullName || 'Unnamed'}</div>
                  </td>
                  <td class="p-4 text-on-surface-variant">\${data.username || ''}<br><span class="text-xs">\${data.email || ''}</span></td>
                  <td class="p-4">
                      <div class="bg-surface-container px-2 py-1 rounded inline-block text-on-surface font-mono text-sm">\${data.accessCode || 'Hidden'}</div>
                  </td>
                  <td class="p-4 text-on-surface-variant text-sm">\${dateAdded}</td>
                  <td class="p-4 text-right">
                      <button class="text-error hover:bg-error-container p-2 rounded transition-colors" onclick="window.removeStudent('\${docSnap.id}')" title="Remove Student">
                          <span class="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                  </td>
              \`;
              tbody.appendChild(tr);
          });
      } catch (e) {
          console.error("Error loading students:", e);
          tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-error italic">Error loading students.</td></tr>';
      }
  }

  // Generate 8 char random code
  function generateCode() {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Add student
  document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnSubmitStudent');
      btn.disabled = true; btn.textContent = 'Adding...';
      
      try {
          const name = document.getElementById('addName').value.trim();
          const username = document.getElementById('addUsername').value.trim().toLowerCase();
          const email = document.getElementById('addEmail').value.trim();
          const code = generateCode();
          
          // Check if username exists
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
              schoolId: currentSchoolId,
              studentType: 'school',
              role: 'student',
              authType: 'accessCode',
              createdAt: serverTimestamp()
          });
          
          alert('Student added successfully! Their access code is: ' + code);
          document.getElementById('addStudentForm').reset();
          document.getElementById('addStudentModal').style.display = 'none';
          loadStudents();
      } catch(err) {
          console.error(err);
          alert('Error adding student: ' + err.message);
      } finally {
          btn.disabled = false; btn.textContent = 'Add Student';
      }
  });

  window.removeStudent = async function(id) {
      if(confirm('Are you sure you want to remove this student? This action cannot be undone.')) {
          try {
              await deleteDoc(doc(db, 'students', id));
              loadStudents();
          } catch(e) {
              alert('Error: ' + e.message);
          }
      }
  };

  // Change password
  document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPwd = document.getElementById('newPassword').value;
      const confPwd = document.getElementById('confirmPassword').value;
      const msg = document.getElementById('passwordMessage');
      const btn = document.getElementById('btnChangePassword');
      
      if (newPwd !== confPwd) {
          msg.textContent = 'Passwords do not match.';
          msg.className = 'mt-sm text-sm text-error block';
          return;
      }
      
      btn.disabled = true; btn.textContent = 'Updating...';
      try {
          await updatePassword(auth.currentUser, newPwd);
          msg.textContent = 'Password updated successfully!';
          msg.className = 'mt-sm text-sm text-[#006905] block'; // green
          document.getElementById('changePasswordForm').reset();
      } catch(err) {
          console.error(err);
          msg.textContent = 'Error: ' + err.message + ' (You may need to log out and log back in first)';
          msg.className = 'mt-sm text-sm text-error block';
      } finally {
          btn.disabled = false; btn.textContent = 'Update Password';
      }
  });

</script>
</body>`;

html = html.substring(0, bodyStart) + newBody;
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/school-portal.html', html);
console.log("Rewrote school portal completely!");
