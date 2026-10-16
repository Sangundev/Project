// Mobbile 1
(window.PRODUCTS ||= []).push({
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
    eyebrow: "CASE 01 · PRODUCT DESIGN · ACCESSORIES",
    title: "iPhone Duo Folio: thiết kế trải nghiệm ốp lưng có chân đế",
    lead: "Từ nhu cầu dùng điện thoại hằng ngày đến một sản phẩm bảo vệ gọn nhẹ, dễ dùng và có chân đế tiện lợi.",
    desc: "Dự án thử nghiệm giao diện trưng bày phụ kiện: từ trang danh sách, bộ lọc, đến trang chi tiết dùng chung cho mọi sản phẩm. Nội dung dưới đây là dữ liệu mẫu để kiểm tra bố cục.",
    meta: [
      { k: "Vai trò", v: "UI/UX Designer & Front-end" },
      { k: "Thời gian", v: "2026" },
      { k: "Phạm vi", v: "Product Listing / Filter / Detail Page" },
      { k: "Phối hợp", v: "Cá nhân / Dự án minh họa" }
    ],
    hero: "assets/mobbile/Mobbile1/0.png",

    sections: [
      /* ---------- 01 ---------- */
      {
        label: "Bối cảnh & Thách thức",
        title: "Sản phẩm đẹp nhưng người dùng khó so sánh và khó chọn",
        text: "Danh mục phụ kiện có nhiều màu, nhiều dòng máy tương thích. Người dùng cần lọc nhanh, nhìn rõ sản phẩm và hiểu ngay sự khác biệt giữa các lựa chọn.",
        blocks: [
          {
            type: "cards",
            items: [
              { n: "01", t: "Nhiều biến thể màu sắc, khó hình dung khi chỉ có một ảnh" },
              { n: "02", t: "Dòng máy tương thích dễ chọn nhầm" },
              { n: "03", t: "Bộ lọc trên mobile chiếm nhiều diện tích màn hình" },
              { n: "04", t: "Trang chi tiết mỗi sản phẩm lại làm một kiểu, khó bảo trì" }
            ]
          },
          { type: "image", src: "assets/mobbile/Mobbile1/1.png", alt: "Tổng quan bối cảnh" }
        ]
      },

      /* ---------- 02 ---------- */
      {
        label: "Vấn đề phát hiện",
        title: "Từ hành trình chọn mua, xác định các điểm gây khó khăn",
        text: "Quan sát luồng từ lúc vào danh mục đến lúc quyết định, có ba điểm người dùng thường dừng lại hoặc rời đi.",
        blocks: [
          { type: "callout", text: "Điểm nghẽn lớn nhất: người dùng không thấy ngay sản phẩm nào hợp với máy của mình." },
          { type: "image", src: "assets/mobbile/Mobbile1/2.png", alt: "Hành trình chọn mua" }
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
        label: "Tối ưu luồng chọn mua",
        title: "Từ danh sách đến quyết định, làm gọn từng bước",
        text: "Sau kiểm chứng, giữ lại các giải pháp hiệu quả và tối ưu thêm ở ba điểm: lọc, so sánh và xem chi tiết.",
        blocks: [
          {
            type: "module",
            tag: "Bước 1",
            title: "Bộ lọc kính mờ trên desktop",
            text: "Các pill mở panel kính mờ, chọn xong thấy kết quả đổi ngay.",
            chips: [
              { k: "Trước", v: "Danh sách dài, không lọc" },
              { k: "Sau", v: "Pill + panel" },
              { k: "Kết quả", v: "Tìm nhanh hơn" }
            ],
            img: "assets/mobbile/Mobbile1/4.1.png"
          },
          {
            type: "module",
            tag: "Bước 2",
            title: "Bảng lọc trượt từ dưới lên trên mobile",
            text: "Một nút Bộ lọc mở bảng toàn màn hình dạng accordion, có số mục đã chọn.",
            chips: [
              { k: "Trước", v: "Bộ lọc chiếm màn hình" },
              { k: "Sau", v: "Bảng trượt accordion" },
              { k: "Kết quả", v: "Gọn, dễ thao tác" }
            ],
            img: "assets/mobbile/Mobbile1/4.2.png"
          },
          {
            type: "module",
            tag: "Bước 3",
            title: "Trang chi tiết dùng chung một khung",
            text: "Mọi sản phẩm cùng một bố cục, nội dung lấy từ dữ liệu riêng của từng dự án.",
            chips: [
              { k: "Trước", v: "Mỗi trang một kiểu" },
              { k: "Sau", v: "Một khung dùng chung" },
              { k: "Kết quả", v: "Dễ bảo trì" }
            ],
            img: "assets/mobbile/Mobbile1/4.3.png"
          }
        ]
      },

      /* ---------- 05 ---------- */
      {
        label: "Thị trường & đa thiết bị",
        title: "Cùng một trải nghiệm, nhưng phải khớp từng kích thước màn hình",
        text: "Giao diện được kiểm tra trên desktop, tablet và mobile để đảm bảo bố cục không vỡ.",
        blocks: [
          { type: "callout", text: "Một thiết kế, ba cách hiển thị: lưới 4 cột, 2 cột và 1 cột tùy theo chiều rộng màn hình." },
          { type: "image", src: "assets/mobbile/Mobbile1/5.png", alt: "Hiển thị đa thiết bị" }
        ]
      },

      /* ---------- 06 ---------- */
      {
        label: "Phương pháp & Kết quả",
        title: "Một quy trình lặp lại được cho mọi dự án mới",
        text: "Từ dự án này, rút ra quy trình thiết kế dựa trên quan sát và kiểm chứng, áp dụng cho các sản phẩm tiếp theo.",
        blocks: [
          {
            type: "flow",
            items: ["Hiểu người dùng", "Phân tích dữ liệu", "Đề xuất giải pháp", "Thử nghiệm", "Tối ưu liên tục"]
          },
          {
            type: "metrics",
            items: [
              { k: "Số trang chi tiết cần viết", v: "13 → 1", d: "Mobbile + Website dùng chung một khung" },
              { k: "Thời gian thêm dự án mới", v: "≈ 5 phút", d: "Chỉ cần tạo file dữ liệu và thêm ảnh" }
            ]
          },
          {
            type: "chips",
            items: [
              { v: "Một khung HTML dùng chung" },
              { v: "Dữ liệu tách riêng từng dự án" },
              { v: "Thêm dự án không cần viết lại giao diện" }
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