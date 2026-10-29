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
    diagram: (b) => {
      const cols = b.cols || [];
      return `<div class="dg" style="--n:${cols.length || 1}">${cols
        .map(
          (c) => `<div class="dg-col${c.hl ? " is-hl" : ""}">
            <div class="dg-head">
              <small>${esc(c.n)}</small>
              <h4>${esc(c.title)}</h4>
            </div>
            <ul class="dg-list">${(c.items || [])
              .map((i) => `<li><b>${esc(i.t)}</b>${i.d ? `<span>${esc(i.d)}</span>` : ""}</li>`)
              .join("")}</ul>
            ${c.foot ? `<p class="dg-foot">${esc(c.foot)}</p>` : ""}
          </div>`
        )
        .join("")}</div>`;
    },
    graph: (b) => {
      const cols = b.cols || 3;
      const nodes = (b.nodes || [])
        .map(
          (n) =>
            `<div class="gp-node${n.hl ? " is-hl" : ""}${n.mute ? " is-mute" : ""}${n.w ? " is-wide" : ""}" data-id="${esc(n.id)}" style="grid-column:${n.c || 1}${n.w ? " / span " + n.w : ""};grid-row:${n.r || 1}"><b>${esc(n.t)}</b>${n.d ? `<span>${esc(n.d)}</span>` : ""}</div>`
        )
        .join("");
      return `<div class="gp${b.dark ? " is-dark" : ""}">
        ${b.title ? `<div class="gp-title">${b.tag ? `<small>${esc(b.tag)}</small>` : ""}<h4>${esc(b.title)}</h4></div>` : ""}
        <div class="gp-scroll">
          <div class="gp-in" style="--c:${cols}" data-edges="${esc(JSON.stringify(b.edges || []))}">
            <svg class="gp-svg" aria-hidden="true"></svg>
            <div class="gp-grid" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${nodes}</div>
          </div>
        </div>
      </div>`;
    },
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

  // ---- vẽ đường nối cho khối graph (đo vị trí các ô rồi vẽ SVG) ----
  function drawGraphs(scope) {
    (scope || root).querySelectorAll(".gp-in").forEach((box) => {
      const svg = box.querySelector(".gp-svg");
      let edges = [];
      try { edges = JSON.parse(box.dataset.edges || "[]"); } catch (e) {}
      const o = box.getBoundingClientRect();
      const pos = {};
      box.querySelectorAll(".gp-node").forEach((n) => {
        const r = n.getBoundingClientRect();
        pos[n.dataset.id] = { l: r.left - o.left, r: r.right - o.left, t: r.top - o.top, b: r.bottom - o.top };
      });
      svg.setAttribute("width", o.width);
      svg.setAttribute("height", o.height);
      svg.setAttribute("viewBox", `0 0 ${o.width} ${o.height}`);
      svg.innerHTML = edges
        .map(([a, b, mode]) => {
          const s = pos[a], t = pos[b];
          if (!s || !t) return "";
          const sx = (s.l + s.r) / 2, tx = (t.l + t.r) / 2;
          const sy = (s.t + s.b) / 2, ty = (t.t + t.b) / 2;
          let d = "";
          if (mode === "side") {                      // đi ngang ra cạnh bên rồi xuống đích
            const x0 = tx < sx ? s.l : s.r;
            d = `M${x0} ${sy}H${tx}V${t.t}`;
          } else if (mode === "vh") {                 // đi dọc xuống ngang đích rồi vào cạnh bên
            const x1 = tx < sx ? t.r : t.l;
            d = `M${sx} ${s.b}V${ty}H${x1}`;
          } else if (t.t >= s.b - 1) {                // đích nằm bên dưới
            const m = (s.b + t.t) / 2;
            d = Math.abs(sx - tx) < 1 ? `M${sx} ${s.b}V${t.t}` : `M${sx} ${s.b}V${m}H${tx}V${t.t}`;
          } else if (t.l >= s.r - 1) {                // đích nằm bên phải
            const m = (s.r + t.l) / 2;
            d = Math.abs(sy - ty) < 1 ? `M${s.r} ${sy}H${t.l}` : `M${s.r} ${sy}H${m}V${ty}H${t.l}`;
          } else if (t.r <= s.l + 1) {                // đích nằm bên trái
            const m = (s.l + t.r) / 2;
            d = Math.abs(sy - ty) < 1 ? `M${s.l} ${sy}H${t.r}` : `M${s.l} ${sy}H${m}V${ty}H${t.r}`;
          }
          return d ? `<path d="${d}"/>` : "";
        })
        .join("");
    });
  }
  let gpTimer;
  addEventListener("resize", () => {
    clearTimeout(gpTimer);
    gpTimer = setTimeout(() => drawGraphs(), 80);
  });

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
    drawGraphs();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => drawGraphs());
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
  });  // ---- vẽ dây nối + hiệu ứng chạy cho khối graph ----
  const NS = "http://www.w3.org/2000/svg";
  const PULSE = 28;      // độ dài đoạn sáng (px)
  const SPEED = 0.3;     // tốc độ chạy (px mỗi ms), tăng số này thì chạy nhanh hơn

  // nối các điểm gấp khúc, bo tròn góc
  function roundedPath(pts, r) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
      const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy);
      const k = Math.min(r, l1 / 2, l2 / 2);
      d += `L${cx + ((px - cx) / l1) * k} ${cy + ((py - cy) / l1) * k}`;
      d += `Q${cx} ${cy} ${cx + ((nx - cx) / l2) * k} ${cy + ((ny - cy) / l2) * k}`;
    }
    const e = pts[pts.length - 1];
    return d + `L${e[0]} ${e[1]}`;
  }

  // các điểm đi của một dây, tùy hướng và mode
  function edgePoints(s, t, mode) {
    const sx = (s.l + s.r) / 2, tx = (t.l + t.r) / 2;
    const sy = (s.t + s.b) / 2, ty = (t.t + t.b) / 2;
    if (mode === "side") {                       // ra cạnh bên rồi đi xuống đỉnh ô đích
      const x0 = tx < sx ? s.l : s.r;
      return [[x0, sy], [tx, sy], [tx, t.t]];
    }
    if (mode === "vh") {                         // đi xuống ngang hàng đích rồi vào cạnh bên
      const x1 = tx < sx ? t.r : t.l;
      return [[sx, s.b], [sx, ty], [x1, ty]];
    }
    if (t.t >= s.b - 1) {                        // đích bên dưới
      const m = (s.b + t.t) / 2;
      return Math.abs(sx - tx) < 1 ? [[sx, s.b], [tx, t.t]] : [[sx, s.b], [sx, m], [tx, m], [tx, t.t]];
    }
    if (t.l >= s.r - 1) {                        // đích bên phải
      const m = (s.r + t.l) / 2;
      return Math.abs(sy - ty) < 1 ? [[s.r, sy], [t.l, ty]] : [[s.r, sy], [m, sy], [m, ty], [t.l, ty]];
    }
    if (t.r <= s.l + 1) {                        // đích bên trái
      const m = (s.l + t.r) / 2;
      return Math.abs(sy - ty) < 1 ? [[s.l, sy], [t.r, ty]] : [[s.l, sy], [m, sy], [m, ty], [t.r, ty]];
    }
    return null;
  }

  // chỉ chạy hiệu ứng khi sơ đồ đang nằm trong màn hình
  const gpIO =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (es) => es.forEach((e) => (e.target._gpAnims || []).forEach((a) => (e.isIntersecting ? a.play() : a.pause()))),
          { threshold: 0.1 }
        )
      : null;

  function drawGraphs(scope) {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    (scope || root).querySelectorAll(".gp-in").forEach((box) => {
      (box._gpAnims || []).forEach((a) => a.cancel());
      box._gpAnims = [];
      box.querySelectorAll(".gp-label").forEach((n) => n.remove());

      const svg = box.querySelector(".gp-svg");
      let edges = [];
      try { edges = JSON.parse(box.dataset.edges || "[]"); } catch (e) {}

      // đo vị trí các ô
      const o = box.getBoundingClientRect();
      const pos = {}, els = {};
      box.querySelectorAll(".gp-node").forEach((n) => {
        const r = n.getBoundingClientRect();
        pos[n.dataset.id] = { l: r.left - o.left, r: r.right - o.left, t: r.top - o.top, b: r.bottom - o.top };
        els[n.dataset.id] = n;
      });

      svg.setAttribute("width", o.width);
      svg.setAttribute("height", o.height);
      svg.setAttribute("viewBox", `0 0 ${o.width} ${o.height}`);
      svg.innerHTML = "";

      // 1) dây nền
      const items = [];
      edges.forEach(([a, b, mode, label]) => {
        const s = pos[a], t = pos[b];
        if (!s || !t) return;
        const raw = edgePoints(s, t, mode);
        if (!raw) return;
        const pts = raw.filter((p, i) => i === 0 || p[0] !== raw[i - 1][0] || p[1] !== raw[i - 1][1]);
        if (pts.length < 2) return;
        const d = roundedPath(pts, 0);
        const base = document.createElementNS(NS, "path");
        base.setAttribute("d", d);
        base.setAttribute("class", "gp-base");
        svg.appendChild(base);
        items.push({ a, b, d, pts, label, base });
      });

      // 2) dây sáng (chạy), chấm khớp nối, nhãn trên dây
      items.forEach((it) => {
        it.len = it.base.getTotalLength();
        const lit = document.createElementNS(NS, "path");
        lit.setAttribute("d", it.d);
        lit.setAttribute("class", "gp-lit");
        lit.style.strokeDasharray = `${PULSE} ${it.len + PULSE}`;
        lit.style.strokeDashoffset = PULSE;
        lit.style.opacity = 0;
        svg.appendChild(lit);
        it.lit = lit;

        [it.pts[0], it.pts[it.pts.length - 1]].forEach((p) => {
          const c = document.createElementNS(NS, "circle");
          c.setAttribute("cx", p[0]);
          c.setAttribute("cy", p[1]);
          c.setAttribute("r", 2.5);
          c.setAttribute("class", "gp-port");
          svg.appendChild(c);
        });

        if (it.label) {
          const m = it.base.getPointAtLength(it.len / 2);
          const el = document.createElement("div");
          el.className = "gp-label";
          el.textContent = it.label;
          el.style.left = m.x + "px";
          el.style.top = m.y + "px";
          box.appendChild(el);
        }
      });

            if (reduce || !items.length || !box.animate) return;

      // thời gian đoạn sáng chạy qua mỗi dây
      items.forEach((it) => (it.dur = it.len / SPEED));

      // maxA: lúc đoạn sáng cuối cùng tới ô, minA: lúc đoạn sáng đầu tiên tới ô
      const maxA = {}, minA = {};
      Object.keys(pos).forEach((id) => (maxA[id] = 0));
      for (let k = 0; k < items.length + 1; k++)
        items.forEach((it) => { maxA[it.b] = Math.max(maxA[it.b], maxA[it.a] + it.dur); });
      Object.keys(pos).forEach((id) => (minA[id] = Infinity));
      items.forEach((it) => { minA[it.b] = Math.min(minA[it.b], maxA[it.a] + it.dur); });
      Object.keys(pos).forEach((id) => { if (minA[id] === Infinity) minA[id] = 0; });

      const hold = 900, fade = 500, pause = 600;
      const total = Math.max(...Object.values(maxA)) + hold + fade + pause;

      const cs = getComputedStyle(box);
      const glow = cs.getPropertyValue("--gp-glow").trim() || "#6b7a3a";
      const glow2 = cs.getPropertyValue("--gp-glow2").trim() || "rgba(107,122,58,.35)";
      const anims = [];

      // đoạn sáng chạy dọc từng dây
      items.forEach((it) => {
        const s = maxA[it.a] / total;
        const e = (maxA[it.a] + it.dur) / total;
        anims.push(
          it.lit.animate(
            [
              { offset: 0, strokeDashoffset: PULSE, opacity: 0 },
              { offset: s, strokeDashoffset: PULSE, opacity: 1 },
              { offset: e, strokeDashoffset: -it.len, opacity: 1 },
              { offset: Math.min(e + 0.0001, 1), strokeDashoffset: -it.len, opacity: 0 },
              { offset: 1, strokeDashoffset: -it.len, opacity: 0 }
            ],
            { duration: total, iterations: Infinity, easing: "linear" }
          )
        );
      });

      // viền ô sáng khi đoạn sáng chạm tới, mờ dần sau khi nhánh chậm nhất tới
      Object.entries(els).forEach(([id, n]) => {
        const a = minA[id] / total;
        const b = (maxA[id] + hold) / total;
        const c = (maxA[id] + hold + fade) / total;
        const bs = getComputedStyle(n).boxShadow;
        const base = !bs || bs === "none" ? "0 0 0 0 transparent" : bs;
        const on = `0 0 0 1px ${glow}, 0 0 18px ${glow2}`;
        anims.push(
          n.animate(
            [
              { offset: 0, boxShadow: base },
              { offset: a, boxShadow: base },
              { offset: Math.min(a + 0.01, b), boxShadow: on },
              { offset: b, boxShadow: on },
              { offset: c, boxShadow: base },
              { offset: 1, boxShadow: base }
            ],
            { duration: total, iterations: Infinity, easing: "linear" }
          )
        );
      });

      box._gpAnims = anims;
      anims.forEach((a) => a.pause());
      if (gpIO) { gpIO.unobserve(box); gpIO.observe(box); }
      else anims.forEach((a) => a.play());
    });
  }
})();