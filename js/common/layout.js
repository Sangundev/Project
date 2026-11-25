// Header + footer dùng chung cho mọi trang. Sửa ở đây là cả index và detail cùng đổi.
(() => {
  const HEADER = `
  <nav class="gnav">
    <div class="gnav-in">
      <a href="index.html" class="logo" aria-label="Trang chủ"><img src="assets/system/Logo.svg" ></a>
      <ul id="navlinks"></ul>
      <span class="nav-icons">
        <button type="button" class="langtoggle" aria-label="Language"><b>VI</b><i>/</i><b>EN</b></button>
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

  // Danh sách lĩnh vực thiết kế: thêm/bớt ở đây, footer tự dựng lại.
  // group: 1 = cột lớn, 2 = cột vừa, 3 = cột 
  // slug phải trùng slug trong SUBNAV_ITEMS (js/list/subnav.js)
  const FIELDS = [
    { name: "Tất Cả", slug: "all", img: "assets/system/All.png" },
    { name: "Mini app", slug: "mini-app", img: "assets/system/Mobile.png" },
    { name: "Website", slug: "website", img: "assets/system/Laptop.png" },
    { name: "Branding", slug: "branding" }, // chưa có ảnh, thêm img: "..." sau
    { name: "Other", slug: "other", img: "assets/system/Other.png" },
  ];

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  const fieldLink = (f) =>
    `<a class="big" href="index.html${f.slug === "all" ? "" : "#" + f.slug}">
      ${f.img ? `<img class="field-img" src="${f.img}" alt="" loading="lazy">` : ""}
      <span>${esc(f.name)}</span>
    </a>`;

  const FOOTER = `
  <section class="shop">
    <h2>Lĩnh vực</h2>
    <div class="shop-cols">
      <div>
        <h4>Lĩnh Vực Thiết Kế</h4>
        ${FIELDS.map(fieldLink).join("")}
      </div>
    </div>
  </section>

  <footer>
    <p class="note">Hình ảnh dự án chỉ mang tính chất minh họa. Nội dung có thể thay đổi.</p>
    <p class="crumbs"><a href="index.html">Dự án</a> › Lĩnh vực</p>
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