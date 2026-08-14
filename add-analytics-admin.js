const fs = require('fs');

let content = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

// Add Sidebar Nav Item
content = content.replace(
  '<div class="sidebar-label">Public / General</div>',
  `<div class="sidebar-label">Analytics</div>
    <button class="nav-item active" data-tab="analytics">
      <span class="material-symbols-outlined">analytics</span>
      Analytics
    </button>
  <div class="sidebar-divider"></div>
  <div class="sidebar-label">Public / General</div>`
);

// Make Resources not active by default
content = content.replace(
  '<button class="nav-item active" data-tab="resources">',
  '<button class="nav-item" data-tab="resources">'
);
content = content.replace(
  '<div class="pane active" id="pane-resources">',
  '<div class="pane" id="pane-resources">'
);

// Add Tab Pane
const analyticsPane = `
  <!-- ════════════════════════════════════════════════════ -->
  <!-- ANALYTICS PANE -->
  <!-- ════════════════════════════════════════════════════ -->
  <div class="pane active" id="pane-analytics">
    <div class="card">
      <div class="card-head">
        <h2><span class="material-symbols-outlined">analytics</span> Dashboard Overview</h2>
      </div>
      <div class="card-body">
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div style="background:var(--surface); padding:1.5rem; border-radius:8px; border:1px solid var(--border); text-align:center;">
            <div style="font-size:2rem; font-weight:700; color:var(--crimson);" id="statTotalStudents">-</div>
            <div style="font-size:0.9rem; color:var(--text-muted);">Total Students</div>
          </div>
          <div style="background:var(--surface); padding:1.5rem; border-radius:8px; border:1px solid var(--border); text-align:center;">
            <div style="font-size:2rem; font-weight:700; color:var(--gold-display);" id="statTotalTutors">-</div>
            <div style="font-size:0.9rem; color:var(--text-muted);">Active Tutors</div>
          </div>
          <div style="background:var(--surface); padding:1.5rem; border-radius:8px; border:1px solid var(--border); text-align:center;">
            <div style="font-size:2rem; font-weight:700; color:#10b981;" id="statTotalRevenue">-</div>
            <div style="font-size:0.9rem; color:var(--text-muted);">Total Revenue (₦)</div>
          </div>
          <div style="background:var(--surface); padding:1.5rem; border-radius:8px; border:1px solid var(--border); text-align:center;">
            <div style="font-size:2rem; font-weight:700; color:#3b82f6;" id="statPendingReqs">-</div>
            <div style="font-size:0.9rem; color:var(--text-muted);">Pending Requests</div>
          </div>
        </div>
        
        <div style="height: 300px; width: 100%;">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>
    </div>
  </div>
`;

content = content.replace(
  '<!-- ════════════════════════════════════════════════════ -->\n  <!-- PUBLIC RESOURCES PANE -->',
  analyticsPane + '\n  <!-- ════════════════════════════════════════════════════ -->\n  <!-- PUBLIC RESOURCES PANE -->'
);

// Add Chart.js to head
content = content.replace(
  '</head>',
  '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n</head>'
);

const analyticsJS = `
async function loadAnalytics() {
  try {
    // Basic Counts
    getDocs(collection(db, 'students')).then(snap => document.getElementById('statTotalStudents').innerText = snap.size);
    getDocs(collection(db, 'tutors')).then(snap => document.getElementById('statTotalTutors').innerText = snap.size);
    getDocs(query(collection(db, 'enrollment_requests'), where('status', '==', 'pending'))).then(snap => document.getElementById('statPendingReqs').innerText = snap.size);
    
    // Revenue Calculation
    getDocs(query(collection(db, 'payments'), where('status', '==', 'paid'))).then(snap => {
      let total = 0;
      let monthlyData = [0,0,0,0,0,0,0,0,0,0,0,0];
      snap.forEach(doc => {
        const d = doc.data();
        total += (d.amount || 0);
        
        // Populate chart data (simplified: assumes current year)
        if (d.createdAt) {
          const date = d.createdAt.toDate();
          monthlyData[date.getMonth()] += (d.amount || 0);
        }
      });
      document.getElementById('statTotalRevenue').innerText = total.toLocaleString();
      
      const ctx = document.getElementById('revenueChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Revenue (₦)',
            data: monthlyData,
            borderColor: '#bb86fc',
            backgroundColor: 'rgba(187, 134, 252, 0.2)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    });
  } catch(e) {}
}
`;

content = content.replace(
  'function switchPane(paneId) {',
  analyticsJS + '\nfunction switchPane(paneId) {'
);

content = content.replace(
  'loadWaitlist();',
  'loadWaitlist();\n    loadAnalytics();'
);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', content, 'utf8');
