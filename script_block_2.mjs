
  window.toggleTheme = function() {
    var html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('jdh-theme', html.dataset.theme);
  };
  function togglePw(id) {
    var inp = document.getElementById(id);
    if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
  }
  document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    var saved = localStorage.getItem('jdh-theme');
    if (saved) document.documentElement.dataset.theme = saved;
    document.getElementById('themeToggleBtn').addEventListener('click', window.toggleTheme);
    document.querySelectorAll('.role-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.role-tab').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.pane').forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById(btn.dataset.pane).classList.add('active');
      });
    });
    document.querySelectorAll('.pw-eye').forEach(function(btn) {
      btn.addEventListener('click', function() { togglePw(btn.dataset.target); });
    });
    document.getElementById('showRegister').addEventListener('click', function() {
      document.getElementById('student-login-view').style.display    = 'none';
      document.getElementById('student-register-view').style.display = 'block';
    });
    document.getElementById('showLogin').addEventListener('click', function() {
      document.getElementById('student-register-view').style.display = 'none';
      document.getElementById('student-login-view').style.display    = 'block';
    });
    document.getElementById('showStaffReg').addEventListener('click', function() {
      document.getElementById('staff-login-view').style.display    = 'none';
      document.getElementById('staff-register-view').style.display = 'block';
    });
    document.getElementById('showStaffLogin').addEventListener('click', function() {
      document.getElementById('staff-register-view').style.display = 'none';
      document.getElementById('staff-login-view').style.display    = 'block';
    });
  });
