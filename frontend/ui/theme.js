const THEME_STORAGE_KEY = 'skillmatch_theme';

function applyTheme(theme) {
 const isDark = theme === 'dark';
 const toggle = document.getElementById('themeToggle');
 document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

 if (toggle) {
 toggle.setAttribute('aria-pressed', String(isDark));
 toggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
 toggle.innerHTML = `<span aria-hidden="true">${isDark ? '☀' : '◐'}</span> Tema ${isDark ? 'claro' : 'escuro'}`;
 }
}

/** Restaura e alterna a preferência visual persistida. */
export function setupThemePreference() {
 const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
 applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

 const toggle = document.getElementById('themeToggle');
 if (!toggle) return;

 toggle.addEventListener('click', function() {
 const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
 localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
 applyTheme(nextTheme);
 });
}
