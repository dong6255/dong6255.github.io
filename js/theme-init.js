// Run before first paint. Only an explicit saved choice overrides the light default.
(() => {
  let theme = 'light';
  try { if (localStorage.getItem('april-theme') === 'dark') theme = 'dark'; } catch {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.getElementById('theme-light-css').media = theme === 'light' ? 'all' : 'not all';
  document.getElementById('theme-dark-css').media = theme === 'dark' ? 'all' : 'not all';
})();
