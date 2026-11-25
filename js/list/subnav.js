// js/subnav.js
// Render thanh subnav vào <nav id="subnav" class="subnav" aria-label="Danh mục"></nav>
// Bấm vào một mục -> đổi mục đang chọn + phát sự kiện "subnav:select" để app.js lọc theo thư mục.
// key phải trùng tên thư mục trong Detais (Mobbile / Other / Website); "all" = hiện tất cả.
// Ảnh category 76x76: điền `img` (đường dẫn ảnh) hoặc để trống thì dùng ô màu `color`.

const SUBNAV_ITEMS = [
  { key: "all",      slug: "all",      name: "Tất Cả",   color: "#8d8268", img: "assets/system/All.png", current: true },
  { key: "Mobbile",  slug: "mini-app", name: "Mini app", color: "#6a2a35", img: "assets/system/Mobile.png" },
  { key: "Website",  slug: "website",  name: "Website",  color: "#3d5fd6", img: "assets/system/Laptop.png" },
  { key: "Other",    slug: "other",    name: "Other",    color: "#cdbfe6", img: "assets/system/Other.png" },
];

const HOME = "home";

// link của 1 mục: /home hoặc /home/<slug>
function urlFor(it) {
  return new URL(HOME + (it.slug === "all" ? "" : "/" + it.slug), document.baseURI).pathname;
}

// đọc link (/home/<slug>, hoặc #slug của link cũ) -> key của mục (không khớp thì về "all")
function keyFromUrl() {
  const m = location.pathname.match(/\/home(?:\/([^/]+))?\/?$/);
  const slug = decodeURIComponent((m && m[1]) || location.hash.slice(1)).toLowerCase();
  const it = SUBNAV_ITEMS.find((i) => i.slug === slug);
  return it ? it.key : "all";
}

// đánh dấu mục đang chọn (không phát sự kiện)
function markSubnav(key) {
  const nav = document.getElementById("subnav");
  if (!nav) return;
  nav.querySelectorAll("a").forEach((x) => {
    if (x.dataset.key === key) x.setAttribute("aria-current", "page");
    else x.removeAttribute("aria-current");
  });
}

// chọn mục: đánh dấu + (tuỳ chọn) đổi link + báo cho app.js lọc
function selectSubnav(key, push) {
  markSubnav(key);
  if (push) {
    const it = SUBNAV_ITEMS.find((i) => i.key === key);
    const url = urlFor(it);
    if (url !== location.pathname) history.pushState(null, "", url);
  }
  document.dispatchEvent(new CustomEvent("subnav:select", { detail: { key } }));
}

function renderSubnav() {
  const nav = document.getElementById("subnav");
  if (!nav) return;

  nav.innerHTML = SUBNAV_ITEMS.map((it) => {
    const pic = it.img
      ? `<img src="${it.img}" alt="${it.name}" width="76" height="76" loading="lazy">`
      : `<i style="--c:${it.color}"></i>`;

    return `
    <a href="${urlFor(it)}" data-key="${it.key}"${it.current ? ' aria-current="page"' : ""}>
      <span class="ico">${pic}</span>
      <b>${it.name}</b>
    </a>`;
  }).join("");

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-key]");
    if (!a) return;
    e.preventDefault();
    selectSubnav(a.dataset.key, true);
  });
}

// Căn thanh subnav thẳng hàng với mép trái chữ "iPhone" (đo trực tiếp, không phụ thuộc CSS)
function alignSubnav() {
  const nav = document.getElementById("subnav");
  const h1 = document.querySelector("header.title h1, .title h1, h1");
  if (!nav || !h1) return;
  const left = h1.getBoundingClientRect().left - nav.getBoundingClientRect().left;
  nav.style.setProperty("--left", Math.max(0, left) + "px");
}

function initSubnav() {
  // GitHub Pages: 404.html đã chuyển /home/mini-app về index.html, khôi phục lại link đẹp
  const saved = sessionStorage.getItem("redirect");
  if (saved) {
    sessionStorage.removeItem("redirect");
    history.replaceState(null, "", saved);
  }

  renderSubnav();
  alignSubnav();
  window.addEventListener("resize", alignSubnav);

  // mở link có sẵn /home/<slug> (hoặc #slug cũ): chọn đúng tab, chờ app.js nạp xong mới phát sự kiện lọc
  const first = keyFromUrl();
  markSubnav(first);
  if (location.hash || /\/home/.test(location.pathname)) {
    history.replaceState(null, "", urlFor(SUBNAV_ITEMS.find((i) => i.key === first)));
  }
  if (first !== "all") {
    const fire = () =>
      document.dispatchEvent(new CustomEvent("subnav:select", { detail: { key: first } }));
    if (document.readyState === "complete") fire();
    else window.addEventListener("load", fire, { once: true });
  }

  // nút Back/Forward
  window.addEventListener("popstate", () => selectSubnav(keyFromUrl(), false));
}

// File được nạp động qua loader.js nên DOM thường đã sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSubnav);
} else {
  initSubnav();
}