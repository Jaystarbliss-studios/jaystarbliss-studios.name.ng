const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_a_tutor.js', 'utf8');

const newContent = `
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { createNotification } from './jdh-firebase-modules.js';

let currentStudentData = {};

window.viewStudentDetails = async function(studentId) {
    const db = getFirestore();
    const myUid = localStorage.getItem('userId');
    const panel = document.getElementById('studentDetailPanel');
    if(!panel) {
        const div = document.createElement('div');
        div.id = 'studentDetailPanel';
        div.style = "position:fixed; top:0; right:0; width:450px; height:100%; background:white; box-shadow:-2px 0 5px rgba(0,0,0,0.2); overflow-y:auto; padding:20px; z-index:1000;";
        document.body.appendChild(div);
    }
    const container = document.getElementById('studentDetailPanel');
    container.innerHTML = 'Loading...';
    
    try {
        const progSnap = await getDoc(doc(db, 'progress', studentId));
        let data = { programmeObjectives: [], checklistItems: [] };
        if (progSnap.exists()) {
            data = Object.assign(data, progSnap.data());
        }
        currentStudentData = data;
        
        const isApproved = data.programmeApprovedByAdmin;
        
        let html = \`
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>Student Details</h2>
                <button onclick="document.getElementById('studentDetailPanel').style.display='none'">Close</button>
            </div>
            
            <hr>
            <h3>Update Progress</h3>
            <div style="margin-bottom:10px;">
                <label>Performance Score: <span id="perfVal">\${data.performanceScore||0}</span></label><br>
                <input type="range" id="tPerf" min="0" max="100" value="\${data.performanceScore||0}" oninput="document.getElementById('perfVal').innerText=this.value" style="width:100%">
            </div>
            <div style="margin-bottom:10px;">
                <label>Completion %: <span id="compVal">\${data.completionPercentage||0}</span></label><br>
                <input type="range" id="tComp" min="0" max="100" value="\${data.completionPercentage||0}" oninput="document.getElementById('compVal').innerText=this.value" style="width:100%">
            </div>
            <div style="margin-bottom:10px;">
                <label>Checklist Items</label>
                <div id="checklistContainer">\`;
                
        (data.checklistItems || []).forEach((item, i) => {
            html += \`<div style="margin-bottom:5px;">
                <input type="checkbox" id="chk_\${i}" \${item.completed ? 'checked' : ''} onchange="window.toggleChecklist('\${studentId}', \${i}, this.checked)">
                <label for="chk_\${i}">\${item.label}</label>
            </div>\`;
        });
        
        html += \`</div>
                <div style="display:flex; gap:5px; margin-top:5px;">
                    <input type="text" id="newChecklistLabel" placeholder="New milestone..." style="flex:1;">
                    <button onclick="window.addChecklist('\${studentId}')" type="button">Add</button>
                </div>
            </div>
            <div style="margin-bottom:10px;">
                <label>Session Note</label><br>
                <textarea id="tNote" style="width:100%;" rows="2"></textarea>
            </div>
            <button onclick="window.saveProgressUpdate('\${studentId}')" style="background:#2C2C59; color:white; padding:8px 12px; border:none; cursor:pointer; border-radius:4px;">Save Progress</button>
            
            <hr>
            <h3>Programme Setup</h3>
            <div style="margin-bottom:10px;">
                <label>Title</label><br>
                <input type="text" id="progTitle" value="\${data.programmeTitle||''}" style="width:100%">
            </div>
            <div style="margin-bottom:10px;">
                <label>Outline</label><br>
                <textarea id="progOutline" style="width:100%;" rows="4">\${data.programmeOutline||''}</textarea>
            </div>
            <div style="margin-bottom:10px;">
                <label>Objectives</label>
                <ul id="objContainer" style="padding-left:20px; margin-bottom:5px;">\`;
                
        (data.programmeObjectives || []).forEach((obj, i) => {
            html += \`<li style="margin-bottom:5px;">\${obj} <button onclick="window.removeObjective('\${studentId}', \${i})" style="font-size:10px; color:red; border:none; background:none; cursor:pointer;">x</button></li>\`;
        });
        
        html += \`</ul>
                <div style="display:flex; gap:5px;">
                    <input type="text" id="newObjLabel" placeholder="New objective..." style="flex:1;">
                    <button onclick="window.addObjective('\${studentId}')" type="button">Add</button>
                </div>
            </div>
            <button onclick="window.submitProgramme('\${studentId}')" style="background:#2C2C59; color:white; padding:8px 12px; border:none; cursor:pointer; border-radius:4px;">Submit for Admin Approval</button>
            
            <p style="margin-top:10px;">\${isApproved ? '<span style="color:green; font-weight:bold;">Approved by admin.</span>' : '<span style="color:orange; font-weight:bold;">Pending / Draft</span>'}</p>
        \`;
        
        container.innerHTML = html;
        container.style.display = 'block';
    } catch(e) {
        container.innerHTML = 'Error loading details.';
        console.error(e);
    }
};

window.toggleChecklist = async function(studentId, index, isChecked) {
    if(!currentStudentData.checklistItems) return;
    currentStudentData.checklistItems[index].completed = isChecked;
    currentStudentData.checklistItems[index].completedAt = isChecked ? serverTimestamp() : null;
    await updateDoc(doc(getFirestore(), 'progress', studentId), {
        checklistItems: currentStudentData.checklistItems,
        updatedAt: serverTimestamp()
    });
};

window.addChecklist = async function(studentId) {
    const label = document.getElementById('newChecklistLabel').value.trim();
    if(!label) return;
    if(!currentStudentData.checklistItems) currentStudentData.checklistItems = [];
    currentStudentData.checklistItems.push({
        id: Date.now().toString(),
        label: label,
        completed: false,
        completedAt: null
    });
    await updateDoc(doc(getFirestore(), 'progress', studentId), {
        checklistItems: currentStudentData.checklistItems,
        updatedAt: serverTimestamp()
    });
    window.viewStudentDetails(studentId); // re-render
};

window.addObjective = async function(studentId) {
    const label = document.getElementById('newObjLabel').value.trim();
    if(!label) return;
    if(!currentStudentData.programmeObjectives) currentStudentData.programmeObjectives = [];
    currentStudentData.programmeObjectives.push(label);
    await updateDoc(doc(getFirestore(), 'progress', studentId), {
        programmeObjectives: currentStudentData.programmeObjectives,
        updatedAt: serverTimestamp()
    });
    window.viewStudentDetails(studentId);
};

window.removeObjective = async function(studentId, index) {
    if(!currentStudentData.programmeObjectives) return;
    currentStudentData.programmeObjectives.splice(index, 1);
    await updateDoc(doc(getFirestore(), 'progress', studentId), {
        programmeObjectives: currentStudentData.programmeObjectives,
        updatedAt: serverTimestamp()
    });
    window.viewStudentDetails(studentId);
};

window.saveProgressUpdate = async function(studentId) {
    const db = getFirestore();
    const perf = parseInt(document.getElementById('tPerf').value);
    const comp = parseInt(document.getElementById('tComp').value);
    const note = document.getElementById('tNote').value;
    
    try {
        const ref = doc(db, 'progress', studentId);
        const snap = await getDoc(ref);
        const history = snap.exists() && snap.data().sessionHistory ? snap.data().sessionHistory : [];
        
        if (note || history.length === 0) { // optionally always push or push if note
            history.push({
                date: serverTimestamp(),
                score: perf,
                tutorNote: note || ''
            });
        }
        
        await updateDoc(ref, {
            performanceScore: perf,
            completionPercentage: comp,
            sessionHistory: history,
            updatedAt: serverTimestamp()
        });
        alert('Progress saved');
    } catch(e) {
        alert('Error: ' + e.message);
    }
};

window.submitProgramme = async function(studentId) {
    const db = getFirestore();
    const title = document.getElementById('progTitle').value;
    const outline = document.getElementById('progOutline').value;
    
    try {
        await updateDoc(doc(db, 'progress', studentId), {
            programmeTitle: title,
            programmeOutline: outline,
            programmeApprovedByAdmin: false,
            programmeSubmittedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        alert('Programme submitted for admin review.');
    } catch(e) {
        alert('Error: ' + e.message);
    }
};
`;
fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/phase_a_tutor.js', newContent);
console.log("Updated tutor logic");
