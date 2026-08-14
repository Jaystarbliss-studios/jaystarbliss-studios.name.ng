
import { initializeApp, getApps }
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getFirestore, collection, addDoc, getDoc, getDocs,
  doc, query, where, orderBy, serverTimestamp,
  onSnapshot, updateDoc, setDoc, deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

{
 
// Re-use already-initialised app (admin.html already runs Firebase)
const app = getApps()[0];
const db  = getFirestore(app);
 
// ── Utility ──────────────────────────────────────────────
function fmtDate(ts) {
  if (!ts) return '—';
  try { return ts.toDate().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
  catch(e) { return '—'; }
}
 
function showSuccess(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}
 
function statusTag(status) {
  return `<span class="status-tag ${status}">${status.toUpperCase()}</span>`;
}
 
// ── Access Code Generator ─────────────────────────────────
function generateAccessCode(length = 7) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => chars[b % chars.length]).join('');
}
 
// ════════════════════════════════════════════════════
// STUDENT REQUESTS — real-time listener
// ════════════════════════════════════════════════════
let _reqFilter = 'pending';
let _reqUnsub  = null;
 
function listenStudentRequests() {
  if (_reqUnsub) _reqUnsub();
  const container = document.getElementById('studentRequestsList');
 
  let q;
  if (_reqFilter === 'all') {
    q = query(collection(db, 'student_requests'), orderBy('createdAt', 'desc'));
  } else {
    q = query(
      collection(db, 'student_requests'),
      where('status', '==', _reqFilter),
      orderBy('createdAt', 'desc')
    );
  }
 
  _reqUnsub = onSnapshot(q, snap => {
    // Update badge on nav item
    const badge = document.getElementById('reqBadge');
    if (badge && _reqFilter === 'pending') badge.textContent = snap.size;
 
    if (snap.empty) {
      container.innerHTML = `<div class="req-empty">No ${_reqFilter} requests.</div>`;
      return;
    }
    container.innerHTML = '';
    snap.forEach(d => {
      const data = d.data();
      const card = document.createElement('div');
      card.className = 'req-card';
      card.innerHTML = `
        <div class="req-card-head">
          <div>
            <div class="req-card-name">👤 ${data.name || '—'}</div>
            <div class="req-card-meta">
              📧 ${data.email || '—'}<br>
              📚 ${Array.isArray(data.subjects) ? data.subjects.join(', ') : (data.subjects || '—')}<br>
              📅 ${fmtDate(data.createdAt)}
              ${data.parentId ? '<br>👨‍👩‍👧 Parent: ' + data.parentId : ''}
              ${data.notes    ? '<br>📝 ' + data.notes : ''}
            </div>
          </div>
          ${statusTag(data.status || 'pending')}
        </div>
        ${data.status === 'approved' && data.accessCode ? `
          <div class="code-reveal">
            <span>Access Code</span>
            <strong>${data.accessCode}</strong>
          </div>` : ''}
        ${data.status === 'pending' ? `
          <div class="req-card-actions">
            <button class="btn btn-primary btn-sm" id="approve_req_${d.id}">
              ✓ APPROVE
            </button>
            <button class="btn btn-danger btn-sm" id="reject_req_${d.id}">
              ✗ REJECT
            </button>
          </div>
          <textarea class="reject-reason" id="reason_req_${d.id}"
            placeholder="Rejection reason (required to reject)" rows="2"></textarea>
        ` : ''}`;
      container.appendChild(card);
 
      // Wire buttons
      if (data.status === 'pending') {
        document.getElementById(`approve_req_${d.id}`)
          .addEventListener('click', () => handleApproveRequest(d.id, data));
        document.getElementById(`reject_req_${d.id}`)
          .addEventListener('click', () => handleRejectRequest(d.id));
      }
    });
  }, err => {
    console.error('[JDH] student_requests listener:', err);
    container.innerHTML = `<div class="req-empty">Error loading: ${err.message}</div>`;
  });
}
 
async function handleApproveRequest(reqId, data) {
  const btn = document.getElementById(`approve_req_${reqId}`);
  btn.disabled = true; btn.textContent = 'Processing…';
  try {
    const accessCode = generateAccessCode();
 
    // Create in students
    const indivRef = await addDoc(collection(db, 'students'), {
      fullName:     data.name,
      username:     (data.email || data.name).split('@')[0].replace(/\s+/g,'').toLowerCase(),
      email:        (data.email || '').toLowerCase(),
      accessCode,
      parentId:     data.parentId || null,
      subjects:     Array.isArray(data.subjects)
                      ? data.subjects
                      : (data.subjects || '').split(',').map(s => s.trim()).filter(Boolean),
      registeredAt: serverTimestamp()
    });
 
    // Update request doc
    await updateDoc(doc(db, 'student_requests', reqId), {
      status:     'approved',
      accessCode,
      studentId:  indivRef.id,
      approvedAt: serverTimestamp()
    });
 
    // Log activity
    await addDoc(collection(db, 'activityLogs'), {
      type:      'student_request_approved',
      reqId,
      studentId: indivRef.id,
      accessCode,
      timestamp: serverTimestamp()
    });
 
    alert(`✅ Student approved!\n\nAccess Code: ${accessCode}\n\nShare this code with the student to log in.`);
  } catch(e) {
    alert('Error: ' + e.message);
    btn.disabled = false; btn.textContent = '✓ APPROVE';
  }
}
 
async function handleRejectRequest(reqId) {
  const reason = document.getElementById(`reason_req_${reqId}`)?.value.trim();
  if (!reason) { alert('Please enter a rejection reason.'); return; }
  try {
    await updateDoc(doc(db, 'student_requests', reqId), {
      status:     'rejected',
      reason,
      rejectedAt: serverTimestamp()
    });
  } catch(e) { alert('Error: ' + e.message); }
}
 
// Filter tabs for student requests
document.getElementById('reqFilterTabs')?.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#reqFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _reqFilter = btn.dataset.filter;
    listenStudentRequests();
  });
});
 
// Manual request form
document.getElementById('manualRequestForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  try {
    await addDoc(collection(db, 'student_requests'), {
      name:      document.getElementById('mReqName').value.trim(),
      email:     document.getElementById('mReqEmail').value.trim().toLowerCase(),
      subjects:  document.getElementById('mReqSubjects').value.split(',').map(s => s.trim()).filter(Boolean),
      parentId:  document.getElementById('mReqParentId').value.trim() || null,
      notes:     document.getElementById('mReqNotes').value.trim(),
      status:    'pending',
      createdAt: serverTimestamp()
    });
    showSuccess('manualReqSuccess');
    this.reset();
  } catch(e) { alert('Error: ' + e.message); }
});
 
listenStudentRequests();
 
// ════════════════════════════════════════════════════
// TUTOR APPLICATIONS — real-time listener
// ════════════════════════════════════════════════════
let _tutorFilter = 'pending';
let _tutorUnsub  = null;
 
function listenTutorApplications() {
  if (_tutorUnsub) _tutorUnsub();
  const container = document.getElementById('tutorApplicationsList');
 
  const q = _tutorFilter === 'all'
    ? query(collection(db, 'tutor_applications'), orderBy('createdAt', 'desc'))
    : query(collection(db, 'tutor_applications'), where('status','==',_tutorFilter), orderBy('createdAt','desc'));
 
  _tutorUnsub = onSnapshot(q, snap => {
    if (snap.empty) {
      container.innerHTML = `<div class="req-empty">No ${_tutorFilter} applications.</div>`;
      return;
    }
    container.innerHTML = '';
    snap.forEach(d => {
      const data = d.data();
      const card = document.createElement('div');
      card.className = 'req-card';
      card.innerHTML = `
        <div class="req-card-head">
          <div>
            <div class="req-card-name">🎓 ${data.name || '—'}</div>
            <div class="req-card-meta">
              📧 ${data.email || '—'}<br>
              📞 ${data.phone || '—'}<br>
              📚 ${Array.isArray(data.subjects) ? data.subjects.join(', ') : (data.subjects || '—')}<br>
              📅 ${fmtDate(data.createdAt)}
              ${data.experience ? '<br>💼 Experience: ' + data.experience : ''}
              ${data.bio        ? '<br>📝 ' + data.bio : ''}
            </div>
          </div>
          ${statusTag(data.status || 'pending')}
        </div>
        ${data.status === 'pending' ? `
          <div class="req-card-actions">
            <button class="btn btn-primary btn-sm" id="approve_tutor_${d.id}">✓ APPROVE</button>
            <button class="btn btn-danger btn-sm"  id="reject_tutor_${d.id}">✗ REJECT</button>
          </div>
          <textarea class="reject-reason" id="reason_tutor_${d.id}"
            placeholder="Rejection reason (required)" rows="2"></textarea>
        ` : ''}`;
      container.appendChild(card);
 
      if (data.status === 'pending') {
        document.getElementById(`approve_tutor_${d.id}`)
          .addEventListener('click', () => handleApproveTutor(d.id, data));
        document.getElementById(`reject_tutor_${d.id}`)
          .addEventListener('click', () => handleRejectTutor(d.id));
      }
    });
  }, err => {
    container.innerHTML = `<div class="req-empty">Error: ${err.message}</div>`;
  });
}
 
async function handleApproveTutor(appId, data) {
  const btn = document.getElementById(`approve_tutor_${appId}`);
  btn.disabled = true; btn.textContent = 'Processing…';
  try {
    await setDoc(doc(db, 'tutors', appId), {
      name:      data.name,
      email:     data.email,
      phone:     data.phone    || '',
      subjects:  Array.isArray(data.subjects)
                   ? data.subjects
                   : (data.subjects || '').split(',').map(s => s.trim()).filter(Boolean),
      bio:       data.bio      || '',
      role:      'tutor',
      createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, 'tutor_applications', appId), {
      status:     'approved',
      approvedAt: serverTimestamp()
    });
    alert(`✅ ${data.name} approved as tutor!`);
  } catch(e) {
    alert('Error: ' + e.message);
    btn.disabled = false; btn.textContent = '✓ APPROVE';
  }
}
 
async function handleRejectTutor(appId) {
  const reason = document.getElementById(`reason_tutor_${appId}`)?.value.trim();
  if (!reason) { alert('Please enter a rejection reason.'); return; }
  try {
    await updateDoc(doc(db, 'tutor_applications', appId), {
      status:     'rejected',
      reason,
      rejectedAt: serverTimestamp()
    });
  } catch(e) { alert('Error: ' + e.message); }
}
 
document.getElementById('tutorFilterTabs')?.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#tutorFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _tutorFilter = btn.dataset.filter;
    listenTutorApplications();
  });
});
 
listenTutorApplications();
 
// ════════════════════════════════════════════════════
// ENROLLMENT REQUESTS — real-time listener
// ════════════════════════════════════════════════════
let _enrFilter = 'pending';
let _enrUnsub  = null;
 
function listenEnrollmentRequests() {
  if (_enrUnsub) _enrUnsub();
  const container = document.getElementById('enrollmentRequestsList');
 
  const q = _enrFilter === 'all'
    ? query(collection(db, 'enrollment_requests'), orderBy('createdAt', 'desc'))
    : query(collection(db, 'enrollment_requests'), where('status','==',_enrFilter), orderBy('createdAt','desc'));
 
  _enrUnsub = onSnapshot(q, snap => {
    if (snap.empty) {
      container.innerHTML = `<div class="req-empty">No ${_enrFilter} enrollment requests.</div>`;
      return;
    }
    container.innerHTML = '';
    snap.forEach(d => {
      const data = d.data();
      const card = document.createElement('div');
      card.className = 'req-card';
      card.innerHTML = `
        <div class="req-card-head">
          <div>
            <div class="req-card-name">📋 ${data.studentName || '—'}</div>
            <div class="req-card-meta">
              👨‍👩‍👧 Parent ID: ${data.parentId || '—'}<br>
              📧 ${data.studentEmail || '—'}<br>
              📚 ${Array.isArray(data.subjects) ? data.subjects.join(', ') : (data.subjects || '—')}<br>
              📅 Plan: <strong>${data.plan || '—'}</strong> | Schedule: ${data.schedule || '—'}<br>
              💳 Amount: ₦${(data.amount || 0).toLocaleString()}<br>
              🗓️ ${fmtDate(data.createdAt)}
            </div>
          </div>
          ${statusTag(data.status || 'pending')}
        </div>
        ${data.studentId ? `<div class="req-card-meta">✅ Linked Student ID: <code>${data.studentId}</code></div>` : ''}
        ${data.status === 'pending' ? `
          <div class="req-card-actions">
            <button class="btn btn-primary btn-sm" id="approve_enr_${d.id}">
              ✓ CONFIRM PAYMENT &amp; APPROVE
            </button>
            <button class="btn btn-danger btn-sm" id="reject_enr_${d.id}">✗ REJECT</button>
          </div>` : ''}`;
      container.appendChild(card);
 
      if (data.status === 'pending') {
        document.getElementById(`approve_enr_${d.id}`)
          .addEventListener('click', () => handleApproveEnrollment(d.id, data));
        document.getElementById(`reject_enr_${d.id}`)
          .addEventListener('click', () => handleRejectEnrollment(d.id));
      }
    });
  }, err => {
    container.innerHTML = `<div class="req-empty">Error: ${err.message}</div>`;
  });
}
 
async function handleApproveEnrollment(enrId, data) {
  const btn = document.getElementById(`approve_enr_${enrId}`);
  btn.disabled = true; btn.textContent = 'Processing…';
  try {
    const accessCode = generateAccessCode();
    let studentId = data.studentId;
 
    if (!studentId) {
      const username = (data.studentEmail || data.studentName || 'student')
        .split('@')[0].replace(/\s+/g,'').toLowerCase();
 
      const indivRef = await addDoc(collection(db, 'students'), {
        fullName:     data.studentName,
        username,
        email:        (data.studentEmail || '').toLowerCase(),
        accessCode,
        parentId:     data.parentId,
        subjects:     Array.isArray(data.subjects)
                        ? data.subjects
                        : (data.subjects || '').split(',').map(s => s.trim()).filter(Boolean),
        plan:         data.plan     || '',
        schedule:     data.schedule || '',
        registeredAt: serverTimestamp()
      });
      studentId = indivRef.id;
 
      // Create payment record
      await addDoc(collection(db, 'payments'), {
        parentId:     data.parentId,
        studentId,
        enrollmentId: enrId,
        amount:       data.amount || 0,
        plan:         data.plan   || '',
        status:       'paid',
        confirmedAt:  serverTimestamp(),
        createdAt:    serverTimestamp()
      });
    }
 
    // Link student to parent's children array
    const parentRef  = doc(db, 'parents', data.parentId);
    const parentSnap = await getDoc(parentRef);
    if (parentSnap.exists()) {
      const children = parentSnap.data().children || [];
      if (!children.includes(studentId)) {
        await updateDoc(parentRef, { children: [...children, studentId] });
      }
    }
 
    // Mark enrollment approved
    await updateDoc(doc(db, 'enrollment_requests', enrId), {
      status:     'approved',
      studentId,
      accessCode: accessCode || data.accessCode || '',
      approvedAt: serverTimestamp()
    });
 
    // Log
    await addDoc(collection(db, 'activityLogs'), {
      type:      'enrollment_approved',
      enrId,
      studentId,
      timestamp: serverTimestamp()
    });
 
    alert(`✅ Enrollment approved!\n\nStudent ID: ${studentId}\nAccess Code: ${accessCode}`);
  } catch(e) {
    alert('Error approving enrollment: ' + e.message);
    btn.disabled = false; btn.textContent = '✓ CONFIRM PAYMENT & APPROVE';
  }
}
 
async function handleRejectEnrollment(enrId) {
  if (!confirm('Reject this enrollment request?')) return;
  try {
    await updateDoc(doc(db, 'enrollment_requests', enrId), {
      status:     'rejected',
      rejectedAt: serverTimestamp()
    });
  } catch(e) { alert('Error: ' + e.message); }
}
 
document.getElementById('enrFilterTabs')?.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#enrFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _enrFilter = btn.dataset.filter;
    listenEnrollmentRequests();
  });
});
 
listenEnrollmentRequests();
 
// ════════════════════════════════════════════════════
// PAYMENTS
// ════════════════════════════════════════════════════
async function loadPayments() {
  const tbody = document.getElementById('paymentsTableBody');
  tbody.innerHTML = '<tr><td colspan="6" class="req-empty">Loading…</td></tr>';
  try {
    const snap = await getDocs(
      query(collection(db, 'payments'), orderBy('createdAt', 'desc'))
    );
    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="6" class="req-empty">No payment records yet.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    snap.forEach(d => {
      const data = d.data();
      const tr   = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family:var(--mono);font-size:.62rem;">${data.studentId || '—'}</td>
        <td>${data.plan || '—'}</td>
        <td style="color:var(--gold);">₦${(data.amount || 0).toLocaleString()}</td>
        <td>${statusTag(data.status || 'pending')}</td>
        <td>${fmtDate(data.createdAt)}</td>
        <td>
          ${data.status !== 'paid' ? `
            <button class="btn btn-primary btn-sm" onclick="window._markPaid('${d.id}')">
              MARK PAID
            </button>` : ''}
          ${data.status !== 'pending' ? `
            <button class="btn btn-ghost btn-sm" onclick="window._markPending('${d.id}')">
              MARK PENDING
            </button>` : ''}
        </td>`;
      tbody.appendChild(tr);
    });
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="6" class="req-empty">Error: ${e.message}</td></tr>`;
  }
}
 
window._markPaid = async function(id) {
  try {
    await updateDoc(doc(db, 'payments', id), { status: 'paid', paidAt: serverTimestamp() });
    showSuccess('paymentSuccess');
    loadPayments();
  } catch(e) { alert('Error: ' + e.message); }
};
 
window._markPending = async function(id) {
  try {
    await updateDoc(doc(db, 'payments', id), { status: 'pending', updatedAt: serverTimestamp() });
    showSuccess('paymentSuccess');
    loadPayments();
  } catch(e) { alert('Error: ' + e.message); }
};
 
document.getElementById('addPaymentForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  try {
    await addDoc(collection(db, 'payments'), {
      studentId:  document.getElementById('payStudentId').value.trim(),
      parentId:   document.getElementById('payParentId').value.trim(),
      amount:     parseFloat(document.getElementById('payAmount').value) || 0,
      plan:       document.getElementById('payPlan').value,
      status:     document.getElementById('payStatus').value,
      reference:  document.getElementById('payRef').value.trim(),
      createdAt:  serverTimestamp()
    });
    showSuccess('paymentSuccess');
    this.reset();
    loadPayments();
  } catch(e) { alert('Error: ' + e.message); }
});
 
loadPayments();
// ─── Auto-refresh payments every 60s ───────────────────────
setInterval(loadPayments, 60000);

}

