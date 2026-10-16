// Logic chính: state, dữ liệu sản phẩm, phân trang, vẽ lưới.
// Menu/footer: js/nav.js. Bộ lọc + sắp xếp: js/filters.js.
window.PRODUCTS ||= [];
const PAGE_SIZE = 24;
const $ = (s) => document.querySelector(s);
const nf = new Intl.NumberFormat("vi-VN");
const vnd = (n) => nf.format(n) + "đ";
const state = { page: 1, sort: "featured", filters: {}, folder: null }; // folder: Mobbile | Other | Website

// ---------- chuẩn bị dữ liệu ----------
function prepare() {
  PRODUCTS.forEach((p, i) => {
    p.order = i;
    p._hay = [p.name, p.fit, p.brand, p.kind, p.type, p.colorName, p.material]
      .flat()
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    p._fitName = `${p.fit} | ${p.name}`;
  });
}
prepare();

const SORT_FN = {
  featured: (a, b) => a.order - b.order,
  asc: (a, b) => a.price - b.price,
  desc: (a, b) => b.price - a.price,
  new: (a, b) => b.isNew - a.isNew || a.order - b.order,
};

// ---------- kết quả lọc + sắp xếp (có cache) ----------
let view = null;
const invalidate = () => (view = null);

function getView() {
  if (view) return view;
  const act = Object.entries(state.filters)
    .filter(([, vals]) => vals.length)
    .map(([k, vals]) => [k === COMPAT, k === COMPAT ? vals : vals.map((v) => v.toLowerCase())]);
  const ok = (p) =>
    act.every(([isCompat, vals]) =>
      vals.some((v) => (isCompat ? compatRe(v).test(p._fitName) : p._hay.includes(v))),
    );
  const list = PRODUCTS.filter((p) => (!state.folder || p.folder === state.folder) && ok(p)).sort(
    SORT_FN[state.sort] || SORT_FN.featured,
  );
  view = { list, filtered: act.length > 0 || !!state.folder };
  return view;
}

// ---------- subnav: bấm danh mục thì đổi thư mục + bộ lọc ----------
document.addEventListener("subnav:select", (e) => {
  const { key } = e.detail;
  state.folder = key === "all" ? null : key;
  state.page = 1;
  state.filters = {}; // bỏ lọc của danh mục trước
  invalidate();
  resetFilterUI(); // đóng panel/sort, vẽ lại pill
  render(true);
});

// ---------- phân trang ----------
$("#prev").onclick = () => {
  state.page--;
  render(true);
};
$("#next").onclick = () => {
  state.page++;
  render(true);
};

// ---------- vẽ sản phẩm ----------
const EMPTY =
  '<p style="grid-column:1/-1;padding:60px;text-align:center;color:#6e6e73;border-right:1px solid #d2d2d7">Không có sản phẩm phù hợp. Hãy bỏ bớt bộ lọc.</p>';

function art(p) {
  const list = p.imgs || (p.img ? [p.img] : null);
  if (list) {
    const many = list.length > 1;
    const chev = (d) =>
      `<svg width="13" height="20" viewBox="0 0 10 16"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return `<div class="gal" data-i="0" data-n="${list.length}">
      <div class="gal-track">${list
        .map(
          (s, i) =>
            `<img class="pimg" src="${s}" alt="${p.name}" width="432" height="432"${i ? ' loading="lazy"' : ""} decoding="async" draggable="false">`,
        )
        .join("")}</div>
      ${
        many
          ? `<button class="gal-btn prev" type="button" aria-label="Ảnh trước">${chev("M8 2L2 8l6 6")}</button>
      <button class="gal-btn next" type="button" aria-label="Ảnh sau">${chev("M2 2l6 6-6 6")}</button>
      <div class="gal-dots">${list.map((_, i) => `<i${i ? "" : ' class="on"'}></i>`).join("")}</div>`
          : ""
      }
    </div>`;
  }
  const base = /strap|wallet|glass/.test(p.kind) ? "" : "case";
  return `<div class="art ${base} ${p.kind}" style="--c:${p.color}">${p.kind.includes("mag") ? "<span></span>" : ""}</div>`;
}
function card(p, wide) {
  return `<article class="card${wide ? " wide" : ""}" tabindex="0">
    <div class="img">${art(p)}</div>
    <div class="dots">${p.dots.map((c) => `<i style="background:${c}"></i>`).join("")}</div>
    <div class="badge">${p.isNew ? "MỚI" : ""}</div>
    <a class="name" href="#">${p.name}</a>
    <div class="price">${vnd(p.price)}</div>
  </article>`;
}

// thẻ kiểu Apple Mac cho danh mục Website
function webCard(p) {
  const dots = p.dots?.length
    ? `<div class="dots">${p.dots.map((c) => `<i style="background:${c}"></i>`).join("")}</div>`
    : "";
  const note = p.note || (p.price != null ? vnd(p.price) : "");
  const go = (u, cls, txt) =>
    `<a class="${cls}" href="${u}" target="_blank" rel="noopener noreferrer">${txt}</a>`;
  return `<article class="wcard">
    <div class="wimg">${art(p)}</div>
    ${dots}
    <h3 class="wname">${p.name}</h3>
    ${p.tagline ? `<p class="wtag">${p.tagline}</p>` : ""}
    ${note ? `<p class="wnote">${note}</p>` : ""}
    <div class="wbtns">
      ${go(p.url || "#", "btn-pill", "Xem thêm")}
      ${p.buy ? go(p.buy, "btn-link", "Mua ›") : ""}
    </div>
  </article>`;
}

const grid = $("#grid");
const pageInfo = $("#pageinfo");
const prevBtn = $("#prev");
const nextBtn = $("#next");

// ---------- thư viện ảnh trong thẻ (nút ‹ ›, vuốt trên mobile) ----------
function galGo(g, i) {
  const n = +g.dataset.n;
  i = Math.min(Math.max(0, i), n - 1);
  g.dataset.i = i;
  g.querySelector(".gal-track").style.transform = `translate3d(${-i * 100}%,0,0)`;
  g.classList.toggle("first", i === 0);
  g.classList.toggle("last", i === n - 1);
  g.querySelectorAll(".gal-dots i").forEach((d, k) => d.classList.toggle("on", k === i));
}

grid.addEventListener("click", (e) => {
  const b = e.target.closest(".gal-btn");
  if (!b) return;
  e.preventDefault();
  e.stopPropagation();
  const g = b.closest(".gal");
  galGo(g, +g.dataset.i + (b.classList.contains("next") ? 1 : -1));
});

let touchX = null;
grid.addEventListener("touchstart", (e) => {
  touchX = e.target.closest(".card .gal") ? e.touches[0].clientX : null;
}, { passive: true });
grid.addEventListener("touchend", (e) => {
  const g = e.target.closest(".card .gal");
  if (touchX === null || !g) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) galGo(g, +g.dataset.i + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

// ---------- băng chuyền Website: nút ‹ › ----------
const wPrev = $("#wprev");
const wNext = $("#wnext");

function wStep() {
  const c = grid.querySelector(".wcard");
  return c ? c.offsetWidth + 20 : 0; // 1 thẻ + khoảng cách
}

function wUpdate() {
  wPrev.disabled = grid.scrollLeft <= 2;
  wNext.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
}

let wAnim = 0;
function wGo(dx) {
  const max = grid.scrollWidth - grid.clientWidth;
  const from = grid.scrollLeft;
  const to = Math.min(Math.max(0, from + dx), max);
  const t0 = performance.now();
  const dur = 700; // chỉnh tốc độ trượt ở đây (ms)
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // easeInOutCubic
  cancelAnimationFrame(wAnim);
  grid.style.scrollSnapType = "none"; // tắt snap trong lúc trượt để không bị giật
  const tick = (now) => {
    const t = Math.min(1, (now - t0) / dur);
    grid.scrollLeft = from + (to - from) * ease(t);
    if (t < 1) wAnim = requestAnimationFrame(tick);
    else grid.style.scrollSnapType = "";
  };
  wAnim = requestAnimationFrame(tick);
}

wPrev.onclick = () => wGo(-wStep());
wNext.onclick = () => wGo(wStep());
grid.addEventListener("scroll", wUpdate, { passive: true });

function render(scroll) {
  const { list, filtered } = getView();
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  state.page = Math.min(Math.max(1, state.page), pages);
  const start = (state.page - 1) * PAGE_SIZE;
  const slice = list.slice(start, start + PAGE_SIZE);
  const hero = state.sort === "featured" && state.page === 1 && !filtered;

  const web = state.folder === "Website";
  grid.classList.toggle("web", web);
  document.body.classList.toggle("is-web", web);
  grid.innerHTML = slice.length
    ? slice.map((p, i) => (web ? webCard(p) : card(p, hero && i === 0))).join("")
    : EMPTY;
  pageInfo.textContent = `${state.page} of ${pages}`;
  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled = state.page >= pages;
  if (web) { grid.scrollLeft = 0; wUpdate(); } // băng chuyền về thẻ đầu + cập nhật nút ‹ ›
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- khởi động ----------
initFilters(); // định nghĩa trong filters.js
render();

// ---------- thanh lọc: hiện khung bo viền khi dính đầu trang ----------
const sentinel = document.createElement("div");
sentinel.style.cssText = "height:1px;margin-bottom:-1px;pointer-events:none";
filtersBar.before(sentinel);
new IntersectionObserver(
  ([e]) => filtersBar.classList.toggle("stuck", !e.isIntersecting && e.boundingClientRect.top <= 10),
  { rootMargin: "-11px 0px 0px 0px" },
).observe(sentinel);
// ---------- dữ liệu nạp xong: chuẩn bị lại + vẽ tất cả sản phẩm ----------
document.addEventListener("products:ready", () => {
  prepare();
  state.page = 1;
  state.sort = "featured";
  state.filters = {};
  state.folder = null; // mặc định "Tất Cả"
  invalidate();
  resetFilterUI(); // vẽ lại pill theo dữ liệu mới
  render();
});