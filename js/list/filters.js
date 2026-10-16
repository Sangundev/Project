// Dữ liệu bộ lọc
const COMPAT = "Khả Năng Tương Thích";

// nhóm lọc -> tên trường trong dữ liệu sản phẩm
const GROUP_FIELD = {
  "Loại Phụ Kiện": "type",
  [COMPAT]: "fit",
  "Nhãn Hiệu": "brand",
  Màu: "colorName",
  "Chất Liệu": "material",
};

const toArr = (v) => (v == null || v === "" ? [] : Array.isArray(v) ? v : [v]);

// bộ lọc của danh mục, tự quét PRODUCTS; nhóm nào không có dữ liệu thì không hiện
function getPills(cat) {
  const list = (window.PRODUCTS || []).filter((p) => cat === "Tất Cả" || p.folder === cat);
  const out = {};
  for (const [group, field] of Object.entries(GROUP_FIELD)) {
    const vals = [
      ...new Set(
        list.flatMap((p) => toArr(p[field])).map((v) => String(v).trim()).filter(Boolean),
      ),
    ];
    if (!vals.length) continue;
    vals.sort((a, b) =>
      group === COMPAT
        ? b.localeCompare(a, "vi", { numeric: true })
        : a.localeCompare(b, "vi", { numeric: true }),
    );
    out[group] = vals;
  }
  return out;
}

const MORE = [
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus",
  "iPhone 16", "iPhone 16e", "iPhone 15 Pro Max", "iPhone 15 Pro",
];

const SORTS = [
  ["featured", "Nổi bật"],
  ["new", "Mới nhất"],
  ["asc", "Giá: Thấp đến Cao"],
  ["desc", "Giá: Cao đến Thấp"],
];
// ---------- khớp tương thích ----------
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const reCache = new Map();
const compatRe = (v) => {
  let r = reCache.get(v);
  if (!r) reCache.set(v, (r = new RegExp(escRe(v) + "(?! Pro| Max| Plus|e\\b|\\d)", "i")));
  return r;
};

// ---------- giao diện lọc + sắp xếp ----------
const curPills = () => getPills(state.folder || "Tất Cả");

const FIND =
  '<div class="find"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="#86868b"/><path d="M6 5l5 3-5 3z" fill="none" stroke="#86868b"/></svg><p><b>Tìm phiên bản</b>Trên iPhone, hãy chuyển đến Cài Đặt &gt; Cài Đặt Chung &gt; Giới Thiệu &gt; Tên Phiên Bản</p></div>';

let pills, panel, filtersBar, sortBtn, sortList, fcount, freset;
let openKey = null;
let expanded = false;

function drawPills() {
  pills.innerHTML = Object.keys(curPills())
    .map((k) => `<button class="pill" aria-expanded="false" data-k="${k}">${k}</button>`)
    .join("");
}

// HTML của 1 nhóm lọc (dùng cho panel desktop và accordion mobile)
function groupHTML(k) {
  const single = k === COMPAT;
  const radio = single && openKey !== "__all"; // desktop: chọn 1, mobile: chọn nhiều
  const base = curPills()[k] || [];
  const items = base;
  const checked = state.filters[k] || [];
  return (
    `<div class="opts">${items
      .map(
        (v) =>
          `<label><input type="${radio ? "radio" : "checkbox"}" name="${k}" data-k="${k}" value="${v}" ${checked.includes(v) ? "checked" : ""}>${v}</label>`,
      )
      .join("")}</div>` +
    (single ? FIND : "")
  );
}

function drawPanel() {
  // desktop: panel của 1 pill
  if (openKey !== "__all") {
    panel.innerHTML = groupHTML(openKey);
    return;
  }
  // mobile: tất cả nhóm dạng accordion (giữ nhóm đang mở + vị trí cuộn khi vẽ lại)
  const was = [...panel.querySelectorAll("details[open]")].map((d) => d.dataset.k);
  const st = panel.scrollTop;
  const total = Object.values(state.filters || {}).reduce((s, a) => s + a.length, 0);
  const HEAD =
    `<div class="phead"><button class="preset${total ? " show" : ""}" type="button">Đặt lại</button>` +
    '<button class="pclose" type="button" aria-label="Đóng"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>';
  panel.innerHTML =
    HEAD +
    Object.keys(curPills())
      .map((k) => {
        const n = (state.filters[k] || []).length;
        const badge = n ? `<i class="gcount">${n}</i>` : "";
        return `<details class="acc" data-k="${k}"${was.includes(k) ? " open" : ""}><summary><span>${k}${badge}</span></summary>${groupHTML(k)}</details>`;
      })
      .join("");
  panel.scrollTop = st;
}
function closePanel() {
  if (openKey === null) return;
  openKey = null;
  panel.hidden = true;
  filtersBar.classList.remove("open");
  document.documentElement.classList.remove("lock");
  filtersBar.querySelectorAll(".pill").forEach((x) => x.setAttribute("aria-expanded", "false"));
}

function drawSort() {
  sortList.innerHTML = SORTS.map(
    ([v, t]) => `<li role="option" data-v="${v}" aria-selected="${state.sort === v}">${t}</li>`,
  ).join("");
  sortBtn.textContent = SORTS.find((s) => s[0] === state.sort)[1];
}
// cập nhật số bộ lọc + nút Đặt lại
function drawFilterState() {
  const n = Object.values(state.filters || {}).reduce((s, a) => s + a.length, 0);
  fcount.textContent = n;
  fcount.classList.toggle("show", n > 0);
  freset.classList.toggle("show", n > 0);

  // chấm số trên từng pill (desktop), cập nhật tại chỗ để không làm mất trạng thái mở
  pills.querySelectorAll(".pill").forEach((b) => {
    const c = (state.filters[b.dataset.k] || []).length;
    let i = b.querySelector(".gcount");
    if (c) {
      if (!i) {
        i = document.createElement("i");
        i.className = "gcount";
        b.appendChild(i);
      }
      i.textContent = c;
    } else if (i) {
      i.remove();
    }
  });
}
function closeSort() {
  if (sortList.hidden) return;
  sortList.hidden = true;
  sortBtn.setAttribute("aria-expanded", "false");
}

// gọi khi đổi danh mục: đóng hết và vẽ lại pill
function resetFilterUI() {
  closePanel();
  closeSort();
  drawPills();
  drawFilterState();
}
// nút tròn mũi tên cuộn ngang danh mục (mobile)
function initSubnavArrow() {
  const nav = $("#subnav");
  if (!nav || nav.parentElement.classList.contains("subnav-wrap")) return;

  const wrap = document.createElement("div");
  wrap.className = "subnav-wrap";
  nav.parentNode.insertBefore(wrap, nav);
  wrap.appendChild(nav);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "subnav-next";
  btn.setAttribute("aria-label", "Cuộn sang phải");
  btn.innerHTML =
    '<svg width="10" height="16" viewBox="0 0 10 16"><path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  wrap.appendChild(btn);

  const update = () =>
    btn.classList.toggle("show", nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4);

  btn.addEventListener("click", () =>
    nav.scrollBy({ left: nav.clientWidth * 0.7, behavior: "smooth" }),
  );
  nav.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  new ResizeObserver(update).observe(nav);
  new MutationObserver(update).observe(nav, { childList: true, subtree: true });
  update();
}
function initFilters() {
  pills = $("#pills");
  panel = $("#panel");
  filtersBar = $(".filters");
  sortBtn = $("#sortbtn");
  sortList = $("#sortlist");
  fcount = $("#fcount");
  freset = $("#freset");

  freset.addEventListener("click", () => {
    state.filters = {};
    state.page = 1;
    invalidate();
    if (openKey) drawPanel();
    drawFilterState();
    render();
  });

  drawPills();
  drawFilterState();
  drawSort();
  initSubnavArrow();

  // mobile: nút "Bộ lọc" mở panel chứa tất cả nhóm
  const mbtn = $("#mfilter");
  mbtn.addEventListener("click", () => {
    const same = openKey === "__all";
    closePanel();
    closeSort();
    if (same) return;
    filtersBar.classList.add("open");
    panel.style.setProperty("--bar", $(".filters-in").offsetHeight + "px");
    openKey = "__all";
    expanded = false;
    document.documentElement.classList.add("lock");
    mbtn.setAttribute("aria-expanded", "true");
    panel.innerHTML = "";
    drawPanel();
    panel.hidden = false;
  });

  pills.addEventListener("click", (e) => {
    const bt = e.target.closest(".pill");
    if (!bt) return;
    const k = bt.dataset.k;
    const same = openKey === k;
    closePanel();
    closeSort();
    if (same) return;
    filtersBar.classList.add("open");
    panel.style.setProperty("--bar", $(".filters-in").offsetHeight + "px");
    openKey = k;
    expanded = false;
    bt.setAttribute("aria-expanded", "true");
    drawPanel();
    panel.hidden = false;
  });

  panel.addEventListener("click", (e) => {
    if (e.target.closest(".pclose")) {
      closePanel();
      return;
    }
    if (e.target.closest(".preset")) {
      freset.click();
      return;
    }
    if (e.target.id === "more") {
      expanded = true;
      drawPanel();
      return;
    }
    const c = e.target.closest("input");
    if (!c) return;
    const k = c.dataset.k;
    const cur = state.filters[k] || [];
    if (c.type === "radio") {
      const unselect = cur[0] === c.value; // bấm lại để bỏ chọn
      state.filters[k] = unselect ? [] : [c.value];
      if (unselect) c.checked = false;
    } else {
      state.filters[k] = c.checked ? [...cur, c.value] : cur.filter((x) => x !== c.value);
    }
    state.page = 1;
    invalidate();
    drawFilterState();
    if (openKey === "__all") drawPanel();
    render();
  });

  sortBtn.addEventListener("click", () => {
    const willOpen = sortList.hidden;
    closePanel();
    closeSort();
    if (willOpen) {
      sortList.hidden = false;
      sortBtn.setAttribute("aria-expanded", "true");
    }
  });

  sortList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    state.sort = li.dataset.v;
    state.page = 1;
    invalidate();
    drawSort();
    closeSort();
    render();
  });

  document.addEventListener("click", (e) => {
    // dùng composedPath vì phần tử vừa bấm có thể đã bị vẽ lại (không còn trong DOM)
    const path = e.composedPath();
    if (!path.includes(filtersBar) || e.target === filtersBar) closePanel();
    if (!path.includes($(".sort"))) closeSort();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closePanel();
    closeSort();
  });
}