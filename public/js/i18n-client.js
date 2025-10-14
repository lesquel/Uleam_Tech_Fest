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
      })
      .catch((err) => console.error("i18n load failed", err));
  }

  function initSelector() {
    const sel = document.querySelector("#lang-select");
    if (!sel) return;
    sel.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  }

  // Initialize on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    initSelector();

    const saved = (function () {
      try {
        return localStorage.getItem(LANG_KEY);
      } catch (e) {
        return null;
      }
    })();
    const lang = saved || DEFAULT_LANG;
    setLanguage(lang).then(() => {
      const sel = document.querySelector("#lang-select");
      if (sel) sel.value = lang;
    });
  });
})();
