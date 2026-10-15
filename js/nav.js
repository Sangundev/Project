// Dữ liệu điều hướng + footer
const NAV = [
  "Cửa Hàng", "Mac", "iPad", "iPhone", "Watch",
  "AirPods", "Nhà", "Giải Trí", "Phụ Kiện", "Hỗ Trợ",
];

const FCOLS = {
  "Mua Sắm Theo Tìm Hiểu": [
    "Cửa Hàng", "Mac", "iPad", "iPhone", "Apple Watch",
    "AirPods", "Apple TV & Nhà", "Phụ Kiện", "Thẻ Quà Tặng",
  ],
  "Tài Khoản": ["Quản Lý Tài Khoản Apple", "Tài Khoản Apple Store", "iCloud.com"],
  "Apple Store": ["Ứng Dụng Apple Store", "Tài Chính", "Apple Trade In", "Hỗ Trợ Mua Hàng"],
  "Dành Cho Doanh Nghiệp": ["Apple và Doanh Nghiệp", "Mua Sắm Cho Doanh Nghiệp"],
  "Giá Trị Cốt Lõi Của Apple": ["Trợ Năng", "Môi Trường", "Quyền Riêng Tư", "Chuỗi Cung Ứng"],
};
// ---------- vẽ nav + footer ----------
document.querySelector("#navlinks").innerHTML = NAV.map((n) => `<li><a href="#">${n}</a></li>`).join("");
document.querySelector("#fcols").innerHTML = Object.entries(FCOLS)
  .map(([h, l]) => `<div><h5>${h}</h5>${l.map((x) => `<a href="#">${x}</a>`).join("")}</div>`)
  .join("");