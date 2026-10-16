// Dịch tự động bằng Google Translate. F5 thì reset về tiếng Việt.
(() => {
  const K_BAR = "langbar";
  const nav = performance.getEntriesByType("navigation")[0];
  const delCookie = () => {
    const past = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "googtrans=; " + past;
    document.cookie = "googtrans=; " + past + "; domain=" + location.hostname;
  };

  if (nav && nav.type === "reload") {
    delCookie();
    try { sessionStorage.removeItem(K_BAR); } catch (e) {}
  }

  const cur = () => (/googtrans=\/vi\/en/.test(document.cookie) ? "en" : "vi");

  window.getLang = cur;
  window.setLang = (l) => {
    const sel = document.querySelector(".goog-te-combo");
    if (!sel) return;
    sel.value = l === "en" ? "en" : "vi";
    sel.dispatchEvent(new Event("change"));
    document.documentElement.lang = l;
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest(".langtoggle")) window.setLang(cur() === "vi" ? "en" : "vi");
  });

  const box = document.createElement("div");
  box.id = "google_translate_element";
  box.style.display = "none";
  document.body.appendChild(box);

  window.googleTranslateElementInit = () =>
    new google.translate.TranslateElement(
      { pageLanguage: "vi", includedLanguages: "vi,en", autoDisplay: false },
      "google_translate_element"
    );

  const s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(s);
})();