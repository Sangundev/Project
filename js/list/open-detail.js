// Bấm vào thẻ sản phẩm -> mở trang chi tiết dùng chung
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card, .wcard");
  if (!card) return;

  // không chuyển trang khi bấm nút ‹ ›, chấm báo trang, hoặc link thật bên trong thẻ
  if (e.target.closest(".gal-btn, .gal-dots")) return;
  if (e.target.closest('a[href]:not([href="#"])')) return;

  const nameEl = card.querySelector(".name, .wname");
  if (!nameEl) return;

  const name = nameEl.textContent.trim();
  const p = (window.PRODUCTS || []).find((x) => String(x.name).trim() === name);
  if (!p) return;

  location.href = "detail.html?p=" + encodeURIComponent(p.file || p.id || p.name);
});