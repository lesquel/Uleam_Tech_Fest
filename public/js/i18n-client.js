(function () {
  const DEFAULT_LANG = "en";
  const LANG_KEY = "uf_lang";

  async function loadJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Failed to load " + path);
    return res.json();
  }

  function applyTranslations(trans) {
    document.querySelectorAll("[data-i18n-key]").forEach((el) => {
      const key = el.getAttribute("data-i18n-key");
      if (!key) return;
      const text = trans[key];
      if (text === undefined) return;
      // Preserve HTML when element has data-i18n-html
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Also update document title if key exists
    if (trans["meta.title"]) {
      document.title = trans["meta.title"];
    }
  }

  function setLanguage(lang) {
    const path = `/i18n/${lang}.json`;
    return loadJson(path)
      .then((trans) => {
        applyTranslations(trans);
        try {
          document.documentElement.lang = lang;
        } catch (e) {}
        try {
          localStorage.setItem(LANG_KEY, lang);
        } catch (e) {}
        // also update any selectors on the page
        const sel = document.querySelector("#lang-select");
        if (sel) sel.value = lang;
      })
      .catch((err) => console.error("i18n load failed", err));
  }

  // idempotent binder for the language selector
  function bindSelector() {
    const sel = document.querySelector("#lang-select");
    if (!sel) return;
    // replace onchange handler to avoid duplicates
    sel.onchange = function (e) {
      setLanguage(e.target.value);
    };
  }

  // Watch for the selector being re-inserted by ClientRouter navigation
  let observer;
  function watchForSelector() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          // quick re-bind whenever DOM changes (cheap if debounced)
          bindSelector();
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    bindSelector();
    watchForSelector();

    const saved = (function () {
      try {
        return localStorage.getItem(LANG_KEY);
      } catch (e) {
        return null;
      }
    })();
    const lang = saved || DEFAULT_LANG;
    setLanguage(lang);
  });

  // For safety, also bind on page:load-like events used by some routers
  window.addEventListener("popstate", () => {
    // re-apply language and re-bind controls after navigation
    const saved = (function () {
      try {
        return localStorage.getItem(LANG_KEY);
      } catch (e) {
        return null;
      }
    })();
    const lang = saved || DEFAULT_LANG;
    setLanguage(lang);
    bindSelector();
  });
})();
