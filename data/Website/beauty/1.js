// website 1
window.PRODUCTS = window.PRODUCTS || [];
window.PRODUCTS.push({
  id: "website-beauty-1",
  file: "beauty-1",
  name: "CoEm de T Beauty & More - Website Spa",
  imgs: [
    "assets/website/beauty/1/main.png",
    "assets/website/beauty/1/main1.png"
  ],
  price: 0,
  color: "#8d8268",
  dots: [
    "#8d8268",
    "#c9c5bb"
  ],
  isNew: 1,
  kind: "case",
  brand: "CoEm de T",
  fit: "iPhone Duo",
  label: "Web design",
  field: "Spa & Beauty",

  detail: {
    eyebrow: "CASE 01 · WEB DESIGN · SPA & BEAUTY",
    title: "CoEm de T Beauty & More: thiết kế website spa mang cảm giác thư giãn",
    lead: "Từ không gian spa ấm áp tông nâu và xanh olive đến một trang web giúp khách cảm nhận được sự thư giãn ngay từ màn hình đầu tiên.",
    desc: "Thiết kế landing page cho CoEm de T tại Quận 3, TP.HCM: giới thiệu không gian, ưu đãi khai trương, video TikTok, feedback khách hàng, blog chia sẻ và biểu mẫu liên hệ.",
    meta: [
      { k: "Vai trò", v: "UI/UX Designer" },
      { k: "Thời gian", v: "2025" },
      { k: "Phạm vi", v: "Landing Page / Brand Look / Responsive" },
      { k: "Phối hợp", v: "Nasani / Khách hàng spa" }
    ],
    hero: "assets/website/beauty/1/img.png",
    duo: {
      src: "assets/duo/index.html",
      outer: "assets/website/beauty/1/outer.png",
      inner: "assets/website/beauty/1/inner.png",
      portrait: "assets/website/beauty/1/portrait.png",
      figma: "https://www.figma.com/design/LINK-FIGMA-THAT-CUA-BAN"
    },
    sections: [
      /* ---------- 01 ---------- */
      {
        label: "Bối cảnh & Thách thức",
        title: "Spa đẹp ngoài đời nhưng website phải truyền được cảm giác đó",
        text: "CoEm de T là spa mới mở, có nhiều dịch vụ như massage, gội đầu thư giãn, nail và mi. Website cần giới thiệu không gian, tạo sự tin tưởng và khiến khách muốn đến trải nghiệm.",
        blocks: [
          {
            type: "cards",
            items: [
              { n: "01", t: "Cảm giác thư giãn của không gian thật khó truyền qua màn hình" },
              { n: "02", t: "Bảng giá nail, mi, gội đầu dày chữ, dễ làm trang rối" },
              { n: "03", t: "Khách mới chưa biết spa nên cần thấy uy tín ngay từ đầu" },
              { n: "04", t: "Cần dẫn khách đến hành động: xem địa chỉ, gọi hotline, gửi thông tin" }
            ]
          }
        ]
      },

      /* ---------- 02 ---------- */
      {
        label: "Phân tích & xác định vấn đề",
        title: "Từ hành trình của khách, xác định các điểm dễ rời đi",
        text: "Quan sát luồng từ lúc khách vào trang đến lúc quyết định đặt lịch, có ba điểm khách thường dừng lại hoặc rời đi.",
        blocks: [
          { type: "callout", text: "Điểm nghẽn lớn nhất: spa mới mở nên khách chưa biết, và cần thấy ngay không gian, giá ưu đãi và địa chỉ ở màn hình đầu tiên." },
          {
            type: "graph",
            dark: true,

            cols: 5,
            nodes: [
              { id: "a", t: "Vào trang",            d: "Google · TikTok · Zalo",          c: 3, r: 1 },
              { id: "b", t: "Xem màn hình đầu",     d: "3 ảnh vòm · bảng chào mừng",      c: 3, r: 2 },
              { id: "c", t: "Đủ tin tưởng chưa?",   d: "Không gian · giá · địa chỉ",      c: 3, r: 3 },
              { id: "d", t: "Đã tin tưởng",         d: "Thấy ưu đãi 70k, không gian rõ",  c: 1, r: 4 },
              { id: "e", t: "Chưa rõ spa",          d: "Cần thấy người thật dùng",        c: 3, r: 4 },
              { id: "f", t: "Cần biết đường đi",    d: "Tìm địa chỉ ở Quận 3",            c: 5, r: 4 },
              { id: "h", t: "Xem video + feedback", d: "Video TikTok · khách thật",       c: 2, r: 5 },
              { id: "i", t: "Xem bản đồ",           d: "Địa chỉ · hotline",               c: 4, r: 5 },
              { id: "g", t: "Gọi / đặt lịch",       d: "Hotline hoặc form đăng ký",       c: 3, r: 6, hl: true }
            ],
            edges: [
              ["a","b"], ["b","c"],
              ["c","d","side"], ["c","e"], ["c","f","side"],
              ["d","g","vh"],
              ["e","h"], ["f","i"],
              ["h","g"], ["i","g"]
            ]
          }
        ]
      },

      /* ---------- 03 ---------- */
      {
        label: "Kiến trúc thông tin",
        title: "Menu sáu mục, nội dung xếp theo nhịp cảm xúc, bằng chứng, hành động",
        text: "Trang một cột cuộn dọc, menu đầu trang gồm Trang Chủ, Giới Thiệu, Dịch Vụ, Blog Chia Sẻ, Thư Viện và Liên Hệ. Mỗi mục gom một nhóm nội dung riêng. Khi cuộn trang chủ, nội dung xếp theo nhịp khách đọc: giới thiệu, xem ưu đãi, thấy không gian, tin bằng người thật, rồi mới đến liên hệ.",
        blocks: [
          {
            type: "graph",
            dark: true,
            cols: 5,
            nodes: [
              { id: "a",  t: "Trang chủ",        d: "Cuộn dọc · hero 3 ảnh vòm", c: 3, r: 1 },
              { id: "b",  t: "Giới Thiệu",       d: "Cảm xúc đầu tiên",       c: 1, r: 2 },
              { id: "c",  t: "Dịch Vụ",          d: "Bảng giá & ưu đãi",      c: 2, r: 2 },
              { id: "d",  t: "Blog Chia Sẻ",     d: "Câu chuyện làm đẹp",     c: 3, r: 2 },
              { id: "e",  t: "Thư Viện",         d: "Bằng chứng thật",        c: 4, r: 2 },
              { id: "f",  t: "Liên Hệ",          d: "Hành động cuối",         c: 5, r: 2, hl: true },
              { id: "b2", t: "Giới thiệu",                   d: "Tagline viết tay · 4 điểm mạnh", c: 1, r: 3 },
              { id: "c2", t: "Cuốn sổ dịch vụ",              d: "Nail · Mi · Gội đầu",   c: 2, r: 3 },
              { id: "d2", t: "2 bài viết",                   d: "Nail & Gội đầu spa",    c: 3, r: 3 },
              { id: "e2", t: "Gallery · video · feedback",   d: "Ảnh lệch nhịp · video lướt ngang", c: 4, r: 3 },
              { id: "f2", t: "Form · bản đồ · hotline",      d: "Gom một chỗ",           c: 5, r: 3 }
            ],
            edges: [
              ["a","b","side"], ["a","c"], ["a","d"], ["a","e"], ["a","f","side"],
              ["b","b2"], ["c","c2"], ["d","d2"], ["e","e2"], ["f","f2"]
            ]
          }
        ]
      },

      /* ---------- 03b ---------- */
      {
        label: "Cấu trúc trang chủ",
        title: "Cảm xúc trước, bằng chứng ở giữa, hành động ở cuối",
        text: "Các khối được xếp theo nhịp khách đọc: chào mừng và giới thiệu, xem giá ưu đãi, thấy không gian, tin bằng người thật, đọc thêm ở blog, rồi mới đến liên hệ.",
        blocks: [
          {
            type: "graph",
            dark: true,
            cols: 3,
            nodes: [
              { id: "a", t: "Hero & chào mừng",      d: "Cảm xúc · 3 ảnh vòm, địa chỉ, hotline", c: 2, r: 1 },
              { id: "b", t: "Giới thiệu",            d: "Cảm xúc · tagline viết tay, 4 điểm mạnh", c: 2, r: 2 },
              { id: "c", t: "Dịch vụ & ưu đãi",      d: "Thông tin · sổ dịch vụ, bảng giá", c: 2, r: 3 },
              { id: "d", t: "Không gian",            d: "Cảm xúc · gallery lệch nhịp",     c: 2, r: 4 },
              { id: "e", t: "Video TikTok",          d: "Bằng chứng · video lướt ngang, lượt xem",  c: 1, r: 5 },
              { id: "f", t: "Feedback khách hàng",   d: "Bằng chứng · ảnh chân dung",      c: 3, r: 5 },
              { id: "g", t: "Blog chia sẻ",          d: "Thông tin · 2 bài viết",          c: 2, r: 6 },
              { id: "h", t: "Liên hệ + bản đồ",      d: "Hành động · form, hotline, bản đồ", c: 2, r: 7, hl: true }
            ],
            edges: [
              ["a","b"], ["b","c"], ["c","d"],
              ["d","e"], ["d","f"],
              ["e","g"], ["f","g"],
              ["g","h"]
            ]
          },
          // { type: "image", src: "assets/website/beauty/1/lamdep_lethithaotam_1156625_t8.png", alt: "Toàn bộ trang chủ" }
        ]
      },

      /* ---------- 03c ---------- */
      {
        label: "Luồng người dùng",
        title: "Rút ngắn đường từ lúc vào trang đến lúc gọi hoặc gửi form",
        text: "So sánh luồng trước khi thiết kế lại (khách tự tìm không gian và địa chỉ) với luồng mới, nơi bảng chào mừng màu olive đưa địa chỉ và hotline lên ngay màn hình đầu.",
        blocks: [
          {
            type: "graph",
            dark: true,
            cols: 5,
            nodes: [
              { id: "s",  t: "Vào trang",                 d: "Điểm vào chung",                          c: 3, r: 1 },
              { id: "a2", t: "Xem không gian",            d: "Luồng cũ · chưa rõ ở màn hình đầu",       c: 1, r: 2 },
              { id: "a3", t: "Cuộn tìm dịch vụ & ưu đãi", d: "Luồng cũ · nhiều khối, dễ rối",           c: 1, r: 3 },
              { id: "a4", t: "Tìm địa chỉ",               d: "Luồng cũ · thêm một bước",                c: 1, r: 4 },
              { id: "b2", t: "Màn hình đầu",              d: "Luồng mới · ảnh vòm · địa chỉ · hotline", c: 5, r: 2 },
              { id: "b3", t: "Cuộn xem bằng chứng",       d: "Luồng mới · video · feedback nếu cần",    c: 5, r: 3 },
              { id: "g",  t: "Gọi / gửi form",            d: "Hotline hoặc form ngắn",                  c: 3, r: 5, hl: true }
            ],
            edges: [
              ["s","a2","vh"], ["a2","a3"], ["a3","a4"], ["a4","g","vh"],
              ["s","b2","vh"], ["b2","b3"], ["b3","g","vh"], ["b2","g","vh"]
            ]
          }
        ]
      },

      /* ---------- 03d ---------- */
      {
        label: "Wireframe",
        title: "Dựng khung sườn cả trang trước khi thêm màu và ảnh",
        text: "Wireframe xếp sẵn tám khối theo nhịp đã chọn: hero, giới thiệu, ưu đãi, không gian, video, feedback, blog và liên hệ. Chốt chỗ cho từng khối rồi mới thêm màu, chữ và hình ảnh.",
        blocks: [
          { type: "image", src: "assets/website/beauty/1/wireframe.png", alt: "Wireframe giao diện mobile", trim: true }
        ]
      },

      /* ---------- 04 ---------- */
      {
        label: "Thiết kế & tối ưu giao diện",
        title: "Từ lần đầu ghé trang đến lúc để lại thông tin, làm gọn từng bước",
        text: "Từ wireframe đã chốt, hoàn thiện giao diện và tối ưu thêm ba điểm: không gian, video và đánh giá, liên hệ.",
        blocks: [
          {
            type: "module",
            tag: "Bước 1",
            title: "Thư viện không gian bố cục lệch nhịp",
            text: "Ảnh phòng spa, ảnh dịch vụ và câu tagline viết tay “Chăm chút từng chi tiết, nâng niu từng khoảnh khắc” đặt xen kẽ trên nền nâu, để mắt khách di chuyển tự nhiên, không bị đơn điệu.",
            chips: [
              { k: "Trước", v: "Ảnh xếp lưới đều, ít cảm xúc" },
              { k: "Sau", v: "Bố cục lệch nhịp + tagline" },
              { k: "Kết quả", v: "Dễ cảm nhận không gian" }
            ],
            img: "assets/website/beauty/1/img.png"
          },
          {
            type: "module",
            tag: "Bước 2",
            title: "Video TikTok và feedback tạo niềm tin",
            text: "Các video TikTok dọc kèm lượt xem lướt ngang qua bên trái, cùng khung feedback có ảnh chân dung tròn và dải ảnh nhỏ để chuyển giữa các khách, giúp khách mới thấy spa có người thật sử dụng.",
            chips: [
              { k: "Trước", v: "Chỉ có chữ giới thiệu" },
              { k: "Sau", v: "Video + feedback" },
              { k: "Kết quả", v: "Tăng độ tin cậy" }
            ],
            imgs: [
              "assets/website/beauty/1/Video.png",
              "assets/website/beauty/1/feedback.png"
            ]
          },
          {
            type: "module",
            tag: "Bước 3",
            title: "Biểu mẫu liên hệ ngắn cạnh bản đồ",
            text: "Chỉ hỏi họ tên, số điện thoại, email và nội dung, kết thúc bằng một nút olive “Gửi thông tin ngay”. Bên cạnh là địa chỉ, hotline, mạng xã hội và bản đồ.",
            chips: [
              { k: "Trước", v: "Thông tin liên hệ rải rác" },
              { k: "Sau", v: "Form + bản đồ một chỗ" },
              { k: "Kết quả", v: "Gửi thông tin dễ hơn" }
            ],
            img: "assets/website/beauty/1/register.png"
          }
        ]
      },

      /* ---------- 05 ---------- */
      {
        label: "Khách hàng & đa thiết bị",
        title: "Khách chủ yếu xem bằng điện thoại, nên mobile phải đẹp trước",
        text: "Khách spa thường tìm kiếm và xem trang bằng điện thoại, nên giao diện được kiểm tra trên mobile, tablet và desktop để bố cục không vỡ.",
        blocks: [
          { type: "callout", text: "Một thiết kế, ba cách hiển thị: ba ảnh vòm xếp hàng ngang trên desktop, thu gọn dần thành một cột trên mobile." },
          {
            type: "devices",
            active: "desktop",
            items: [
              { key: "desktop", label: "Desktop", title: "Desktop.", desc: "Ba ảnh vòm xếp hàng ngang, đủ chỗ cho dịch vụ, ưu đãi và bản đồ trong một màn hình.", src: "assets/website/beauty/1/lapptop.png", alt: "Giao diện trên laptop" },
              { key: "tablet",  label: "Tablet",  title: "Tablet.",  desc: "Bố cục thu gọn dần, vẫn giữ nhịp: cảm xúc trước, bằng chứng ở giữa, hành động ở cuối.", src: "assets/website/beauty/1/tabblet.png", alt: "Giao diện trên tablet" },
              { key: "mobile",  label: "Mobile",  title: "Mobile.",  desc: "Một cột, nút gọi và biểu mẫu đặt ở vị trí dễ chạm. Đây là bản được thiết kế trước.", src: "assets/website/beauty/1/Phone.png", alt: "Giao diện trên điện thoại" }
            ]
          }
        ]
      },

      /* ---------- 06 ---------- */
      {
        label: "Phương pháp & Kết quả",
        title: "Một quy trình thiết kế rõ ràng cho website thương hiệu dịch vụ",
        text: "Từ dự án này, rút ra quy trình đi từ cảm xúc thương hiệu đến hành động của khách, áp dụng cho các website spa và làm đẹp tiếp theo.",
        blocks: [
          {
            type: "flow",
            items: ["Hiểu thương hiệu & khách hàng", "Luồng người dùng & wireframe", "Thiết kế giao diện", "Kiểm tra đa thiết bị", "Tối ưu liên tục"]
          },
          {
            type: "metrics",
            items: [
              { k: "Khối nội dung trên trang chủ", v: "8", d: "Từ hero, ưu đãi, video, feedback đến blog và liên hệ" },
              { k: "Màu chủ đạo", v: "3", d: "Nâu ấm, xanh olive và kem be, dùng nhất quán toàn trang" }
            ]
          },
          {
            type: "chips",
            items: [
              { v: "Ảnh vòm và họa tiết lá tạo bản sắc" },
              { v: "Chữ viết tay cho tagline, chữ serif cho tiêu đề" },
              { v: "Dẫn khách đến địa chỉ, hotline và form liên hệ" }
            ]
          },
          { type: "image", src: "assets/website/beauty/1/inner.png", alt: "Kết quả" }
        ]
      }
    ],

    contact: {
      email: "ban@email.com",
      chatLabel: "Zalo",
      chat: "0123 456 789",
      cv: "assets/cv.pdf"
    }
  }
});