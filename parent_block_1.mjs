
(function(){
  const saved = localStorage.getItem('jdh-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

window.toggleTheme = function() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark' || html.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  
  if (window.jdhSaveTheme) {
    window.jdhSaveTheme(newTheme);
  } else {
    if (newTheme === 'dark') { html.classList.add('dark'); html.setAttribute('data-theme', 'dark'); }
    else { html.classList.remove('dark'); html.setAttribute('data-theme', 'light'); }
    localStorage.setItem('jdh-theme', newTheme);
  }
};

window.closeSidebar = function() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobOverlay').classList.remove('open');
  const icon = document.querySelector('#hamburgerBtn .material-symbols-outlined');
  if (icon) icon.textContent = 'menu';
};

window.switchTab = function(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.target === name));
  document.querySelectorAll('.nav-item[data-tab]').forEach(n => n.classList.toggle('active', n.dataset.tab === name));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
  document.getElementById('breadcrumbActive').textContent = name.charAt(0).toUpperCase() + name.slice(1);
  if (window.innerWidth <= 1024) window.closeSidebar();
  document.querySelector('.main').scrollTo(0, 0);
};

window.doLogout = function() {
  sessionStorage.clear();
  window.location.href = '../auth/login.html';
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => window.switchTab(b.dataset.target)));
  document.querySelectorAll('.nav-item[data-tab]').forEach(n => n.addEventListener('click', () => window.switchTab(n.dataset.tab)));
  document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => window.switchTab(b.dataset.goto)));

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  hamburgerBtn.addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('mobOverlay');
    sb.classList.toggle('open');
    ov.classList.toggle('open');
    hamburgerBtn.querySelector('.material-symbols-outlined').textContent =
      sb.classList.contains('open') ? 'close' : 'menu';
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeSidebar(); });

  // Responsive overview grid
  const adjustGrid = () => {
    const og = document.getElementById('overviewGrid');
    if (og) og.style.gridTemplateColumns = window.innerWidth <= 768 ? '1fr' : '1fr 1fr';
  };
  adjustGrid();
  window.addEventListener('resize', adjustGrid);
});
