// Popup iPhone Duo: nằm đè lên trang danh sách, không chuyển sang detail.html.
// Gọi: openDuoPopup(product)  (product là phần tử trong window.PRODUCTS)
(() => {
  let box = null;
  let lastFocus = null;
  let pushed = false; // true nếu popup này đã thêm một mục vào lịch sử trình duyệt

  function close(fromPop) {
    if (!box) return;
    box.classList.remove("show");
    document.documentElement.classList.remove("lock");
    document.removeEventListener("keydown", onKey);
    const el = box;
    box = null;
    setTimeout(() => el.remove(), 250);
    if (lastFocus) lastFocus.focus();

    // trả link về lại trang danh sách
    if (!fromPop) {
      if (pushed) history.back();
      else if (location.search) history.replaceState(null, "", location.pathname);
    }
    pushed = false;
  }

  function onKey(e) {
    if (e.key === "Escape") close();
  }

  // giống duoHero ở detail.js: truyền ảnh qua query string, đường dẫn tuyệt đối theo gốc trang cha
  function duoUrl(d) {
    const url = new URL(d.src || "assets/duo/index.html", document.baseURI);
    if (d.outer) url.searchParams.set("outer", new URL(d.outer, document.baseURI).href);
    if (d.inner) url.searchParams.set("inner", new URL(d.inner, document.baseURI).href);
    if (d.portrait) url.searchParams.set("portrait", new URL(d.portrait, document.baseURI).href);
    if (d.seated) url.searchParams.set("seated", new URL(d.seated, document.baseURI).href);
    if (d.standing) url.searchParams.set("standing", new URL(d.standing, document.baseURI).href);
    if (d.durability) url.searchParams.set("durability", new URL(d.durability, document.baseURI).href);
    if (d.figma) url.searchParams.set("figma", d.figma);
    if (d.texts) url.searchParams.set("texts", JSON.stringify(d.texts));
    return url.href;
  }

  window.openDuoPopup = function (p, opts) {
    if (box) close();
    const d = (p.detail && p.detail.duo) || {};
    lastFocus = document.activeElement;

    box = document.createElement("div");
    box.className = "duo-pop";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", p.name || "iPhone Duo");
    box.innerHTML = `
      <div class="duo-pop-card">
        <button class="duo-pop-x" type="button" aria-label="Đóng">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
        <iframe class="duo-pop-frame" src="${duoUrl(d)}" title="${p.name || "iPhone Duo"}" allow="fullscreen"></iframe>
      </div>`;
    document.body.appendChild(box);
    document.documentElement.classList.add("lock");

    // đổi link thành index.html?p=<tên thương hiệu> (trừ khi đang mở từ link có sẵn)
    if (!(opts && opts.noPush) && window.projectSlug) {
      history.pushState({ duo: true }, "", location.pathname + "?p=" + encodeURIComponent(window.projectSlug(p)));
      pushed = true;
    }

    const frame = box.querySelector("iframe");
    // gửi ảnh màn ngoài / màn trong cho Duo sau khi iframe nạp xong
    frame.addEventListener("load", () => {
      // iframe nằm ở assets/duo/, nên đổi sang URL tuyệt đối theo gốc của trang cha
      const abs = (u) => (u ? new URL(u, document.baseURI).href : u);
      frame.contentWindow.postMessage(
        { type: "duo:content", outer: abs(d.outer), inner: abs(d.inner), portrait: abs(d.portrait), name: p.name },
        "*",
      );
    });

    box.addEventListener("click", (e) => {
      if (e.target === box || e.target.closest(".duo-pop-x")) close();
    });
    document.addEventListener("keydown", onKey);

    requestAnimationFrame(() => box.classList.add("show"));
    box.querySelector(".duo-pop-x").focus();
  };

  // bấm Back của trình duyệt thì đóng popup
  window.addEventListener("popstate", () => {
    pushed = false;
    if (box) close(true);
  });

  // mở thẳng link index.html?p=<slug> của project dạng popup thì tự bật popup
  document.addEventListener("products:ready", () => {
    const key = new URLSearchParams(location.search).get("p");
    if (!key || !window.projectSlug) return;
    const p = (window.PRODUCTS || []).find((x) => x.detail && x.detail.popup && window.projectSlug(x) === key);
    if (p) window.openDuoPopup(p, { noPush: true });
  });
})();