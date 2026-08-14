const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const panes = document.querySelectorAll('.tab-pane');
panes.forEach(pane => {
  const name = pane.id.replace('tab-', '').toUpperCase();
  console.log(`\n\n### 🔹 ${name} SECTION ###`);
  
  // Look for panels / widgets
  pane.querySelectorAll('.panel, .card, .widget, [class*="card"]').forEach((panel, i) => {
    const titleEl = panel.querySelector('.panel-title, h1, h2, h3, h4');
    const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : 'Unnamed Section/Widget';
    
    // Ignore nested things if they get caught too broadly, but for now log everything
    console.log(`\n  --- ${title} ---`);
    
    // Get text
    panel.querySelectorAll('p, label, th, .empty, .stat-value, .stat-label, .req-empty').forEach(txt => {
      let val = txt.textContent.replace(/\s+/g, ' ').trim();
      if(val && !val.includes('{') && !val.includes('}')) console.log(`    Text/Label: ${val}`);
    });
    
    // Get inputs
    panel.querySelectorAll('input, select, textarea').forEach(inp => {
       const type = inp.type || inp.tagName.toLowerCase();
       const placeholder = inp.placeholder || '';
       console.log(`    Input Field: ${type} ${placeholder ? `(Placeholder: ${placeholder})` : ''} - ID: ${inp.id}`);
    });

    // Get buttons
    panel.querySelectorAll('button, .btn, a.btn, [role="button"]').forEach(btn => {
       const btxt = btn.textContent.replace(/\s+/g, ' ').trim() || btn.title || 'Icon/Action';
       console.log(`    Button: [ ${btxt} ]`);
    });
  });
});
