const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

const oldHtml = `          <div class="form-group">
            <label>Select Subjects</label>
            <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.3rem;" id="subjectCheckboxes">
              <!-- Rendered by JS -->
            </div>
            <small>Select all subjects your child will study</small>
          </div>`;

const newHtml = `          <div class="form-group relative">
            <label>Select Subjects</label>
            <div id="subjectDropdownToggle" onclick="document.getElementById('subjectDropdownList').classList.toggle('hidden')" class="w-full bg-surface-container text-on-surface text-body-sm px-md py-sm rounded-lg border border-outline-variant transition-all cursor-pointer flex justify-between items-center mt-1">
               <span id="subjectDropdownLabel">Select subjects...</span>
               <span class="material-symbols-outlined">expand_more</span>
            </div>
            <div id="subjectDropdownList" class="hidden absolute top-full left-0 w-full bg-surface-container-highest shadow-md rounded-lg mt-1 z-50 border border-outline-variant max-h-60 overflow-y-auto">
              <div style="display:flex;flex-direction:column;padding:0.5rem;" id="subjectCheckboxes">
                <!-- Rendered by JS -->
              </div>
            </div>
            <small class="block mt-1">Select all subjects your child will study</small>
          </div>`;

html = html.replace(oldHtml, newHtml);

const oldJs = `function buildSubjectCheckboxes() {
  const container = document.getElementById('subjectCheckboxes');
  if (!container) return;
  container.innerHTML = SUBJECTS.map(s => \`
    <label style="display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .65rem;
      background:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.15);
      border-radius:5px;cursor:pointer;font-size:.73rem;transition:all .15s;"
      onmouseover="this.style.borderColor='rgba(56,189,248,0.4)'"
      onmouseout="this.style.borderColor='rgba(56,189,248,0.15)'">
      <input type="checkbox" name="subject" value="\${s}" style="accent-color:var(--blue);"> \${s}
    </label>\`).join('');
}`;

const newJs = `function buildSubjectCheckboxes() {
  const container = document.getElementById('subjectCheckboxes');
  if (!container) return;
  container.innerHTML = SUBJECTS.map(s => \`
    <label style="display:flex;align-items:center;gap:.5rem;padding:.5rem;
      border-radius:5px;cursor:pointer;transition:all .15s; color:var(--on-surface);"
      onmouseover="this.style.backgroundColor='var(--surface-container-high)'"
      onmouseout="this.style.backgroundColor='transparent'">
      <input type="checkbox" name="subject" value="\${s}" onchange="updateSubjectLabel()" style="accent-color:var(--primary); width:1.1rem; height:1.1rem;"> \${s}
    </label>\`).join('');
}
window.updateSubjectLabel = function() {
  const selected = Array.from(document.querySelectorAll('input[name="subject"]:checked')).map(cb => cb.value);
  const label = document.getElementById('subjectDropdownLabel');
  if(label) {
    if(selected.length === 0) label.textContent = 'Select subjects...';
    else if(selected.length === 1) label.textContent = selected[0];
    else if(selected.length <= 3) label.textContent = selected.join(', ');
    else label.textContent = selected.length + ' subjects selected';
  }
};
document.addEventListener('click', function(e) {
  const toggle = document.getElementById('subjectDropdownToggle');
  const list = document.getElementById('subjectDropdownList');
  if(toggle && list && !toggle.contains(e.target) && !list.contains(e.target)) {
    list.classList.add('hidden');
  }
});`;

html = html.replace(oldJs, newJs);

fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', html);
console.log("Fixed parent subjects dropdown");
