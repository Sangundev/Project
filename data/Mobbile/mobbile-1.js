// Mobbile 1
window.PRODUCTS = window.PRODUCTS || [];
window.PRODUCTS.push({
  id: "mobbile-1",
  name: "iPhone Duo Folio có Chân Đế - Nâu Xám",
  imgs: [
    "assets/mobbile/1.png",
    "assets/mobbile/2.png",
    "assets/mobbile/3.png"
  ],
  price: 3799000,
  color: "#8d8268",
  dots: [
    "#8d8268",
    "#c9c5bb"
  ],
  isNew: 1,
  kind: "case",
  brand: "Apple",
  fit: "iPhone Duo",

  detail: {
    eyebrow: "CASE 01 · WEB DESIGN · SPA & BEAUTY",
    title: "CoEmde T Beauty & More: thiết kế website spa mang cảm giác thư giãn",
    lead: "Từ không gian spa ấm áp tông nâu và xanh olive đến một trang web giúp khách cảm nhận được sự thư giãn ngay từ màn hình đầu tiên.",
    desc: "Thiết kế landing page cho CoEmde T tại TP.HCM: giới thiệu không gian, dịch vụ, ưu đãi khai trương, video, đánh giá khách hàng và biểu mẫu liên hệ.",
    meta: [
      { k: "Vai trò", v: "UI/UX Designer" },
      { k: "Thời gian", v: "2025" },
      { k: "Phạm vi", v: "Landing Page / Brand Look / Responsive" },
      { k: "Phối hợp", v: "Nasani / Khách hàng spa" }
    ],
    hero: "assets/mobbile/Mobbile1/0.png",
    duo: {
      src: "assets/duo/index.html",
      outer: "assets/mobbile/Mobbile1/outer.png",
      inner: "assets/mobbile/Mobbile1/inner.png",
      portrait: "assets/mobbile/Mobbile1/portrait.png"
    },
    sections: [
      /* ---------- 01 ---------- */
      {
        label: "Bối cảnh & Thách thức",
        title: "Spa đẹp ngoài đời nhưng website phải truyền được cảm giác đó",
        text: "CoEmde T là spa mới mở, có nhiều dịch vụ như massage, gội đầu thư giãn, nail và mi. Website cần giới thiệu không gian, tạo sự tin tưởng và khiến khách muốn đến trải nghiệm.",
        blocks: [
          {
            type: "cards",
            items: [
              { n: "01", t: "Cảm giác thư giãn của không gian thật khó truyền qua màn hình" },
              { n: "02", t: "Nhiều dịch vụ và ưu đãi dễ làm trang rối" },
              { n: "03", t: "Khách mới chưa biết spa nên cần thấy uy tín ngay từ đầu" },
              { n: "04", t: "Cần dẫn khách đến hành động: xem địa chỉ, gọi hotline, gửi thông tin" }
            ]
          },
          { type: "image", src: "assets/mobbile/Mobbile1/1.png", alt: "Tổng quan bối cảnh" }
        ]
      },

      /* ---------- 02 ---------- */
      {
        label: "Vấn đề phát hiện",
        title: "Từ hành trình của khách, xác định các điểm dễ rời đi",
        text: "Quan sát luồng từ lúc khách vào trang đến lúc quyết định đặt lịch, có ba điểm khách thường dừng lại hoặc rời đi.",
        blocks: [
          { type: "callout", text: "Điểm nghẽn lớn nhất: khách chưa thấy ngay không gian, dịch vụ và địa chỉ của spa ở màn hình đầu tiên." },
          { type: "image", src: "assets/mobbile/Mobbile1/2.png", alt: "Hành trình khách xem trang và đặt lịch spa" }
        ]
      },

      /* ---------- 03 ---------- */
      {
        label: "Giả thuyết & Kiểm chứng",
        title: "Từ quan sát, đưa ra giả thuyết và thử nghiệm trên giao diện thật",
        text: "Mỗi giả thuyết được dựng thành giao diện thử nghiệm riêng, kiểm tra xem người dùng có chọn nhanh và đúng hơn hay không.",
        blocks: [
          {
            type: "module",
            tag: "Giả thuyết 1",
            title: "Thư viện ảnh trượt giúp hình dung sản phẩm rõ hơn",
            text: "Ảnh trượt mượt, chấm báo trang cho biết còn bao nhiêu góc nhìn mà không cần mở trang khác.",
            img: "assets/mobbile/Mobbile1/3.1.png"
          },
          {
            type: "module",
            tag: "Giả thuyết 2",
            title: "Chấm màu hiển thị ngay các lựa chọn có sẵn",
            text: "Người dùng thấy toàn bộ phiên bản màu ngay trên thẻ sản phẩm, không cần vào trang chi tiết để biết.",
            img: "assets/mobbile/Mobbile1/3.2.png"
          },
          {
            type: "module",
            tag: "Giả thuyết 3",
            title: "Nhãn dòng máy tương thích đặt cạnh tên sản phẩm",
            text: "Thông tin tương thích được đưa lên ngay vị trí dễ thấy để giảm nhầm lẫn khi chọn.",
            img: "assets/mobbile/Mobbile1/3.3.png"
          }
        ]
      },

      /* ---------- 04 ---------- */
      {
        label: "Tối ưu luồng trải nghiệm",
        title: "Từ lần đầu ghé trang đến lúc để lại thông tin, làm gọn từng bước",
        text: "Sau kiểm chứng, giữ lại các giải pháp hiệu quả và tối ưu thêm ba điểm: không gian, video và đánh giá, liên hệ.",
        blocks: [
          {
            type: "module",
            tag: "Bước 1",
            title: "Thư viện không gian bố cục lệch nhịp",
            text: "Ảnh phòng spa, ảnh dịch vụ và câu tagline viết tay đặt xen kẽ để mắt khách di chuyển tự nhiên, không bị đơn điệu.",
            chips: [
              { k: "Trước", v: "Ảnh xếp lưới đều, ít cảm xúc" },
              { k: "Sau", v: "Bố cục lệch nhịp + tagline" },
              { k: "Kết quả", v: "Dễ cảm nhận không gian" }
            ],
            img: "assets/mobbile/Mobbile1/4.1.png"
          },
          {
            type: "module",
            tag: "Bước 2",
            title: "Video TikTok và feedback tạo niềm tin",
            text: "Ba video dọc kèm lượt xem và khung đánh giá của khách có ảnh chân dung giúp khách mới thấy spa có người thật sử dụng.",
            chips: [
              { k: "Trước", v: "Chỉ có chữ giới thiệu" },
              { k: "Sau", v: "Video + feedback" },
              { k: "Kết quả", v: "Tăng độ tin cậy" }
            ],
            img: "assets/mobbile/Mobbile1/4.2.png"
          },
          {
            type: "module",
            tag: "Bước 3",
            title: "Biểu mẫu liên hệ ngắn cạnh bản đồ",
            text: "Chỉ hỏi họ tên, số điện thoại, email và nội dung. Bản đồ, địa chỉ và các mạng xã hội đặt ngay bên cạnh.",
            chips: [
              { k: "Trước", v: "Thông tin liên hệ rải rác" },
              { k: "Sau", v: "Form + bản đồ một chỗ" },
              { k: "Kết quả", v: "Gửi thông tin dễ hơn" }
            ],
            img: "assets/mobbile/Mobbile1/4.3.png"
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
          { type: "image", src: "assets/mobbile/Mobbile1/5.png", alt: "Hiển thị đa thiết bị" }
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
            items: ["Hiểu thương hiệu", "Chọn tông màu & hình ảnh", "Dựng bố cục", "Kiểm tra mobile", "Tối ưu liên tục"]
          },
          {
            type: "metrics",
            items: [
              { k: "Khối nội dung trên trang chủ", v: "10", d: "Từ hero, dịch vụ, ưu đãi đến liên hệ" },
              { k: "Màu chủ đạo", v: "2", d: "Nâu ấm và xanh olive, dùng nhất quán toàn trang" }
            ]
          },
          {
            type: "chips",
            items: [
              { v: "Tông nâu ấm kết hợp xanh olive" },
              { v: "Ảnh vòm và họa tiết lá tạo bản sắc" },
              { v: "Dẫn khách đến địa chỉ, hotline và form liên hệ" }
            ]
          },
          { type: "image", src: "assets/mobbile/Mobbile1/6.png", alt: "Kết quả" }
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