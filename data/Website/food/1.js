// website food 1
window.PRODUCTS = window.PRODUCTS || [];
window.PRODUCTS.push({
  id: "website-food-1",
  file: "website-food-1",
  name: "BaoAnh Food - Food Website",
  imgs: ["assets/website/food/1/main.png", "assets/website/food/1/main1.png"],
  price: 0,
  color: "#8d8268",
  dots: ["#8d8268"],
  isNew: 1,
  kind: "case",
  brand: "BaoAnh Food",
  fit: "iPhone Duo",
  label: "Web design",
  field: "Food & Beverage",

  detail: {
    popup: true,
    eyebrow: "CASE 02 · WEB DESIGN · FOOD & BEVERAGE",
    title: "BaoAnh Food",
    lead: "A website that makes homemade flavors look as appetizing on screen as they do on the table.",
    desc: "Website design for BaoAnh Food: brand identity, menu showcase and a simple ordering flow, designed mobile-first.",
    meta: [
      { k: "Role", v: "UI/UX Designer" },
      { k: "Year", v: "2025" },
    ],
    hero: "assets/website/food/1/Brand.png",
    duo: {
      src: "assets/duo/index.html",
      outer: "assets/website/food/1/outer.jpg",
      inner: "assets/website/food/1/inner.png",
      portrait: "assets/website/food/1/inner.png",
      seated: "assets/website/food/1/inner.png",
      standing: "assets/website/food/1/System.png",
      durability: "assets/website/food/1/Brand.png",
      texts: {
        foldable: "Một thiết kế, nhiều màn hình. Kéo thanh bên dưới để mở máy và xem website Bảo Anh thích ứng từ màn hình ngoài sang màn hình trong.",
        landscape: "Màn hình mở rộng cho thấy trọn bố cục desktop: banner bia hơi, bản đồ địa chỉ và thực đơn món ăn trong một màn hình.",
        portrait: "Cầm dọc như một cuốn thực đơn: bố cục thu gọn như trên tablet, món ăn và nhận diện thương hiệu cuộn dọc dễ đọc.",
        closed: "Khi gập lại, màn hình ngoài hiển thị bản mobile: một cột, tiêu đề lớn, nút gọi món ở vị trí dễ chạm.",
        seated: "Đặt máy xuống bàn để xem thực đơn và hình ảnh món ăn ở góc nhìn thoải mái, như đang cầm menu ngay tại quán.",
        standing: "Dựng máy hình chữ A để trưng bày hệ thống nhận diện như một tấm menu đặt trên bàn: bảng màu và kiểu chữ nhìn rõ từ xa.",
        durability: "Đỏ, vàng và kem giấy cũ được dùng nhất quán trên mọi màn hình, từ banner bia hơi đến bảng giới thiệu và thực đơn món ăn."
      },
      figma:
        "https://www.figma.com/proto/p06yrWVlYtWGYPVqydEArV/amthuc_tranquangnam?node-id=1734-278&p=f&t=9aGvLjrXbsKge9ni-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1734%3A278",
    },
    sections: [
      /* ---------- 01 ---------- */
      {
        label: "Context & Challenge",
        title: "A beer house with a lively street atmosphere, and a website that must carry it",
        text: "Bia Hoi Bao Anh is a casual beer house serving local dishes. The website had to show the place, the menu and the address, and make people want to drop by.",
        blocks: [
          {
            type: "cards",
            items: [
              { n: "01", t: "The noisy, friendly feel of the place is hard to show on a screen" },
              { n: "02", t: "A long menu of dishes and drinks can make the page crowded" },
              { n: "03", t: "A new place needs people to find the address and opening hours fast" },
              { n: "04", t: "Visitors should be guided to one action: find the way or call" }
            ]
          }
        ]
      },

      /* ---------- 02 ---------- */
      {
        label: "Analysis",
        title: "From the visitor's journey, find where people may leave",
        text: "Looking at the path from landing on the page to deciding to visit, there are a few points where visitors tend to stop.",
        blocks: [
          { type: "callout", text: "Biggest bottleneck: visitors must see the place, the signature dishes and the address on the first screen." },
          {
            type: "graph",
            dark: true,
            cols: 3,
            nodes: [
              { id: "a", t: "Land on page",     d: "Google · social media",         c: 2, r: 1 },
              { id: "b", t: "First screen",     d: "Banner · map pin · logo",       c: 2, r: 2 },
              { id: "c", t: "Look at the menu", d: "Dishes · drinks · prices",      c: 1, r: 3 },
              { id: "d", t: "Find the place",   d: "Address · opening hours",       c: 3, r: 3 },
              { id: "e", t: "Visit or call",    d: "Directions or hotline",         c: 2, r: 4, hl: true }
            ],
            edges: [
              ["a","b"], ["b","c"], ["b","d"], ["c","e"], ["d","e"]
            ]
          }
        ]
      },

      /* ---------- 03 ---------- */
      {
        label: "Brand System",
        title: "Red, yellow and aged-paper cream, used the same way on every screen",
        text: "The identity borrows from old beer-house signs: strong red and golden yellow for energy, and a kraft-paper cream for warmth. One type system keeps headings and menu text readable.",
        blocks: [
          { type: "image", src: "assets/website/food/1/System.png", alt: "Color and typography system" },
          {
            type: "chips",
            items: [
              { v: "Red and yellow for energy and appetite" },
              { v: "Aged-paper cream for a warm, handmade feel" },
              { v: "Bold headings, simple text for the menu" }
            ]
          }
        ]
      },

      /* ---------- 04 ---------- */
      {
        label: "Interface Design",
        title: "Make the first screen show the place, the address and the signature dishes",
        text: "The layout is built in three steps: a banner that shows the place, a menu with real food photos, and a short intro that tells the story of the house.",
        blocks: [
          {
            type: "module",
            tag: "Step 1",
            title: "A banner with the street scene and the map pin",
            text: "A large illustration of the street, a cold beer glass and red map pins tell visitors where the place is before they read a word.",
            chips: [
              { k: "Before", v: "Address buried at the bottom" },
              { k: "After", v: "Map pin on the first screen" },
              { k: "Result", v: "Easier to find the place" }
            ],
            img: "assets/website/food/1/Brand.png"
          },
          {
            type: "module",
            tag: "Step 2",
            title: "Menu with real food photos",
            text: "Dishes and drinks are shown as photos on a cream background, grouped so visitors can scan the menu without scrolling through long text.",
            chips: [
              { k: "Before", v: "Text-only menu" },
              { k: "After", v: "Photos plus short names" },
              { k: "Result", v: "More appetizing, easier to scan" }
            ],
            img: "assets/website/food/1/main.png"
          }
        ]
      },

      /* ---------- 05 ---------- */
      {
        label: "Method & Result",
        title: "A clear design process for a food and beverage website",
        text: "From this project, the process goes from brand feeling to the visitor's action, and can be reused for the next food and drink websites.",
        blocks: [
          {
            type: "flow",
            items: ["Understand the brand", "User flow & wireframe", "Visual design", "Check on all devices", "Keep improving"]
          },
          {
            type: "metrics",
            items: [
              { k: "Main colors", v: "3", d: "Red, yellow and cream, used on every screen" },
              { k: "Key actions", v: "2", d: "Find the place, or call to book a table" }
            ]
          },
          { type: "image", src: "assets/website/food/1/main1.png", alt: "Final result" }
        ]
      }
    ],
    contact: {
      email: "ban@email.com",
      chatLabel: "Zalo",
      chat: "0123 456 789",
      cv: "assets/cv.pdf",
    },
  },
});
