// Logic chính: state, dữ liệu sản phẩm, phân trang, vẽ lưới.
// Menu/footer: js/nav.js. Bộ lọc + sắp xếp: js/filters.js.
window.PRODUCTS ||= [];
const PAGE_SIZE = 24;
const $ = (s) => document.querySelector(s);
const nf = new Intl.NumberFormat("vi-VN");
const vnd = (n) => nf.format(n) + "đ";
const state = { page: 1, sort: "featured", filters: {}, folder: null }; // folder: Mobbile | Other | Website

// ---------- chuẩn bị dữ liệu ----------
PRODUCTS.forEach((p, i) => {
  p.order = i;
  p._hay = `${p.name} ${p.fit} ${p.brand} ${p.kind}`.toLowerCase();
  p._fitName = `${p.fit} | ${p.name}`;
});

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

const grid = $("#grid");
const pageInfo = $("#pageinfo");
const prevBtn = $("#prev");
const nextBtn = $("#next");

function render(scroll) {
  const { list, filtered } = getView();
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  state.page = Math.min(Math.max(1, state.page), pages);
  const start = (state.page - 1) * PAGE_SIZE;
  const slice = list.slice(start, start + PAGE_SIZE);
  const hero = state.sort === "featured" && state.page === 1 && !filtered;

  grid.innerHTML = slice.length ? slice.map((p, i) => card(p, hero && i === 0)).join("") : EMPTY;
  pageInfo.textContent = `${state.page} of ${pages}`;
  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled = state.page >= pages;
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