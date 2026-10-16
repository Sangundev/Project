// Nạp file theo thứ tự. Thêm sản phẩm mới: tăng số lượng trong COUNT (đúng với số file có trong thư mục Detais).
// Mỗi sản phẩm nạp từ Detais/<Thư mục>/ được gắn p.folder = <Thư mục> để subnav lọc.
const COUNT = { Mobbile: 7, Other: 0, Website: 6 };

const detais = Object.entries(COUNT).flatMap(([folder, n]) =>
  Array.from({ length: n }, (_, i) => ({
    src: `Detais/${folder}/${folder.toLowerCase()}-${i + 1}.js`,
    folder,
  })),
);

const FILES = [
  { src: "js/nav.js" },
  { src: "js/subnav.js" },
  { src: "js/filters.js" },
  ...detais,
  { src: "js/app.js" }, // luôn để cuối
];

const load = (src) =>
  new Promise((done) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = done;
    s.onerror = () => {
      console.warn("Không tải được: " + src);
      done();
    };
    document.body.append(s);
  });

(async () => {
  window.PRODUCTS ||= [];
  for (const { src, folder } of FILES) {
    const before = PRODUCTS.length;
    await load(src);
    if (folder) PRODUCTS.slice(before).forEach((p) => (p.folder = folder));
  }
  document.dispatchEvent(new Event("products:ready")); // báo đã nạp xong dữ liệu
})();