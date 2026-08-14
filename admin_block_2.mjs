
  // Theme
  (function() {
    var saved = localStorage.getItem('jdh-theme');
    if (saved) document.documentElement.dataset.theme = saved;
  })();

  function toggleTheme() {
    var html = document.documentElement;
    var newTheme = html.dataset.theme === 'dark' || html.classList.contains('dark') ? 'light' : 'dark';
    if (window.jdhSaveTheme) {
      window.jdhSaveTheme(newTheme);
    } else {
      if (newTheme === 'dark') { html.classList.add('dark'); html.dataset.theme = 'dark'; }
      else { html.classList.remove('dark'); html.dataset.theme = 'light'; }
      localStorage.setItem('jdh-theme', newTheme);
    }
  }

  function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    var tabEl = document.getElementById(tabName);
    if (tabEl) tabEl.classList.add('active');
    var navEl = document.querySelector('[data-tab="' + tabName + '"]');
    if (navEl) navEl.classList.add('active');
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    document.querySelectorAll('.nav-item[data-tab]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        switchTab(this.dataset.tab);
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('main').scrollTo(0, 0);
        var icon = document.getElementById('hamburger').querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });

    var hamburger = document.getElementById('hamburger');
    var sidebar   = document.getElementById('sidebar');
    var overlay   = document.getElementById('overlay');

    hamburger.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
      var icon = hamburger.querySelector('.material-symbols-outlined');
      icon.textContent = sidebar.classList.contains('open') ? 'close' : 'menu';
    });

    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      hamburger.querySelector('.material-symbols-outlined').textContent = 'menu';
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
      if (window._doLogout) window._doLogout();
    });
  });
