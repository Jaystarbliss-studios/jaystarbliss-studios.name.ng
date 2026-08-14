const fs = require('fs');

let content = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Add Sidebar Nav Item
content = content.replace(
  '<button class="nav-item" data-tab="students">\n      <span class="material-symbols-outlined">school</span>\n      Students\n    </button>',
  `<button class="nav-item" data-tab="students">\n      <span class="material-symbols-outlined">school</span>\n      Students\n    </button>\n    <button class="nav-item" data-tab="messages">\n      <span class="material-symbols-outlined">forum</span>\n      Messages\n    </button>`
);

// Add Tab Pane
const messagePane = `
  <!-- ════════════════════════════════════════════════════ -->
  <!-- MESSAGES PANE -->
  <!-- ════════════════════════════════════════════════════ -->
  <div class="pane" id="pane-messages">
    <div class="card">
      <div class="card-head">
        <h2><span class="material-symbols-outlined">forum</span> Messages</h2>
      </div>
      <div class="card-body">
        <div style="display:flex; gap: 1rem; min-height: 500px;">
          <div style="flex:1; border-right: 1px solid var(--border); padding-right: 1rem; overflow-y:auto;" id="adminConvList">
            <div class="empty-state">Loading...</div>
          </div>
          <div style="flex:2; display:flex; flex-direction:column;" id="adminMessageView">
            <div class="empty-state">Select a conversation</div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

content = content.replace(
  '<!-- ════════════════════════════════════════════════════ -->\n  <!-- SETTINGS PANE -->',
  messagePane + '\n  <!-- ════════════════════════════════════════════════════ -->\n  <!-- SETTINGS PANE -->'
);

const messageJS = `
let currentAdminConvId = null;

async function loadAdminConversations() {
  const list = document.getElementById('adminConvList');
  try {
    const snap = await getDocs(query(collection(db, 'conversations'), where('participants', 'array-contains', 'admin')));
    if (snap.empty) {
      list.innerHTML = '<div class="empty-state">No conversations.</div>';
      return;
    }
    
    let html = '';
    snap.forEach(doc => {
      const data = doc.data();
      html += \`
        <div style="padding: 1rem; border-bottom: 1px solid var(--border); cursor:pointer;" onclick="loadAdminMessages('\${doc.id}', '\${data.subject || 'User'}')">
          <div style="font-weight:600;">\${data.subject || 'User'}</div>
          <div style="font-size:0.8rem; color:var(--text-muted)">\${new Date(data.updatedAt?.toDate() || Date.now()).toLocaleDateString()}</div>
        </div>
      \`;
    });
    list.innerHTML = html;
  } catch(e) {
    list.innerHTML = '<div class="empty-state">Error loading conversations.</div>';
  }
}

window.loadAdminMessages = async function(convId, subject) {
  currentAdminConvId = convId;
  const view = document.getElementById('adminMessageView');
  view.innerHTML = '<div class="empty-state">Loading...</div>';
  
  try {
    const q = query(collection(db, 'messages'), where('conversationId', '==', convId), orderBy('createdAt', 'asc'));
    onSnapshot(q, (snap) => {
      if (currentAdminConvId !== convId) return;
      
      let html = \`<h4>\${subject}</h4><div style="flex:1; overflow-y:auto; padding:1rem; background:var(--bg); border-radius:8px; margin-bottom:1rem;">\`;
      
      snap.forEach(doc => {
        const msg = doc.data();
        const isAdmin = msg.senderId === 'admin';
        html += \`
          <div style="margin-bottom:0.5rem; text-align:\${isAdmin ? 'right' : 'left'}">
            <span style="display:inline-block; padding:0.5rem 1rem; border-radius:1rem; background:\${isAdmin ? 'var(--gold-display)' : 'var(--surface)'}; color:\${isAdmin ? '#fff' : 'var(--text)'}; box-shadow:0 1px 2px rgba(0,0,0,0.1); max-width:80%;">
              \${msg.text}
            </span>
          </div>
        \`;
      });
      
      html += \`</div>
      <div style="display:flex; gap:0.5rem;">
        <input type="text" id="adminMsgInput" class="input-base" style="flex:1;" placeholder="Reply...">
        <button class="btn btn-primary" onclick="sendAdminMessage('\${convId}')">Send</button>
      </div>\`;
      view.innerHTML = html;
    });
  } catch(e) {}
};

window.sendAdminMessage = async function(convId) {
  const input = document.getElementById('adminMsgInput');
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  try {
    await addDoc(collection(db, 'messages'), {
      conversationId: convId,
      senderId: 'admin',
      recipientId: 'parent', // this is simplified
      text: text,
      createdAt: serverTimestamp(),
      read: false
    });
    await updateDoc(doc(db, 'conversations', convId), { updatedAt: serverTimestamp() });
  } catch(e) {
    alert('Failed to send reply');
  }
};
`;

content = content.replace(
  'function switchPane(paneId) {',
  messageJS + '\nfunction switchPane(paneId) {'
);

// Call it on init
content = content.replace(
  'loadWaitlist();',
  'loadWaitlist();\n    loadAdminConversations();'
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', content, 'utf8');
