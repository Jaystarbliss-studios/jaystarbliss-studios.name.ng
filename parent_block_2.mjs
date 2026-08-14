
import { initializeApp, getApps }
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore, collection, addDoc, getDoc, getDocs, updateDoc,
  doc, query, where, orderBy, serverTimestamp, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD_lq2Z4qBrZZkzYmEMPPMtCKQmfSx2rkY",
  authDomain: "jaystarbliss-studios.firebaseapp.com",
  projectId: "jaystarbliss-studios",
  storageBucket: "jaystarbliss-studios.firebasestorage.app",
  messagingSenderId: "885364100276",
  appId: "1:885364100276:web:1159c4cbd9159aaa0e1be1"
};

const app  = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── Auth guard ───────────────────────────────────────────
if (!sessionStorage.getItem('userRole') || sessionStorage.getItem('userRole') !== 'parent') {
  window.location.href = '../auth/login.html';
}

onAuthStateChanged(auth, user => {
  if (!user) {
    sessionStorage.clear();
    window.location.href = '../auth/login.html';
  }
});

const parentId   = sessionStorage.getItem('userId');
const parentName = sessionStorage.getItem('userName') || 'Parent';

// Populate UI name fields
const initials = parentName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
document.getElementById('topbarName').textContent   = parentName;
document.getElementById('topbarAvatar').textContent = initials;
document.getElementById('sidebarAvatar').textContent = initials;
document.getElementById('sidebarName').textContent   = parentName;
document.getElementById('welcomeMsg').textContent    =
  `Welcome back, ${parentName.split(' ')[0]} — ${new Date().toLocaleDateString('en-US',{weekday:'long',day:'numeric',month:'short',year:'numeric'})}`;

// Logout
window.doLogout = async () => {
  try { await signOut(auth); } catch(e){}
  sessionStorage.clear();
  window.location.href = '../auth/login.html';
};

// Utilities
function fmtDate(ts) {
  if (!ts) return '—';
  try { return ts.toDate().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
  catch(e) { return '—'; }
}
function timeAgo(ts) {
  if (!ts) return 'recently';
  const diff = Date.now() - ts.toDate().getTime();
  const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), d = Math.floor(diff/86400000);
  if (m < 1) return 'just now'; if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`; return `${d}d ago`;
}
function showMsg(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

// ════════════════════════════════════════════════════
// LOAD CHILDREN
// ════════════════════════════════════════════════════
let _children = [];

async function loadChildren() {
  const grid  = document.getElementById('childrenGrid');
  const ovList = document.getElementById('overviewChildren');
  try {
    const snap = await getDocs(
      query(collection(db, 'individualStudents'), where('parentId', '==', parentId))
    );
    _children = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    document.getElementById('statChildren').textContent = _children.length;

    if (!_children.length) {
      grid.innerHTML   = '<div class="empty" style="grid-column:1/-1;">No children enrolled yet. <a href="#" onclick="window.switchTab(\'enroll\')" style="color:var(--blue);">Enroll one now →</a></div>';
      ovList.innerHTML = '<div class="empty">No children yet.</div>';
      return;
    }

    // Full cards
    grid.innerHTML = '';
    _children.forEach(child => {
      const subjects = Array.isArray(child.subjects) ? child.subjects : [];
      const card = document.createElement('div');
      card.className = 'child-card';
      card.innerHTML = `
        <div class="child-name">👤 ${child.fullName || child.username}</div>
        <div class="child-meta">
          <strong>Username:</strong> @${child.username}<br>
          <strong>Plan:</strong> ${child.plan || '—'}<br>
          <strong>Schedule:</strong> ${child.schedule || '—'}<br>
          <strong>Enrolled:</strong> ${fmtDate(child.registeredAt)}
        </div>
        ${subjects.length ? `<div style="margin-top:.55rem;">${subjects.map(s => `<span class="subject-tag">${s}</span>`).join('')}</div>` : ''}
        ${child.accessCode ? `
          <div class="access-code-box">
            <span>Access Code</span>
            <strong>${child.accessCode}</strong>
          </div>` : ''}
        <div class="child-actions">
          <button class="btn btn-ghost btn-sm" onclick="window.switchTab('payments')">
            <span class="material-symbols-outlined" style="font-size:.85rem;">payments</span>
            Payments
          </button>
        </div>`;
      grid.appendChild(card);
    });

    // Overview list (condensed)
    ovList.innerHTML = _children.slice(0, 5).map(child => `
      <div class="activity-item">
        <div class="activity-dot blue"></div>
        <div class="activity-text">
          <div class="activity-title">${child.fullName || child.username}</div>
          <div class="activity-time">${child.plan || 'Plan not set'} · ${fmtDate(child.registeredAt)}</div>
        </div>
      </div>`).join('');

    // Populate student dropdown on enroll page for linked children
    loadStudentsDropdown();
  } catch(e) {
    console.error('[JDH] loadChildren:', e);
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1;">Error loading children.</div>';
  }
}

function loadStudentsDropdown() {
  const dd = document.getElementById('targetStudent');
  if (!dd) return;
  dd.innerHTML = '<option value="">— New Child —</option>';
  _children.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.fullName || c.username;
    dd.appendChild(opt);
  });
}

// ════════════════════════════════════════════════════
// LOAD PAYMENTS
// ════════════════════════════════════════════════════
async function loadPayments() {
  const container  = document.getElementById('paymentsContainer');
  const ovPayments = document.getElementById('overviewPayments');
  try {
    const snap = await getDocs(
      query(collection(db, 'payments'), where('parentId', '==', parentId), orderBy('createdAt', 'desc'))
    );
    document.getElementById('statPayments').textContent = snap.size;

    if (snap.empty) {
      container.innerHTML  = '<div class="empty">No payment records yet.</div>';
      ovPayments.innerHTML = '<div class="empty">No payments yet.</div>';
      return;
    }

    const payments = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Overview list
    ovPayments.innerHTML = payments.slice(0, 5).map(p => `
      <div class="activity-item">
        <div class="activity-dot ${p.status === 'paid' ? 'green' : 'gold'}"></div>
        <div class="activity-text">
          <div class="activity-title">₦${(p.amount || 0).toLocaleString()} · ${p.plan || '—'}</div>
          <div class="activity-time">${p.status.toUpperCase()} · ${fmtDate(p.createdAt)}</div>
        </div>
        <span class="pay-pill ${p.status}">${p.status}</span>
      </div>`).join('');

    // Full payments list
    container.innerHTML = payments.map(p => `
      <div class="activity-item" style="flex-wrap:wrap;gap:.75rem;padding:.9rem 1rem;">
        <div class="activity-dot ${p.status === 'paid' ? 'green' : 'gold'}"></div>
        <div class="activity-text">
          <div class="activity-title">₦${(p.amount || 0).toLocaleString()} — ${p.plan || '—'}</div>
          <div class="activity-time">
            Student: ${p.studentId || '—'} · ${fmtDate(p.createdAt)}
            ${p.reference ? ' · Ref: ' + p.reference : ''}
          </div>
        </div>
        <span class="pay-pill ${p.status}">${p.status}</span>
      </div>`).join('');
  } catch(e) {
    console.error('[JDH] loadPayments:', e);
    container.innerHTML = '<div class="empty">Error loading payments.</div>';
  }
}

// ════════════════════════════════════════════════════
// ENROLLMENT FORM — plan cards + subject checkboxes
// ════════════════════════════════════════════════════
const SUBJECTS = [
  'Mathematics','English','Physics','Chemistry','Biology',
  'Literature','Government','CRS','Accounting','Commerce',
  'Marketing','Programming','Web Development','AI Tools',
  'Tech Literacy','Graphic Design','Music','Creative Arts',
  'WAEC Prep','NECO Prep','JAMB Prep'
];

const PLANS = [
  { key:'2x_week',    name:'2× per Week', sessions:'8 sessions / month', amount:25000, note:'Most popular' },
  { key:'3x_week',    name:'3× per Week', sessions:'12 sessions / month', amount:35000, note:'Best results' },
  { key:'standard',   name:'Standard',    sessions:'Custom schedule',     amount:18000, note:'Flexible' },
  { key:'intensive',  name:'Intensive',   sessions:'Daily sessions',      amount:55000, note:'Exam prep' },
  { key:'full_blast', name:'Full Blast',  sessions:'5 subjects covered',  amount:60000, note:'Comprehensive' },
];

function buildSubjectCheckboxes() {
  const container = document.getElementById('subjectCheckboxes');
  if (!container) return;
  container.innerHTML = SUBJECTS.map(s => `
    <label style="display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .65rem;
      background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.15);
      border-radius:5px;cursor:pointer;font-size:.73rem;transition:all .15s;"
      onmouseover="this.style.borderColor='rgba(56,189,248,0.4)'"
      onmouseout="this.style.borderColor='rgba(56,189,248,0.15)'">
      <input type="checkbox" name="subject" value="${s}" style="accent-color:var(--blue);"> ${s}
    </label>`).join('');
}

function buildPlanCards() {
  const grid = document.getElementById('plansGrid');
  if (!grid) return;
  grid.innerHTML = PLANS.map(p => `
    <div class="plan-card" onclick="selectPlan('${p.key}',${p.amount})" id="plan_${p.key}">
      <span class="material-symbols-outlined plan-check">check_circle</span>
      <div class="plan-name">${p.name}</div>
      <div class="plan-price">₦${p.amount.toLocaleString()}<span>/mo</span></div>
      <div class="plan-sessions">${p.sessions}</div>
      <div style="font-family:var(--mono);font-size:.55rem;color:var(--text-dim);margin-top:.35rem;text-transform:uppercase;">${p.note}</div>
    </div>`).join('');
}

window.selectPlan = function(key, amount) {
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('plan_' + key)?.classList.add('selected');
  document.getElementById('selectedPlan').value  = key;
  document.getElementById('selectedAmount').value = amount;
};

// Enroll form submit
document.getElementById('enrollForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const studentName = document.getElementById('enrName').value.trim();
  const studentEmail = document.getElementById('enrEmail').value.trim();
  const plan = document.getElementById('selectedPlan').value;
  const amount = parseFloat(document.getElementById('selectedAmount').value) || 0;

  if (!studentName) { alert('Please enter the child\'s name.'); return; }
  if (!plan) { alert('Please select a plan.'); return; }

  const subjects = Array.from(document.querySelectorAll('input[name="subject"]:checked'))
                        .map(cb => cb.value);
  if (!subjects.length) { alert('Please select at least one subject.'); return; }

  const days = document.getElementById('enrDays').value;
  const time = document.getElementById('enrTime').value;
  const schedule = [days, time].filter(Boolean).join(' · ');
  const notes = document.getElementById('enrNotes').value.trim();

  const btn = this.querySelector('[type="submit"]');
  btn.disabled = true; btn.textContent = 'Submitting…';

  try {
    const docRef = await addDoc(collection(db, 'enrollment_requests'), {
      parentId,
      parentName,
      studentName,
      studentEmail: studentEmail.toLowerCase(),
      subjects,
      plan,
      amount,
      schedule,
      notes,
      status:    'pending',
      createdAt: serverTimestamp()
    });
    
    // Redirect to dummy checkout
    window.location.href = 'dummy-checkout.html?reqId=' + docRef.id;
    return; // Stop further execution
    

    showMsg('enrollMsg');
    this.reset();
    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('selectedPlan').value = '';
    loadMyEnrollments();
  } catch(err) {
    alert('Error submitting request: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:.9rem;">send</span> SUBMIT_ENROLLMENT_REQUEST';
  }
});

// Load this parent's enrollment requests
async function loadMyEnrollments() {
  const container = document.getElementById('myEnrollments');
  try {
    const snap = await getDocs(
      query(collection(db, 'enrollment_requests'), where('parentId', '==', parentId), orderBy('createdAt', 'desc'))
    );
    if (snap.empty) {
      container.innerHTML = '<div class="empty">No enrollment requests submitted yet.</div>';
      return;
    }
    const statusColor = { pending:'gold', approved:'green', rejected:'activity-dot' };
    container.innerHTML = snap.docs.map(d => {
      const data = d.data();
      const dot = data.status === 'approved' ? 'green' : data.status === 'pending' ? 'gold' : 'blue';
      return `<div class="activity-item">
        <div class="activity-dot ${dot}"></div>
        <div class="activity-text">
          <div class="activity-title">${data.studentName} — ${data.plan || '—'}</div>
          <div class="activity-time">
            ${Array.isArray(data.subjects) ? data.subjects.slice(0,3).join(', ') : '—'} ·
            ${fmtDate(data.createdAt)}
            ${data.studentId ? ' · ✅ Student created' : ''}
          </div>
        </div>
        <span class="pay-pill ${data.status === 'approved' ? 'paid' : 'pending'}">${data.status}</span>
      </div>`;
    }).join('');
  } catch(e) {
    container.innerHTML = '<div class="empty">Error loading enrollment history.</div>';
  }
}

// ════════════════════════════════════════════════════
// ACTIVITY LOG (from notifications)
// ════════════════════════════════════════════════════
async function loadActivity() {
  const log = document.getElementById('activityLog');
  try {
    const [allSnap, parentSnap] = await Promise.all([
      getDocs(query(collection(db, 'notifications'), where('recipientId', '==', 'all'))),
      getDocs(query(collection(db, 'notifications'), where('recipientId', '==', parentId)))
    ]);
    const map = new Map();
    [allSnap, parentSnap].forEach(s => s.forEach(d => map.set(d.id, { id: d.id, ...d.data() })));
    const notifs = [...map.values()].sort((a, b) =>
      (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0))
    );
    if (!notifs.length) {
      log.innerHTML = '<div class="empty">No activity yet.</div>';
      return;
    }
    log.innerHTML = notifs.map(n => `
      <div class="activity-item">
        <div class="activity-dot blue"></div>
        <div class="activity-text">
          <div class="activity-title">${n.title || 'Notification'}</div>
          <div class="activity-time">${n.message || ''} · ${timeAgo(n.timestamp)}</div>
        </div>
      </div>`).join('');
  } catch(e) {
    log.innerHTML = '<div class="empty">Error loading activity.</div>';
  }
}

// ── Init ──────────────────────────────────────────────────
buildSubjectCheckboxes();
buildPlanCards();
loadChildren();
loadPayments();
loadMyEnrollments();
loadActivity();
    loadConversations();
