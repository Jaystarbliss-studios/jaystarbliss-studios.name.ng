const fs = require('fs');
let html = fs.readFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', 'utf8');

const regex = /function buildPlanCards\(\) \{[\s\S]*?window\.selectPlan = function\(key, amount\) \{[\s\S]*?\};\n/m;

const newJs = `function buildPlanCards() {
  const grid = document.getElementById('plansGrid');
  if (!grid) return;
  // Apply a flex column (list) layout to the container
  grid.className = 'flex flex-col gap-sm mt-sm';
  grid.innerHTML = PLANS.map(p => \`
    <div class="plan-card flex items-center justify-between p-md border border-outline-variant rounded-lg cursor-pointer transition-all hover:bg-surface-container-high" onclick="selectPlan('\${p.key}',\${p.amount})" id="plan_\${p.key}">
      <div class="flex items-center gap-md">
        <span class="material-symbols-outlined text-outline-variant plan-check transition-colors">radio_button_unchecked</span>
        <div>
          <div class="font-label-lg text-on-surface">\${p.name}</div>
          <div class="text-body-sm text-on-surface-variant">\${p.sessions} &bull; <span class="uppercase text-[0.65rem]">\${p.note}</span></div>
        </div>
      </div>
      <div class="font-title-md text-on-surface font-semibold">₦\${p.amount.toLocaleString()}<span class="text-body-sm font-normal text-on-surface-variant">/mo</span></div>
    </div>\`).join('');
}

window.selectPlan = function(key, amount) {
  document.querySelectorAll('.plan-card').forEach(c => {
    c.classList.remove('bg-primary-container', 'border-primary');
    c.classList.add('border-outline-variant');
    const icon = c.querySelector('.plan-check');
    if (icon) {
      icon.textContent = 'radio_button_unchecked';
      icon.classList.remove('text-primary');
      icon.classList.add('text-outline-variant');
    }
  });
  const selected = document.getElementById('plan_' + key);
  if (selected) {
    selected.classList.remove('border-outline-variant');
    selected.classList.add('bg-primary-container', 'border-primary');
    const icon = selected.querySelector('.plan-check');
    if (icon) {
      icon.textContent = 'radio_button_checked';
      icon.classList.remove('text-outline-variant');
      icon.classList.add('text-primary');
    }
  }
  document.getElementById('selectedPlan').value  = key;
  document.getElementById('selectedAmount').value = amount;
};
`;

if(regex.test(html)) {
  html = html.replace(regex, newJs);
  fs.writeFileSync('jaystarbliss-studios.name.ng/htdocs/pages/dashboard/parent-portal.html', html);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find regex match!");
}
