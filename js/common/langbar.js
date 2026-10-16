// Banner chọn ngôn ngữ ở đầu trang (kiểu Apple).
(() => {
  const K_BAR = "langbar";
  try { if (sessionStorage.getItem(K_BAR)) return; } catch (e) {}

  const TXT = {
    vi: { msg: "Chọn ngôn ngữ để xem nội dung phù hợp với bạn.", go: "Tiếp Tục", close: "Đóng" },
    en: { msg: "Choose a language to see content that suits you.", go: "Continue", close: "Close" },
  };
  const LANGS = [["vi", "Việt Nam"], ["en", "English"]];

  const cur = window.getLang ? window.getLang() : "vi";
  const bar = document.createElement("div");
  bar.className = "langbar";
  bar.innerHTML = `
    <div class="langbar-clip">
      <div class="langbar-in">
        <p class="langbar-msg"></p>
        <div class="langbar-sel">
          <select aria-label="Language">
            ${LANGS.map(([v, n]) => `<option value="${v}"${v === cur ? " selected" : ""}>${n}</option>`).join("")}
          </select>
        </div>
        <button type="button" class="langbar-go"></button>
        <button type="button" class="langbar-x" aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>`;

  const sel = bar.querySelector("select");
  const msg = bar.querySelector(".langbar-msg");
  const go = bar.querySelector(".langbar-go");
  const x = bar.querySelector(".langbar-x");

  const paint = () => {
    const t = TXT[sel.value] || TXT.vi;
    msg.textContent = t.msg;
    go.textContent = t.go;
    x.setAttribute("aria-label", t.close);
  };
  paint();
  sel.addEventListener("change", paint);

  const close = () => {
    try { sessionStorage.setItem(K_BAR, "1"); } catch (e) {}
    bar.classList.add("hide");
    setTimeout(() => bar.remove(), 600);
  };

  go.addEventListener("click", () => {
    if (window.setLang) window.setLang(sel.value);
    close();
  });
  x.addEventListener("click", close);

  document.body.prepend(bar);
})();