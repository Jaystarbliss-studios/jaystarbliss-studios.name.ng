const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', 'utf8');

const paymentsBtnMatch = /<button class="nav-item " data-tab="payments" onclick="window.switchTab\('payments'\)">[\s\S]*?<\/button>/;

if(html.match(paymentsBtnMatch)) {
    html = html.replace(paymentsBtnMatch, '<div class="sidebar-label">Finance & Billing</div>\n$&');
    fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/admin-dashboard.html', html);
    console.log("Organized sidebar 2");
}
