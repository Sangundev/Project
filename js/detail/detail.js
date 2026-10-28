(function () {
  const root = document.getElementById("detail");
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const imgTag = (src, alt) => (src ? `<img src="${esc(src)}" alt="${esc(alt || "")}" loading="lazy">` : "");

  // ---- tìm sản phẩm theo ?p=  (khớp tên file, vd: mobbile-3) ----
  const q = new URLSearchParams(location.search);
  const key = q.get("p") || q.get("id");
  const findProduct = () =>
    (window.PRODUCTS || []).find((p) => p.file === key || String(p.id) === key || p.name === key);

  // ---- ảnh đại diện cho "More Projects" ----
  const thumb = (p) => (Array.isArray(p.imgs) ? p.imgs[0] : "");

  // ---- HTML khối "More Projects" (dùng ở render và khi nạp nền xong) ----
  const moreHTML = (p) =>
    (window.PRODUCTS || [])
      .filter((x) => x !== p && thumb(x))
      .slice(0, 4)
      .map((x) => `<a href="detail.html?p=${encodeURIComponent(x.file)}">${imgTag(thumb(x), x.name)}<span>${esc(x.name)}</span></a>`)
      .join("");

  // ---- các loại khối nội dung ----
  const BLOCKS = {
    cards: (b) =>
      `<div class="cards">${(b.items || [])
        .map((i) => `<div><small>${esc(i.n)}</small><strong>${esc(i.t)}</strong></div>`)
        .join("")}</div>`,
    callout: (b) => `<div class="callout">${esc(b.text)}</div>`,
    text: (b) => `<p class="btext">${esc(b.text)}</p>`,
    flow: (b) =>
      `<div class="flow">${(b.items || []).map((s) => `<span>${esc(s)}</span>`).join("")}</div>`,
    chips: (b) =>
      `<div class="chips">${(b.items || [])
        .map((c) => `<span>${c.k ? `<small>${esc(c.k)}</small>` : ""}${esc(c.v ?? c)}</span>`)
        .join("")}</div>`,
    image: (b) => `<figure class="fig">${imgTag(b.src, b.alt)}</figure>`,
    images: (b) => `<div class="figs">${(b.items || []).map((s) => imgTag(s)).join("")}</div>`,
    module: (b) =>
      `<div class="module">
        <small>${esc(b.tag)}</small>
        <h3>${esc(b.title)}</h3>
        <p>${esc(b.text)}</p>
        ${b.chips ? `<div class="chips">${b.chips.map((c) => `<span>${c.k ? `<small>${esc(c.k)}</small>` : ""}${esc(c.v ?? c)}</span>`).join("")}</div>` : ""}
        ${b.img ? `<figure class="fig">${imgTag(b.img)}</figure>` : ""}
      </div>`,
    metrics: (b) =>
      `<div class="metrics">${(b.items || [])
        .map((m) => `<div class="metric"><small>${esc(m.k)}</small><strong>${esc(m.v)}</strong>${m.d ? `<p>${esc(m.d)}</p>` : ""}</div>`)
        .join("")}</div>`,
  };

  const block = (b) => (BLOCKS[b.type] ? BLOCKS[b.type](b) : "");

  function section(s, i) {
    return `<section class="sec">
      <div class="sec-label"><b>${String(i + 1).padStart(2, "0")}</b><span>${esc(s.label)}</span></div>
      <div class="sec-body">
        ${s.title ? `<h2>${esc(s.title)}</h2>` : ""}
        ${s.text ? `<p>${esc(s.text)}</p>` : ""}
        ${(s.blocks || []).map(block).join("")}
      </div>
    </section>`;
  }

  // ---- header: hiện đường viền sau khi cuộn ----
  function navFx() {
    const bar = document.querySelector(".dtop");
    if (!bar) return;
    const on = () => bar.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", on, { passive: true });
    on();
  }

  // ---- nhãn mục bên trái mờ dần khi mục sắp kết thúc ----
  function labelFx() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = matchMedia("(max-width: 900px)");
    const secs = [...root.querySelectorAll(".sec")];
    let ticking = false;

    const update = () => {
      ticking = false;
      const off = reduce.matches || narrow.matches; // kiểm tra lại mỗi lần -> đổi cỡ cửa sổ vẫn đúng
      secs.forEach((s) => {
        const label = s.querySelector(".sec-label");
        if (!label) return;
        if (off) return label.style.removeProperty("--lf");
        const r = s.getBoundingClientRect();
        // mờ dần trong 160px cuối của mục, hết hẳn trước khi chạm nhãn mục sau
        const v = Math.min(1, Math.max(0, (r.bottom - 200) / 160));
        label.style.setProperty("--lf", v.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
  }

  // ---- hiện dần khi cuộn: chỉ cho nội dung (phần đầu trang đã có animation CSS) ----
  const REVEAL = ".hero,.sec-body > *,.more h2,.more-grid a,.dfoot .wrap > *";

  function reveal(scope) {
    if (!("IntersectionObserver" in window)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = (scope || root).querySelectorAll(REVEAL);
    targets.forEach((t) => {
      t.classList.add("rv");
      const inGrid = t.parentElement.classList.contains("more-grid");
      const delay = inGrid ? [...t.parentElement.children].indexOf(t) * 0.08 : t.matches(".hero") ? 0.4 : 0;
      t.style.setProperty("--d", delay + "s");
    });
    document.documentElement.classList.add("js");

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    targets.forEach((t) => io.observe(t));
  }

  // ---- khung iPhone Duo (iframe), truyền ảnh màn ngoài / màn trong qua đường dẫn ----
  function duoHero(duo, title) {
    const url = new URL(duo.src, document.baseURI);
    if (duo.outer) url.searchParams.set("outer", new URL(duo.outer, document.baseURI).href);
    if (duo.inner) url.searchParams.set("inner", new URL(duo.inner, document.baseURI).href);
    return `<div class="hero hero-duo"><iframe src="${esc(url.href)}" title="${esc(title || "iPhone Duo")}" loading="lazy"></iframe></div>`;
  }

  function render(p) {
    const d = p.detail || {};
    document.title = (d.title || p.name || "Chi tiết dự án") + " | Portfolio";

    const meta = (d.meta || [])
      .map((m) => `<div><dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`)
      .join("");

    const more = moreHTML(p);
    const c = d.contact || {};

    root.innerHTML = `
      <div class="wrap">
        <p class="crumb"><a href="index.html">← Portfolio</a></p>
        <p class="eyebrow">${esc(d.eyebrow)}</p>
        <h1 class="dtitle">${esc(d.title || p.name)}</h1>
        ${d.lead ? `<p class="dlead">${esc(d.lead)}</p>` : ""}
        ${d.desc ? `<p class="ddesc">${esc(d.desc)}</p>` : ""}
        ${meta ? `<dl class="meta">${meta}</dl>` : ""}
        ${d.duo ? duoHero(d.duo, d.title) : d.hero ? `<div class="hero">${imgTag(d.hero, d.title)}</div>` : ""}
        ${(d.sections || []).map(section).join("")}
        ${more ? `<section class="more"><h2>More Projects</h2><div class="more-grid">${more}</div></section>` : ""}
      </div>`;

      
    window.scrollTo(0, 0);
    navFx();
    reveal();
    labelFx();
  }

  // ---- vẽ ngay khi file của dự án này đã nạp xong ----
  document.addEventListener("products:ready", () => {
    const p = findProduct();
    if (p) return render(p);

    // không tìm thấy: hiện thứ đang tìm + danh sách dự án đã nạp (bấm được) để biết sai ở đâu
    const found = (window.PRODUCTS || []).filter((x) => x.file);
    console.log("[detail] đang tìm:", key, "| đã nạp:", found.map((x) => x.file));
    root.innerHTML = `<div class="wrap">
      <p class="empty">Không tìm thấy dự án "${esc(key || "(trống)")}".</p>
      <p style="text-align:center;font-size:14px;color:#6e6e73;padding-bottom:80px">
        Đã nạp ${found.length} dự án:
        ${found.map((x) => `<a style="color:#06c" href="detail.html?p=${encodeURIComponent(x.file)}">${esc(x.file)}</a>`).join(" · ") || "chưa có file nào"}
      </p></div>`;
  });

  // ---- các file còn lại nạp xong ở nền -> chèn More Projects (có hiệu ứng hiện dần) ----
  document.addEventListener("products:all", () => {
    const p = findProduct();
    const html = p && moreHTML(p);
    if (!html || root.querySelector(".more")) return;
    root.querySelector(".wrap").insertAdjacentHTML(
      "beforeend",
      `<section class="more"><h2>More Projects</h2><div class="more-grid">${html}</div></section>`
    );
    reveal(root.querySelector(".more"));
  });
})();