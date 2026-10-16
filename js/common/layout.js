// Header + footer dùng chung cho mọi trang. Sửa ở đây là cả index và detail cùng đổi.
(() => {
  const HEADER = `
  <nav class="gnav">
    <div class="gnav-in">
      <a href="index.html" class="logo" aria-label="Trang chủ"><svg width="14" height="18" viewBox="0 0 14 18">
          <circle cx="7" cy="10" r="6.5" fill="currentColor" />
          <rect x="6.2" y="0" width="1.6" height="4" rx=".8" fill="currentColor" />
        </svg></a>
      <ul id="navlinks"></ul>
      <span class="nav-icons">
        <svg width="15" height="44" viewBox="0 0 15 44">
          <circle cx="6" cy="21" r="4.5" fill="none" stroke="currentColor" stroke-width="1.2" />
          <path d="M9.5 24.5 13 28" stroke="currentColor" stroke-width="1.2" />
        </svg>
        <svg width="14" height="44" viewBox="0 0 14 44">
          <path d="M2 17h10l-1 12H3z" fill="none" stroke="currentColor" stroke-width="1.2" />
          <path d="M5 17v-2a2 2 0 0 1 4 0v2" fill="none" stroke="currentColor" stroke-width="1.2" />
        </svg>
        <svg class="burger" width="18" height="44" viewBox="0 0 18 44">
          <path d="M2 20h14M2 25h14" fill="none" stroke="currentColor" stroke-width="1.2" />
        </svg>
      </span>
    </div>
  </nav>

  <div class="promo">
    <p>Chuyển sang trang xem portfolio của tôi
      <a href="https://sangundev.github.io/My_portfolio/" target="_blank" rel="noopener noreferrer">Xem portfolio</a>
    </p>
  </div>`;

  const FOOTER = `
  <section class="shop">
    <h2>Phụ kiện</h2>
    <div class="shop-cols">
      <div>
        <h4>Mua Sắm Theo Sản Phẩm</h4>
        <a class="big" href="#">Tất Cả Phụ Kiện</a><a class="big" href="#">iPhone</a><a class="big" href="#">iPad</a>
        <a class="big" href="#">Mac</a><a class="big" href="#">Apple Watch</a><a class="big" href="#">AirPods</a>
        <a class="big" href="#">AirTag</a><a class="big" href="#">Beats</a>
      </div>
      <div>
        <h4>Mua Sắm Theo Danh Mục iPhone</h4>
        <a class="mid" href="#">MagSafe</a><a class="mid" href="#">Sạc &amp; Bộ Tiếp Hợp Nguồn</a>
        <a class="mid" href="#">Sáng Tạo Nội Dung</a><a class="mid" href="#">Tai Nghe &amp; Loa</a>
        <a class="mid" href="#">Ốp Lưng &amp; Vỏ Bảo Vệ</a><a class="mid" href="#">Sức khỏe &amp; Hoạt động tập luyện</a>
        <a class="mid" href="#">Dây Đeo Chéo &amp; Dây Đeo Tay</a>
      </div>
      <div>
        <h4>Khám Phá Nhiều Phụ Kiện Hơn</h4>
        <a class="small" href="#">Sản Phẩm Mới</a><a class="small" href="#">Màu Sắc Theo Mùa</a>
        <a class="small" href="#">Công Cụ Thiết Yếu Của Sinh Viên</a>
      </div>
    </div>
  </section>

  <footer>
    <p class="note">Phụ kiện thứ ba được giới thiệu chỉ mang tính chất minh họa. Giá và tình trạng hàng có thể thay đổi.</p>
    <p class="crumbs"><a href="#">Phụ Kiện</a> › <a href="#">iPhone</a> › Ốp Lưng &amp; Vỏ Bảo Vệ</p>
    <div class="fcols" id="fcols"></div>
    <p class="legal">Bản quyền © 2026. Dự án minh họa giao diện, không liên kết với Apple.</p>
  </footer>`;

  const put = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.outerHTML = html;
  };
  put("site-header", HEADER);
  put("site-footer", FOOTER);
})();