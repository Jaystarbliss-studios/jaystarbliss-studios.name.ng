import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { createNotification } from './jdh-firebase-modules.js';

export async function loadProgrammeApprovals(db) {
    const tbody = document.querySelector('#approvalsTable tbody');
    if(!tbody) return;
    try {
        const q = query(collection(db, 'progress'), 
            where('programmeApprovedByAdmin', '==', false),
            where('programmeSubmittedAt', '!=', null)
        );
        const snap = await getDocs(q);
        
        let html = '';
        for(let docSnap of snap.docs) {
            const data = docSnap.data();
            // Need student name and tutor name, but for now we display IDs, or fetch them if needed.
            html += `<tr>
                <td>${data.studentId}</td>
                <td>${data.tutorId}</td>
                <td>${data.programmeTitle || 'Untitled'}</td>
                <td>${data.programmeSubmittedAt?.toDate().toLocaleDateString() || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="window.approveProgramme('${docSnap.id}', '${data.tutorId}', '${data.studentId}')">Approve</button>
                    <button class="btn btn-sm btn-danger" onclick="window.requestProgrammeChanges('${docSnap.id}', '${data.tutorId}')">Request Changes</button>
                </td>
            </tr>`;
        }
        tbody.innerHTML = html || '<tr><td colspan="5" class="req-empty">No pending approvals</td></tr>';
    } catch(e) {
        console.error("Error loading approvals:", e);
        tbody.innerHTML = '<tr><td colspan="5" class="req-empty">Error loading data.</td></tr>';
    }
}

window.approveProgramme = async function(progressId, tutorId, studentId) {
    if(!confirm("Approve this programme?")) return;
    try {
        const db = getFirestore();
        await updateDoc(doc(db, 'progress', progressId), {
            programmeApprovedByAdmin: true
        });
        await createNotification(tutorId, 'programme_approved', 'Programme Approved', `Your programme for student ${studentId} has been approved.`);
        loadProgrammeApprovals(db);
        alert("Approved successfully.");
    } catch(e) {
        alert("Error: " + e.message);
    }
};

window.requestProgrammeChanges = async function(progressId, tutorId) {
    const reason = prompt("Enter feedback for the tutor:");
    if(!reason) return;
    try {
        const db = getFirestore();
        await updateDoc(doc(db, 'progress', progressId), {
            programmeSubmittedAt: null // reset submission so they can resubmit
        });
        await createNotification(tutorId, 'programme_changes_requested', 'Programme Changes Requested', `Admin feedback: ${reason}`);
        loadProgrammeApprovals(db);
        alert("Changes requested.");
    } catch(e) {
        alert("Error: " + e.message);
    }
};
