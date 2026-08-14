
    document.addEventListener('DOMContentLoaded', () => {
      const remember = localStorage.getItem('jdh_remember_me') === 'true';
      document.querySelectorAll('input[type="checkbox"][id="rememberMe"]').forEach(cb => {
        cb.checked = remember;
      });
    });
  