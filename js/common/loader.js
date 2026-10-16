(() => {
  const DATA_DIR = "data";
  const COUNT = { Mobbile: 7, Other: 0, Website: 6 };

  const cfg = document.currentScript ? document.currentScript.dataset : {};
  const list = (s) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : []);
  const q = new URLSearchParams(location.search);
  const key = q.get("p") || q.get("id");

  const dataFiles = Object.entries(COUNT).flatMap(([folder, n]) =>
    Array.from({ length: n }, (_, i) => {
      const file = `${folder.toLowerCase()}-${i + 1}`;
      return { src: `${DATA_DIR}/${folder}/${file}.js`, folder, file };
    }),
  );

  const load = (src) =>
    new Promise((done) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = done;
      s.onerror = () => { console.warn("Không tải được: " + src); done(); };
      document.body.append(s);
    });

  const loadData = async (files) => {
    for (const { src, folder, file } of files) {
      const before = window.PRODUCTS.length;
      await load(src);
      window.PRODUCTS.slice(before).forEach((p) => { p.folder = folder; p.file = file; });
    }
  };
  const loadScripts = async (srcs) => { for (const src of srcs) await load(src); };

  (async () => {
    window.PRODUCTS ||= [];
    await loadScripts(list(cfg.before));

    // Trang chi tiết có ?p= hợp lệ: chỉ nạp đúng 1 file, vẽ ngay, phần còn lại nạp nền
    const one = key && dataFiles.find((f) => f.file === key);
    if (cfg.single !== undefined && one) {
      await loadData([one]);
      await loadScripts(list(cfg.after));
      document.dispatchEvent(new Event("products:ready"));
      await loadData(dataFiles.filter((f) => f !== one));
      document.dispatchEvent(new Event("products:all"));
      return;
    }

    // Trang danh sách (hoặc chi tiết không có ?p= hợp lệ): nạp tất cả
    await loadData(dataFiles);
    await loadScripts(list(cfg.after));
    document.dispatchEvent(new Event("products:ready"));
    document.dispatchEvent(new Event("products:all"));
  })();
})();