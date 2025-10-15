(() => {
  const KEY = "uf_theme";
  const DEFAULT = "dark";

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "light") root.classList.add("light-theme");
    else root.classList.remove("light-theme");
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
  }

  function updateButton(theme) {
    const btn = document.querySelector("#theme-toggle");
    if (!btn) return;
    btn.textContent = theme === "light" ? "🌞" : "🌙";
    btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }

  function delegatedClick(e) {
    const t = e.target;
    if (!t) return;
    if (t.id === "theme-toggle") {
      const current = document.documentElement.classList.contains("light-theme")
        ? "light"
        : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      updateButton(next);
    }
  }

  function init() {
    document.addEventListener("click", delegatedClick);
    const saved = (function () {
      try {
        return localStorage.getItem(KEY);
      } catch (e) {
        return null;
      }
    })();
    const theme = saved || DEFAULT;
    applyTheme(theme);
    updateButton(theme);
  }

  function handleNavigation() {
    const saved = (function () {
      try {
        return localStorage.getItem(KEY);
      } catch (e) {
        return null;
      }
    })();
    const theme = saved || DEFAULT;
    applyTheme(theme);
    updateButton(theme);
  }

  // Initialize on DOM ready
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();

  // Handle Astro View Transitions
  document.addEventListener("astro:page-load", handleNavigation);
  
  // Handle browser navigation
  window.addEventListener("popstate", handleNavigation);
})();
