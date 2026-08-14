const fs = require('fs');

let content = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

// Add Sidebar Nav Item
content = content.replace(
  '<div class="sidebar-divider"></div>\n  <div class="sidebar-section">\n    <div class="sidebar-label">Actions</div>',
  `<button class="nav-item" data-tab="messages">\n      <span class="material-symbols-outlined">forum</span> Messages\n    </button>\n  <div class="sidebar-divider"></div>\n  <div class="sidebar-section">\n    <div class="sidebar-label">Actions</div>`
);

// Add Tab Button
content = content.replace(
  '<button class="tab-btn" data-target="activity">Activity</button>',
  `<button class="tab-btn" data-target="activity">Activity</button>\n    <button class="tab-btn" data-target="messages">Messages</button>`
);

// Add Tab Pane
const messagePane = `
  <!-- ══ MESSAGES ══ -->
  <div class="tab-pane" id="tab-messages">
    <div class="panel">
      <div class="panel-head">
        <div class="panel-title">
          <span class="material-symbols-outlined">forum</span> Messages
        </div>
      </div>
      <div class="panel-body">
        <div style="display:flex; gap: 1rem;">
          <div style="flex:1; border-right: 1px solid #ddd; padding-right: 1rem;" id="conversationList">
            <div class="empty">Loading conversations...</div>
          </div>
          <div style="flex:2; display:flex; flex-direction:column;" id="messageView">
            <div class="empty">Select a conversation</div>
          </div>
        </div>
        <button class="btn btn-gold btn-sm" onclick="startNewConversation()" style="margin-top: 1rem;">New Message to Admin</button>
      </div>
    </div>
  </div>
`;

content = content.replace(
  '<!-- ══ ENROLLMENT ══ -->',
  messagePane + '\n  <!-- ══ ENROLLMENT ══ -->'
);

// Add JS
const messageJS = `
// ════════════════════════════════════════════════════
// MESSAGING
// ════════════════════════════════════════════════════
let currentConvId = null;

async function loadConversations() {
  const list = document.getElementById('conversationList');
  try {
    const snap = await getDocs(query(collection(db, 'conversations'), where('participants', 'array-contains', parentId)));
    if (snap.empty) {
      list.innerHTML = '<div class="empty">No conversations found.</div>';
      return;
    }
    
    list.innerHTML = '';
    snap.forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      div.className = 'activity-item';
      div.style.cursor = 'pointer';
      div.onclick = () => loadMessages(doc.id, data.subject || 'Admin');
      div.innerHTML = \`
        <div class="activity-text">
          <div class="activity-title">\${data.subject || 'Conversation'}</div>
          <div class="activity-time">\${new Date(data.updatedAt?.toDate() || Date.now()).toLocaleDateString()}</div>
        </div>
      \`;
      list.appendChild(div);
    });
  } catch(e) {
    list.innerHTML = '<div class="empty">Error loading conversations.</div>';
  }
}

async function loadMessages(convId, subject) {
  currentConvId = convId;
  const view = document.getElementById('messageView');
  view.innerHTML = '<div class="empty">Loading...</div>';
  
  try {
    const q = query(collection(db, 'messages'), where('conversationId', '==', convId), orderBy('createdAt', 'asc'));
    onSnapshot(q, (snap) => {
      if (currentConvId !== convId) return; // Ignore if switched
      
      let html = \`<h4>\${subject}</h4><div style="flex:1; overflow-y:auto; max-height:400px; padding:1rem; background:#f9fafb; border-radius:4px; margin-bottom:1rem;">\`;
      
      snap.forEach(doc => {
        const msg = doc.data();
        const isMe = msg.senderId === parentId;
        html += \`
          <div style="margin-bottom:0.5rem; text-align:\${isMe ? 'right' : 'left'}">
            <span style="display:inline-block; padding:0.5rem 1rem; border-radius:1rem; background:\${isMe ? '#bb86fc' : '#e5e7eb'}; color:\${isMe ? '#000' : '#000'}; max-width:80%;">
              \${msg.text}
            </span>
          </div>
        \`;
      });
      
      html += \`</div>
      <div style="display:flex; gap:0.5rem;">
        <input type="text" id="msgInput" style="flex:1; padding:0.5rem;" placeholder="Type your message...">
        <button class="btn btn-primary" onclick="sendMessage('\${convId}')">Send</button>
      </div>\`;
      view.innerHTML = html;
    });
  } catch(e) {}
}

window.startNewConversation = async function() {
  const subject = prompt('Enter a subject for your message to Admin:');
  if (!subject) return;
  
  try {
    const ref = await addDoc(collection(db, 'conversations'), {
      participants: [parentId, 'admin'], // 'admin' is a pseudo-id or actual admin id
      subject: subject,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    loadConversations();
    loadMessages(ref.id, subject);
  } catch(e) {
    alert('Failed to start conversation: ' + e.message);
  }
};

window.sendMessage = async function(convId) {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  try {
    await addDoc(collection(db, 'messages'), {
      conversationId: convId,
      senderId: parentId,
      recipientId: 'admin',
      text: text,
      createdAt: serverTimestamp(),
      read: false
    });
    
    await updateDoc(doc(db, 'conversations', convId), {
      updatedAt: serverTimestamp()
    });
  } catch(e) {
    alert('Message failed: ' + e.message);
  }
};
`;

// Insert JS before _setupTabs() or after DOMContentLoaded
content = content.replace(
  'function switchTab(tabId) {',
  messageJS + '\nfunction switchTab(tabId) {'
);
content = content.replace(
  'loadActivity();',
  'loadActivity();\n    loadConversations();'
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', content, 'utf8');
