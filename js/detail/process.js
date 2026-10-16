// Khung click "Ngắm nhìn cận cảnh" + danh sách quy trình dự án (dùng chung 1 mảng STEPS)
(function () {
  const STEPS = [
    { t: "Ý tưởng", img: "assets/system/image.png",
      d: "Xác định mục tiêu, người dùng và tham khảo giao diện mẫu. Chốt phạm vi trước khi bắt tay vào làm." },
    { t: "Thiết kế giao diện",  img: "assets/system/image1.png",
      d: "Phác thảo bố cục, chọn màu, font và khoảng cách. Thiết kế cho cả desktop, tablet và mobile." },
    { t: "Chuẩn bị dữ liệu", img: "assets/system/3.png",
      d: "Chia dữ liệu sản phẩm thành từng file riêng, thống nhất các trường để lọc và sắp xếp." },
    { t: "Lập trình", img: "assets/system/4.png",
      d: "Dựng HTML, viết CSS và JavaScript thuần: lưới sản phẩm, bộ lọc, phân trang, hiệu ứng chuyển động." },
    { t: "Kiểm thử & triển khai", img: "assets/system/4.png",
      d: "Kiểm tra trên nhiều kích thước màn hình và trình duyệt, sửa lỗi rồi đưa lên GitHub Pages." },
  ];

  const list = document.getElementById("expList");
  const bg = document.getElementById("expBg");
  const proc = document.getElementById("procList");
  if (!list || !bg || !proc) return;

  let cur = 0; // -1 = đóng hết

  function setStep(i) {
    cur = Math.min(Math.max(-1, i), STEPS.length - 1);
    draw();
  }

  // dựng danh sách 1 lần; sau đó chỉ bật/tắt class để CSS tự chạy animation
  list.innerHTML = STEPS.map((s, i) =>
    `<div class="exp-item" data-i="${i}">
      <div class="exp-fold exp-fold-pill"><div class="exp-clip">
        <button class="exp-pill" type="button" data-i="${i}" aria-expanded="false"><span class="exp-plus">+</span>${s.t}</button>
      </div></div>
      <div class="exp-fold exp-fold-card"><div class="exp-clip">
        <div class="exp-card"><b>${i + 1}. ${s.t}.</b> ${s.d}</div>
      </div></div>
    </div>`,
  ).join("");
  const items = [...list.children];

  // ảnh nền: tải xong mới chồng lên rồi mờ dần vào (crossfade)
  let topBg = bg;
  function showBg(src) {
    if (topBg.src.endsWith(src)) return;
    const n = new Image();
    n.className = "exp-bg fade";
    n.alt = "";
    n.decoding = "async";
    n.onload = () => {
      topBg.after(n);
      n.getBoundingClientRect(); // ép trình duyệt tính style trước khi bỏ class fade
      n.classList.remove("fade");
      const old = topBg;
      topBg = n;
      setTimeout(() => { if (old !== bg) old.remove(); }, 700);
    };
    n.src = src;
  }

  function draw() {
    items.forEach((el, i) => {
      const on = i === cur;
      el.classList.toggle("on", on);
      el.querySelector(".exp-pill").setAttribute("aria-expanded", on);
      el.querySelector(".exp-fold-card").inert = !on; // phần đang ẩn không nhận focus/click
      el.querySelector(".exp-fold-pill").inert = on;
    });

    if (cur >= 0) showBg(STEPS[cur].img);

    proc.querySelectorAll("li").forEach((li, i) => li.classList.toggle("on", i === cur));
    document.getElementById("expUp").disabled = cur <= 0;
    document.getElementById("expDown").disabled = cur >= STEPS.length - 1;
  }

  proc.innerHTML = STEPS.map((s, i) =>
    `<li><button type="button" data-i="${i}">
      <span class="proc-n">Bước ${i + 1}</span>
      <span class="proc-t">${s.t}</span>
      <span class="proc-d">${s.d}</span>
    </button></li>`,
  ).join("");

  list.addEventListener("click", (e) => {
    const b = e.target.closest(".exp-pill");
    if (b) setStep(+b.dataset.i);
  });

  proc.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    setStep(+b.dataset.i);
    document.getElementById("exp-title").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("expUp").onclick = () => setStep(cur - 1);
  document.getElementById("expDown").onclick = () => setStep(cur < 0 ? 0 : cur + 1);
  document.getElementById("expClose").onclick = () => setStep(-1);

  draw();
})();