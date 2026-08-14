const fs = require('fs');
let code = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', 'utf8');

const notificationFunc = `
export async function createNotification(uid, type, title, body, linkTo = null, metadata = {}) {
  try {
    const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const db = getFirestore();
    await addDoc(collection(db, 'notifications', uid, 'items'), {
      type, title, body, linkTo, metadata,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch(e) {
    console.error("Failed to create notification:", e);
  }
}

export function setupNotifications(uid, bellIconId, badgeId, panelId, contentId) {
  import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ getFirestore, collection, query, where, onSnapshot, orderBy, writeBatch, doc }) => {
    const db = getFirestore();
    const q = query(collection(db, 'notifications', uid, 'items'), where('read', '==', false));
    let unreadDocs = [];
    onSnapshot(q, (snap) => {
      unreadDocs = snap.docs;
      const count = snap.size;
      const badge = document.getElementById(badgeId);
      if(badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      }
    });

    const bell = document.getElementById(bellIconId);
    const panel = document.getElementById(panelId);
    const content = document.getElementById(contentId);
    
    if(bell && panel) {
      bell.addEventListener('click', () => {
        panel.classList.toggle('active'); // slide out
        if(panel.classList.contains('active') && unreadDocs.length > 0) {
          // Render docs
          let html = '';
          unreadDocs.sort((a,b) => (b.data().createdAt?.toMillis() || 0) - (a.data().createdAt?.toMillis() || 0)).forEach(d => {
            const data = d.data();
            html += \`<div style="padding: 10px; border-bottom: 1px solid #eee;">
               <strong>\${data.title}</strong><br>\${data.body}
            </div>\`;
          });
          content.innerHTML = html;
          
          // Mark all as read
          const batch = writeBatch(db);
          unreadDocs.forEach(d => {
            batch.update(d.ref, { read: true });
          });
          batch.commit();
        } else if (panel.classList.contains('active')) {
          content.innerHTML = '<div style="padding:10px;">No unread notifications</div>';
        }
      });
    }
  });
}
`;

if(!code.includes('createNotification(')) {
    code += '\n' + notificationFunc;
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/assets/js/jdh-firebase-modules.js', code);
    console.log("Added notification functions to modules.");
}
