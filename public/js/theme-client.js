(function () {
  const KEY = "uf_theme";
  const DEFAULT = "dark"; // default is dark

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light-theme");
    } else {
      root.classList.remove("light-theme");
    }
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
  }

  function bindToggle() {
    const btn = document.querySelector("#theme-toggle");
    if (!btn) return;
    // idempotent binding
    btn.onclick = function () {
      const current = document.documentElement.classList.contains("light-theme")
        ? "light"
        : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      updateButton(next);
    };
  }

  function updateButton(theme) {
    const btn = document.querySelector("#theme-toggle");
    if (!btn) return;
    btn.textContent = theme === "light" ? "🌞" : "🌙";
    btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }

  let observer;
  function watchForToggle() {
    if (observer) return;
    observer = new MutationObserver(() => {
      bindToggle();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
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
    bindToggle();
    watchForToggle();
  });

  window.addEventListener("popstate", () => {
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
    bindToggle();
  });
})();
