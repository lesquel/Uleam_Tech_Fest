(function () {
  // Detectar idioma del navegador automáticamente
  const browserLang = navigator.language.slice(0, 2); // 'en', 'es', etc.
  const SUPPORTED_LANGS = ['es', 'en'];
  const DEFAULT_LANG = SUPPORTED_LANGS.includes(browserLang) ? browserLang : "es";
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

  // Delegated handler: listen for changes to any #lang-select on the document.
  function delegatedChangeHandler(e) {
    const target = e.target;
    if (!target) return;
    // if the change came from the select we care about
    if (target.id === "lang-select") {
      setLanguage(target.value);
    }
  }

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", initializeI18n);
  
  // Handle Astro View Transitions
  document.addEventListener("astro:page-load", initializeI18n);

  function initializeI18n() {
    document.addEventListener("change", delegatedChangeHandler);

    const saved = (function () {
      try {
        return localStorage.getItem(LANG_KEY);
      } catch (e) {
        return null;
      }
    })();
    const lang = saved || DEFAULT_LANG;
    setLanguage(lang);
  }

  // Also re-apply language after navigation events; ClientRouter uses pushState
  window.addEventListener("popstate", () => {
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
})();
