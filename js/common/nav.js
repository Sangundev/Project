// Dữ liệu điều hướng + footer
// key = data-key của mục tương ứng ở subnav (all / Mobbile / Branding / Other / Website)
const NAV = [
  { t: "Trang chủ", href: "index.html" },
  { t: "Tất cả dự án", key: "all" },
  { t: "Mini app", key: "Mobbile" },
  { t: "Website", key: "Website" },
  { t: "Branding", key: "Branding" },
  { t: "Other", key: "Other" },
  { t: "Quy trình", href: "index.html#process" },
  { t: "Giới thiệu", href: "index.html#about" },
  { t: "Kỹ năng", href: "index.html#skills" },
  { t: "Liên hệ", href: "index.html#contact" },
];

const FCOLS = {
  "Dự án": ["Tất cả dự án", "Mini app", "Website", "Branding", "Other"],
  "Liên hệ": ["Email", "Zalo", "Tải CV"],
  "Thiết kế": ["Figma", "Behance"],
};

// ---------- vẽ nav + footer ----------
const here = location.pathname.split("/").pop() || "index.html";
const onList = here === "index.html";
const subTab = (key) => document.querySelector(`#subnav a[data-key="${key}"]`);

document.querySelector("#navlinks").innerHTML = NAV.map((n) =>
  n.key
    ? `<li><a href="index.html?c=${encodeURIComponent(n.key)}" data-key="${n.key}">${n.t}</a></li>`
    : `<li><a href="${n.href}">${n.t}</a></li>`,
).join("");

// đang ở trang danh sách: bấm menu trên = bấm mục subnav tương ứng
document.querySelector("#navlinks").addEventListener("click", (e) => {
  const a = e.target.closest("a[data-key]");
  if (!a || !onList) return;
  const tab = subTab(a.dataset.key);
  if (!tab) return;
  e.preventDefault();
  tab.click();
});

// mở index.html?c=... (từ trang chi tiết sang): chọn tab sau khi app.js đã đặt lại trạng thái
if (onList) {
  const c = new URLSearchParams(location.search).get("c");
  if (c && c !== "all") {
    document.addEventListener("products:ready", () => {
      setTimeout(() => subTab(c)?.click(), 150);
    });
  }
}

document.querySelector("#fcols").innerHTML = Object.entries(FCOLS)
  .map(([h, l]) => `<div><h5>${h}</h5>${l.map((x) => `<a href="#">${x}</a>`).join("")}</div>`)
  .join("");