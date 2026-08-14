const fs = require('fs');
const content = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

const tabs = ['overview', 'children', 'payments', 'enroll', 'activity', 'messages'];
console.log("== PARENT PORTAL TABS & CONTENT ==");

tabs.forEach(tab => {
  console.log(`\n--- TAB: ${tab.toUpperCase()} ---`);
  // Try to find the section or pane for this tab
  // Sometimes it's <div id="pane-tab" or data-pane="tab" or <section id="tab"
  const regex = new RegExp(`<([^>]+(?:id|data-tab|data-pane)=["']${tab}["'][^>]*)>([\\s\\S]*?)(?:<\\/div>|<\\/section>)`, 'g');
  // Since HTML parsing with regex is bad, let's just use simple match
});
