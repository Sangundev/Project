// js/subnav.js
// Render thanh subnav vào <nav id="subnav" class="subnav" aria-label="Danh mục"></nav>
// Bấm vào một mục -> đổi mục đang chọn + phát sự kiện "subnav:select" để app.js lọc theo thư mục.
// key phải trùng tên thư mục trong Detais (Mobbile / Other / Website); "all" = hiện tất cả.
// Ảnh category 76x76: điền `img` (đường dẫn ảnh) hoặc để trống thì dùng ô màu `color`.

const SUBNAV_ITEMS = [
  { key: "all",     name: "Tất Cả", color: "#8d8268", img: "assets/system/1.png", current: true },
  { key: "Mobbile", name: "Mobile",  color: "#6a2a35", img: "assets/system/2.png"},
  { key: "Other",   name: "Other",   color: "#cdbfe6", img: "assets/system/3.png"},
  { key: "Website", name: "Website", color: "#3d5fd6", img:  "assets/system/4.png"},
];

function renderSubnav() {
  const nav = document.getElementById("subnav");
  if (!nav) return;

  nav.innerHTML = SUBNAV_ITEMS.map((it) => {
    const pic = it.img
      ? `<img src="${it.img}" alt="${it.name}" width="76" height="76" loading="lazy">`
      : `<i style="--c:${it.color}"></i>`;

    return `
    <a href="#" data-key="${it.key}"${it.current ? ' aria-current="page"' : ""}>
      <span class="ico">${pic}</span>
      <b>${it.name}</b>
    </a>`;
  }).join("");

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-key]");
    if (!a) return;
    e.preventDefault();
    nav.querySelectorAll("a").forEach((x) => x.removeAttribute("aria-current"));
    a.setAttribute("aria-current", "page");
    document.dispatchEvent(new CustomEvent("subnav:select", { detail: { key: a.dataset.key } }));
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
  renderSubnav();
  alignSubnav();
  window.addEventListener("resize", alignSubnav);
}

// File được nạp động qua loader.js nên DOM thường đã sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSubnav);
} else {
  initSubnav();
}