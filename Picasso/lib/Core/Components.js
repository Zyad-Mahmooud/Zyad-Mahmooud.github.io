var componentsList = [
{
  css: `
    /* الحاوية الرئيسية (المملكة) */
    .grid-container {
      display: grid;
      /* إنشاء 4 أعمدة و 4 صفوف متساوية المساحة */
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(4, 1fr);
      
      /* 🗺️ رسم الخريطة الصريحة للـ 4×4: المربعات والمساحات الفارغة (.) */
      grid-template-areas: 
        "a a . b"
        ". . . b"
        ". c c ."
        "d . . .";
        
      gap: 12px;
      width: 400px;
      height: 400px;
      background-color: #1a1a1a;
      padding: 15px;
      border-radius: 12px;
      box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.7);
    }

    /* التنسيق العام للمربعات (الجزر المعزولة) */
    .box {
      color: #000;
      font-weight: bold;
      font-family: sans-serif;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    }

    .box:hover {
      transform: scale(1.03);
    }

    /* 📌 ربط كل صندوق بمنطقته الجغرافية الصريحة بدلاً من الـ Lines */

    /* المربع الأول: يأخذ المنطقة a (الصف الأول، أول عمودين) */
    .box-1 {
      background: linear-gradient(135deg, #ff4757, #ff6b81);
      grid-area: a;
    }

    /* المربع الثاني: يأخذ المنطقة b (العمود الرابع، ممتد لصفين) */
    .box-2 {
      background: linear-gradient(135deg, gold, orange);
      grid-area: b;
    }

    /* المربع الثالث: يأخذ المنطقة c (الصف الثالث، العمود الثاني والثالث) */
    .box-3 {
      background: linear-gradient(135deg, #2ed573, #7bed9f);
      grid-area: c;
    }

    /* المربع الرابع: يأخذ المنطقة d (الصف الرابع، العمود الأول) */
    .box-4 {
      background: linear-gradient(135deg, #1e90ff, #70a1ff);
      grid-area: d;
    }`,
  html: `
  <div class="grid-container">
    <div class="box box-1">1</div>
    <div class="box box-2">2</div>
    <div class="box box-3">3</div>
    <div class="box box-4">4</div>
  </div>`,
  keywords: ["grid", "layout", "template-areas"]
},
  {
    keywords: ["app landing", "app presentation", "hero centered", "product mockup", "feature rows"],
    html: `
<div class="app-page">

  <header class="app-header">
    <div class="app-logo"></div>
    <div class="app-cta-header-btn"></div>
  </header>

  <section class="app-hero-centered">
    <div class="app-badge"></div>
    <div class="app-hero-headline"></div>
    <div class="app-hero-sub"></div>
    <div class="app-hero-actions">
      <div class="app-btn-primary"></div>
      <div class="app-btn-secondary"></div>
    </div>
    <div class="app-mockup">PRODUCT / DASHBOARD SCREENSHOT</div>
  </section>

  <section class="app-feature-rows">
    <div class="app-row">
      <div class="app-row-media"></div>
      <div class="app-row-content">
        <div class="app-row-title"></div>
        <div class="app-row-text"></div>
        <div class="app-row-text"></div>
      </div>
    </div>
    <div class="app-row app-row-reverse">
      <div class="app-row-media"></div>
      <div class="app-row-content">
        <div class="app-row-title"></div>
        <div class="app-row-text"></div>
        <div class="app-row-text"></div>
      </div>
    </div>
  </section>

  <footer class="app-footer">
    <div class="app-footer-link"></div>
    <div class="app-footer-link"></div>
  </footer>

</div>
`,
    css: `
.app-page {
  background: #fdfdfd;
  color: #333;
  line-height: 1.6;
  font-family: sans-serif;
}

.app-header {
  padding: 30px 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-logo {
  width: 100px;
  height: 30px;
  background: #ddd;
}

.app-cta-header-btn {
  width: 110px;
  height: 35px;
  background: #444;
  border-radius: 4px;
}

.app-hero-centered {
  text-align: center;
  padding: 80px 15% 40px;
}

.app-badge {
  width: 140px;
  height: 20px;
  background: #e0e0e0;
  margin: 0 auto 20px;
  border-radius: 20px;
}

.app-hero-headline {
  width: 70%;
  height: 45px;
  background: #ccc;
  margin: 0 auto 20px;
}

.app-hero-sub {
  width: 85%;
  height: 20px;
  background: #e0e0e0;
  margin: 0 auto 30px;
}

.app-hero-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 50px;
}

.app-btn-primary {
  width: 140px;
  height: 45px;
  background: #444;
  border-radius: 4px;
}

.app-btn-secondary {
  width: 140px;
  height: 45px;
  background: #e0e0e0;
  border-radius: 4px;
}

.app-mockup {
  width: 80%;
  height: 350px;
  background: #ddd;
  margin: 0 auto;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-sizing: border-box;
}

.app-feature-rows {
  padding: 80px 10%;
  background: #f4f4f6;
}

.app-row {
  display: flex;
  align-items: center;
  gap: 60px;
  margin-bottom: 60px;
}

.app-row-reverse {
  flex-direction: row-reverse;
}

.app-row-media {
  flex: 1;
  height: 250px;
  background: #ddd;
  border-radius: 6px;
}

.app-row-content {
  flex: 1;
}

.app-row-title {
  width: 50%;
  height: 25px;
  background: #ccc;
  margin-bottom: 15px;
}

.app-row-text {
  width: 90%;
  height: 15px;
  background: #e0e0e0;
  margin-bottom: 8px;
}

.app-footer {
  padding: 40px 10%;
  border-top: 2px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
}

.app-footer-link {
  width: 80px;
  height: 12px;
  background: #e0e0e0;
}
`
  },

  // ─────────────────────────────────────────────
  // 2. Blog / Magazine
  // ─────────────────────────────────────────────
  {
    keywords: ["blog", "magazine", "editorial", "featured post", "articles grid"],
    html: `
<div class="blog-page">

  <div class="blog-container">

    <header class="blog-header">
      <div class="blog-magazine-title"></div>
      <div class="blog-magazine-sub"></div>
    </header>

    <section class="blog-featured-post">
      <div class="blog-featured-img"></div>
      <div class="blog-featured-content">
        <div class="blog-meta-tag"></div>
        <div class="blog-article-headline"></div>
        <div class="blog-article-excerpt"></div>
        <div class="blog-article-excerpt"></div>
        <div class="blog-article-excerpt blog-excerpt-short"></div>
      </div>
    </section>

    <main class="blog-articles-list">
      <article class="blog-article-card">
        <div class="blog-card-img"></div>
        <div class="blog-meta-tag"></div>
        <div class="blog-card-title"></div>
        <div class="blog-card-excerpt"></div>
        <div class="blog-card-excerpt"></div>
      </article>
      <article class="blog-article-card">
        <div class="blog-card-img"></div>
        <div class="blog-meta-tag"></div>
        <div class="blog-card-title"></div>
        <div class="blog-card-excerpt"></div>
        <div class="blog-card-excerpt"></div>
      </article>
    </main>

  </div>

</div>
`,
    css: `
.blog-page {
  background: #fff;
  color: #222;
  font-family: sans-serif;
}

.blog-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  box-sizing: border-box;
}

.blog-header {
  text-align: center;
  margin-bottom: 60px;
  padding-bottom: 20px;
  border-bottom: 4px double #eee;
}

.blog-magazine-title {
  width: 300px;
  height: 40px;
  background: #222;
  margin: 0 auto 15px;
}

.blog-magazine-sub {
  width: 180px;
  height: 12px;
  background: #aaa;
  margin: 0 auto;
}

.blog-featured-post {
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid #ddd;
}

.blog-featured-img {
  flex: 1.2;
  height: 320px;
  background: #e0e0e0;
}

.blog-featured-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.blog-meta-tag {
  width: 80px;
  height: 15px;
  background: #ccc;
  margin-bottom: 15px;
}

.blog-article-headline {
  width: 90%;
  height: 32px;
  background: #333;
  margin-bottom: 15px;
}

.blog-article-excerpt {
  width: 100%;
  height: 14px;
  background: #e0e0e0;
  margin-bottom: 8px;
}

.blog-excerpt-short {
  width: 60%;
}

.blog-articles-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

.blog-article-card {
  display: flex;
  flex-direction: column;
}

.blog-card-img {
  height: 180px;
  background: #e0e0e0;
  margin-bottom: 15px;
}

.blog-card-title {
  width: 85%;
  height: 22px;
  background: #444;
  margin-bottom: 10px;
}

.blog-card-excerpt {
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  margin-bottom: 6px;
}
`
  },

  // ─────────────────────────────────────────────
  // 3. Case Study Portfolio
  // ─────────────────────────────────────────────
  {
    keywords: ["case study", "portfolio case", "case studies stack", "project showcase left-aligned"],
    html: `
<div class="cs-page">

  <header class="cs-header">
    <div class="cs-nav-left">
      <div class="cs-site-name"></div>
      <div class="cs-site-subtitle"></div>
    </div>
    <div class="cs-nav-right"></div>
  </header>

  <section class="cs-case-studies">
    <div class="cs-section-tag"></div>

    <div class="cs-case-item">
      <div class="cs-case-info">
        <div class="cs-case-number"></div>
        <div class="cs-case-title"></div>
        <div class="cs-case-desc"></div>
        <div class="cs-case-desc"></div>
        <div class="cs-case-link"></div>
      </div>
      <div class="cs-case-preview">HERO CASE IMAGE / VIDEO</div>
    </div>

    <div class="cs-case-item">
      <div class="cs-case-info">
        <div class="cs-case-number"></div>
        <div class="cs-case-title"></div>
        <div class="cs-case-desc"></div>
        <div class="cs-case-desc"></div>
        <div class="cs-case-link"></div>
      </div>
      <div class="cs-case-preview">HERO CASE IMAGE / VIDEO</div>
    </div>
  </section>

  <footer class="cs-footer-contact">
    <div class="cs-footer-prompt"></div>
    <div class="cs-footer-email"></div>
  </footer>

</div>
`,
    css: `
.cs-page {
  background: #fff;
  color: #111;
  font-family: sans-serif;
}

.cs-header {
  padding: 50px 8%;
  display: flex;
  justify-content: space-between;
}

.cs-nav-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cs-site-name {
  width: 150px;
  height: 20px;
  background: #333;
}

.cs-site-subtitle {
  width: 90px;
  height: 12px;
  background: #ccc;
}

.cs-nav-right {
  width: 80px;
  height: 20px;
  background: #e0e0e0;
}

.cs-case-studies {
  padding: 40px 8% 100px;
}

.cs-section-tag {
  width: 100px;
  height: 15px;
  background: #e0e0e0;
  margin-bottom: 40px;
}

.cs-case-item {
  display: flex;
  margin-bottom: 80px;
  gap: 40px;
}

.cs-case-info {
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cs-case-number {
  width: 30px;
  height: 15px;
  background: #ddd;
  margin-bottom: 15px;
}

.cs-case-title {
  width: 80%;
  height: 30px;
  background: #ccc;
  margin-bottom: 15px;
}

.cs-case-desc {
  width: 95%;
  height: 15px;
  background: #e0e0e0;
  margin-bottom: 8px;
}

.cs-case-link {
  width: 100px;
  height: 15px;
  background: #444;
  margin-top: 10px;
}

.cs-case-preview {
  width: 65%;
  height: 380px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.cs-footer-contact {
  padding: 80px 8%;
  background: #111;
  color: #fff;
}

.cs-footer-prompt {
  width: 300px;
  height: 35px;
  background: #555;
  margin-bottom: 20px;
}

.cs-footer-email {
  width: 200px;
  height: 20px;
  background: #888;
}
`
  },

  // ─────────────────────────────────────────────
  // 4. E-Commerce Grid
  // ─────────────────────────────────────────────
  {
    keywords: ["ecommerce", "shop", "product grid", "sidebar filters", "promo bar", "wishlist"],
    html: `
<div class="ec-page">

  <div class="ec-promo-bar"></div>

  <nav class="ec-nav">
    <div class="ec-logo"></div>
    <div class="ec-search-bar"></div>
    <div class="ec-nav-icons">
      <div class="ec-icon-placeholder"></div>
      <div class="ec-icon-placeholder"></div>
    </div>
  </nav>

  <div class="ec-shop-container">

    <aside class="ec-sidebar">
      <div class="ec-filter-group">
        <div class="ec-filter-title"></div>
        <div class="ec-filter-line"></div>
        <div class="ec-filter-line"></div>
        <div class="ec-filter-line"></div>
      </div>
      <div class="ec-filter-group">
        <div class="ec-filter-title"></div>
        <div class="ec-filter-line"></div>
        <div class="ec-filter-line"></div>
      </div>
    </aside>

    <main class="ec-products-display">
      <div class="ec-sort-bar">
        <div class="ec-sort-title"></div>
        <div class="ec-sort-dropdown"></div>
      </div>

      <div class="ec-product-grid">
        <div class="ec-product-card">
          <div class="ec-wishlist-icon"></div>
          <div class="ec-product-img">PRODUCT IMAGE</div>
          <div class="ec-product-details">
            <div class="ec-prod-title"></div>
            <div class="ec-prod-price"></div>
          </div>
        </div>
        <div class="ec-product-card">
          <div class="ec-wishlist-icon"></div>
          <div class="ec-product-img">PRODUCT IMAGE</div>
          <div class="ec-product-details">
            <div class="ec-prod-title"></div>
            <div class="ec-prod-price"></div>
          </div>
        </div>
        <div class="ec-product-card">
          <div class="ec-wishlist-icon"></div>
          <div class="ec-product-img">PRODUCT IMAGE</div>
          <div class="ec-product-details">
            <div class="ec-prod-title"></div>
            <div class="ec-prod-price"></div>
          </div>
        </div>
      </div>
    </main>

  </div>

</div>
`,
    css: `
.ec-page {
  background: #f8f9fa;
  color: #333;
  font-family: sans-serif;
}

.ec-promo-bar {
  height: 35px;
  background: #222;
}

.ec-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.ec-logo {
  width: 100px;
  height: 25px;
  background: #ccc;
}

.ec-search-bar {
  width: 300px;
  height: 35px;
  background: #f0f0f0;
  border-radius: 4px;
}

.ec-nav-icons {
  display: flex;
  gap: 15px;
}

.ec-icon-placeholder {
  width: 25px;
  height: 25px;
  background: #ccc;
  border-radius: 50%;
}

.ec-shop-container {
  display: flex;
  padding: 40px 5%;
  gap: 40px;
}

.ec-sidebar {
  width: 220px;
  flex-shrink: 0;
}

.ec-filter-group {
  margin-bottom: 30px;
}

.ec-filter-title {
  width: 70%;
  height: 18px;
  background: #ccc;
  margin-bottom: 12px;
}

.ec-filter-line {
  width: 90%;
  height: 12px;
  background: #e0e0e0;
  margin-bottom: 8px;
}

.ec-products-display {
  flex-grow: 1;
}

.ec-sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e5e5;
}

.ec-sort-title {
  width: 120px;
  height: 20px;
  background: #ccc;
}

.ec-sort-dropdown {
  width: 100px;
  height: 30px;
  background: #e0e0e0;
}

.ec-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.ec-product-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.ec-product-img {
  height: 240px;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #888;
}

.ec-product-details {
  padding: 15px;
}

.ec-prod-title {
  width: 80%;
  height: 14px;
  background: #ccc;
  margin-bottom: 8px;
}

.ec-prod-price {
  width: 40%;
  height: 14px;
  background: #e0e0e0;
}

.ec-wishlist-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid #ddd;
}
`
  },

  // ─────────────────────────────────────────────
  // 5. Landing Page
  // ─────────────────────────────────────────────
  {
    keywords: ["landing page", "hero section", "features cards", "cta section", "nav links"],
    html: `
<div class="lp-page">

  <nav class="lp-nav">
    <div class="lp-logo">LOGO PLACEHOLDER</div>
    <ul class="lp-nav-links">
      <li></li><li></li><li></li>
    </ul>
  </nav>

  <section class="lp-hero">
    <div class="lp-hero-text">
      <div class="lp-hero-title"></div>
      <div class="lp-hero-subtitle"></div>
      <div class="lp-hero-subtitle lp-hero-subtitle-short"></div>
      <div class="lp-hero-btn"></div>
    </div>
    <div class="lp-hero-image">IMAGE / VIDEO PLACEHOLDER</div>
  </section>

  <section class="lp-features">
    <div class="lp-section-title"></div>
    <div class="lp-grid">
      <div class="lp-card">
        <div class="lp-card-icon"></div>
        <div class="lp-card-title"></div>
        <div class="lp-card-text"></div>
        <div class="lp-card-text"></div>
      </div>
      <div class="lp-card">
        <div class="lp-card-icon"></div>
        <div class="lp-card-title"></div>
        <div class="lp-card-text"></div>
        <div class="lp-card-text"></div>
      </div>
      <div class="lp-card">
        <div class="lp-card-icon"></div>
        <div class="lp-card-title"></div>
        <div class="lp-card-text"></div>
        <div class="lp-card-text"></div>
      </div>
    </div>
  </section>

  <section class="lp-cta">
    <div class="lp-cta-title"></div>
    <div class="lp-cta-btn"></div>
  </section>

  <footer class="lp-footer">
    <div class="lp-footer-block"></div>
    <div class="lp-footer-block"></div>
  </footer>

</div>
`,
    css: `
.lp-page {
  background: #f4f4f6;
  color: #333;
  line-height: 1.6;
  font-family: sans-serif;
}

.lp-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10%;
  background: #fff;
  border-bottom: 2px solid #e0e0e0;
}

.lp-logo {
  width: 120px;
  height: 30px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.lp-nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
}

.lp-nav-links li {
  width: 60px;
  height: 15px;
  background: #e0e0e0;
}

.lp-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 10%;
  background: #fff;
  border-bottom: 2px solid #e0e0e0;
  gap: 40px;
}

.lp-hero-text {
  flex: 1;
}

.lp-hero-title {
  width: 80%;
  height: 40px;
  background: #ccc;
  margin-bottom: 15px;
}

.lp-hero-subtitle {
  width: 95%;
  height: 20px;
  background: #e0e0e0;
  margin-bottom: 10px;
}

.lp-hero-subtitle-short {
  width: 60%;
}

.lp-hero-btn {
  width: 140px;
  height: 45px;
  background: #444;
  margin-top: 15px;
  border-radius: 4px;
}

.lp-hero-image {
  flex: 1;
  height: 300px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.lp-features {
  padding: 60px 10%;
  text-align: center;
}

.lp-section-title {
  width: 200px;
  height: 30px;
  background: #ccc;
  margin: 0 auto 40px;
}

.lp-grid {
  display: flex;
  gap: 30px;
  justify-content: space-between;
}

.lp-card {
  flex: 1;
  background: #fff;
  padding: 30px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
}

.lp-card-icon {
  width: 60px;
  height: 60px;
  background: #ddd;
  margin: 0 auto 20px;
  border-radius: 50%;
}

.lp-card-title {
  width: 70%;
  height: 20px;
  background: #ccc;
  margin: 0 auto 15px;
}

.lp-card-text {
  width: 90%;
  height: 12px;
  background: #e0e0e0;
  margin: 8px auto 0;
}

.lp-cta {
  padding: 60px 10%;
  background: #ddd;
  text-align: center;
}

.lp-cta-title {
  width: 40%;
  height: 30px;
  background: #bbb;
  margin: 0 auto 20px;
}

.lp-cta-btn {
  width: 160px;
  height: 45px;
  background: #444;
  margin: 0 auto;
  border-radius: 4px;
}

.lp-footer {
  padding: 30px 10%;
  background: #333;
  display: flex;
  justify-content: space-between;
}

.lp-footer-block {
  width: 100px;
  height: 15px;
  background: #555;
}
`
  },

  // ─────────────────────────────────────────────
  // 6. Photo Gallery
  // ─────────────────────────────────────────────
  {
    keywords: ["photo gallery", "masonry grid", "dark gallery", "lightbox", "portrait landscape featured"],
    html: `
<div class="pg-page">

  <header class="pg-header">
    <div class="pg-gallery-title"></div>
    <ul class="pg-gallery-filters">
      <li class="pg-filter-active"></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </header>

  <main class="pg-gallery-container">
    <div class="pg-photo-grid">
      <div class="pg-photo-item pg-landscape">
        LANDSCAPE PHOTO
        <div class="pg-photo-overlay"><div class="pg-photo-label"></div><div class="pg-photo-icon"></div></div>
      </div>
      <div class="pg-photo-item pg-portrait">
        PORTRAIT PHOTO
        <div class="pg-photo-overlay"><div class="pg-photo-label"></div><div class="pg-photo-icon"></div></div>
      </div>
      <div class="pg-photo-item">
        SQUARE PHOTO
        <div class="pg-photo-overlay"><div class="pg-photo-label"></div><div class="pg-photo-icon"></div></div>
      </div>
      <div class="pg-photo-item pg-featured">
        FEATURED LARGE PHOTO
        <div class="pg-photo-overlay"><div class="pg-photo-label"></div><div class="pg-photo-icon"></div></div>
      </div>
      <div class="pg-photo-item">
        SQUARE PHOTO
        <div class="pg-photo-overlay"><div class="pg-photo-label"></div><div class="pg-photo-icon"></div></div>
      </div>
      <div class="pg-photo-item pg-landscape">
        LANDSCAPE PHOTO
        <div class="pg-photo-overlay"><div class="pg-photo-label"></div><div class="pg-photo-icon"></div></div>
      </div>
      <div class="pg-photo-item pg-portrait">
        PORTRAIT PHOTO
        <div class="pg-photo-overlay"><div class="pg-photo-label"></div><div class="pg-photo-icon"></div></div>
      </div>
    </div>
  </main>

  <footer class="pg-footer">
    <div class="pg-load-more"></div>
  </footer>

</div>
`,
    css: `
.pg-page {
  background: #121212;
  color: #eee;
  font-family: sans-serif;
}

.pg-header {
  position: sticky;
  top: 0;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(5px);
  padding: 30px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #222;
  z-index: 100;
}

.pg-gallery-title {
  width: 140px;
  height: 24px;
  background: #444;
}

.pg-gallery-filters {
  display: flex;
  gap: 15px;
  list-style: none;
}

.pg-gallery-filters li {
  width: 70px;
  height: 20px;
  background: #333;
  border-radius: 3px;
}

.pg-filter-active {
  background: #666 !important;
}

.pg-gallery-container {
  padding: 40px 5%;
}

.pg-photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-rows: 220px;
  gap: 20px;
  grid-auto-flow: dense;
}

.pg-photo-item {
  position: relative;
  background: #222;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid #333;
}

.pg-photo-item:hover {
  border-color: #555;
}

.pg-landscape {
  grid-column: span 2;
}

.pg-portrait {
  grid-row: span 2;
}

.pg-featured {
  grid-column: span 2;
  grid-row: span 2;
  background: #2a2a2a;
}

.pg-photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.7;
}

.pg-photo-label {
  width: 40%;
  height: 10px;
  background: #555;
}

.pg-photo-icon {
  width: 15px;
  height: 15px;
  background: #555;
  border-radius: 50%;
}

.pg-footer {
  padding: 40px 5%;
  text-align: center;
  border-top: 1px solid #222;
  margin-top: 40px;
}

.pg-load-more {
  width: 150px;
  height: 40px;
  background: #333;
  margin: 0 auto;
  border-radius: 4px;
}
`
  },

  // ─────────────────────────────────────────────
  // 7. Portfolio Wireframe
  // ─────────────────────────────────────────────
  {
    keywords: ["portfolio wireframe", "profile intro", "works grid", "filter bar", "social footer", "contact footer"],
    html: `
<div class="pw-page">

  <header class="pw-header">
    <div class="pw-brand"></div>
    <ul class="pw-nav-links">
      <li></li><li></li><li></li>
    </ul>
  </header>

  <section class="pw-intro">
    <div class="pw-profile-pic"></div>
    <div class="pw-bio">
      <div class="pw-bio-hi"></div>
      <div class="pw-bio-text"></div>
      <div class="pw-bio-text"></div>
    </div>
  </section>

  <section class="pw-works">
    <div class="pw-filter-bar">
      <div class="pw-filter-item pw-filter-active"></div>
      <div class="pw-filter-item"></div>
      <div class="pw-filter-item"></div>
    </div>

    <div class="pw-portfolio-grid">
      <div class="pw-project-card">
        <div class="pw-project-thumb">PROJECT THUMBNAIL</div>
        <div class="pw-project-info">
          <div class="pw-project-title"></div>
          <div class="pw-project-tags"></div>
        </div>
      </div>
      <div class="pw-project-card">
        <div class="pw-project-thumb">PROJECT THUMBNAIL</div>
        <div class="pw-project-info">
          <div class="pw-project-title"></div>
          <div class="pw-project-tags"></div>
        </div>
      </div>
      <div class="pw-project-card">
        <div class="pw-project-thumb">PROJECT THUMBNAIL</div>
        <div class="pw-project-info">
          <div class="pw-project-title"></div>
          <div class="pw-project-tags"></div>
        </div>
      </div>
    </div>
  </section>

  <footer class="pw-contact-footer">
    <div class="pw-contact-title"></div>
    <div class="pw-social-links">
      <div class="pw-social-icon"></div>
      <div class="pw-social-icon"></div>
      <div class="pw-social-icon"></div>
    </div>
  </footer>

</div>
`,
    css: `
.pw-page {
  background: #fafafa;
  color: #222;
  line-height: 1.6;
  font-family: sans-serif;
}

.pw-header {
  padding: 40px 10% 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pw-brand {
  font-weight: bold;
  font-size: 20px;
  width: 100px;
  height: 25px;
  background: #ccc;
}

.pw-nav-links {
  display: flex;
  gap: 25px;
  list-style: none;
}

.pw-nav-links li {
  width: 50px;
  height: 15px;
  background: #e0e0e0;
}

.pw-intro {
  padding: 60px 10%;
  display: flex;
  align-items: center;
  gap: 40px;
  border-bottom: 1px solid #e0e0e0;
}

.pw-profile-pic {
  width: 120px;
  height: 120px;
  background: #ddd;
  border-radius: 50%;
  flex-shrink: 0;
}

.pw-bio {
  flex-grow: 1;
}

.pw-bio-hi {
  width: 150px;
  height: 28px;
  background: #bbb;
  margin-bottom: 15px;
}

.pw-bio-text {
  width: 85%;
  height: 16px;
  background: #e0e0e0;
  margin-bottom: 8px;
}

.pw-works {
  padding: 60px 10%;
}

.pw-filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.pw-filter-item {
  width: 70px;
  height: 30px;
  background: #e0e0e0;
  border-radius: 4px;
}

.pw-filter-active {
  background: #444;
}

.pw-portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.pw-project-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.pw-project-thumb {
  height: 200px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #666;
}

.pw-project-info {
  padding: 20px;
}

.pw-project-title {
  width: 60%;
  height: 18px;
  background: #ccc;
  margin-bottom: 10px;
}

.pw-project-tags {
  width: 40%;
  height: 12px;
  background: #e0e0e0;
}

.pw-contact-footer {
  padding: 60px 10%;
  background: #f0f0f0;
  text-align: center;
  border-top: 1px solid #e0e0e0;
}

.pw-contact-title {
  width: 250px;
  height: 25px;
  background: #ccc;
  margin: 0 auto 20px;
}

.pw-social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.pw-social-icon {
  width: 35px;
  height: 35px;
  background: #bbb;
  border-radius: 50%;
}
`
  },
  {
    html: `
    <h1>Hi</h1>
    `,
    css: `
    h1 { color: red; }
    @media (min-width: 30px) {
      h1 { color: blue; }
      h1:hover { color: red; }
    }
    `,
    keywords: ["red"]
  }
  ];
function newComponent() {
  var place = document.querySelector("#Components");
componentsList.forEach(function(component){
    var dom = new DOMParser();
    var p = dom.parseFromString(component.html,"text/html");
    var componentContainer = document.createElement("div");
    componentContainer.className = "component";
    var target = p.body.querySelector("*");
    target.setAttribute("draggable",true);
    componentContainer.setAttribute("data-keywords",component.keywords.toString());
    componentContainer.appendChild(target);
    if(place) {
      componentContainer.querySelectorAll("*").forEach((inner)=>{
        if(inner) {
      [...inner.childNodes].forEach((el)=>{
            if(el && el instanceof Text) {
            el.parentNode.removeChild(el);
            }
          });
        }
        if(inner) {
          Paint.identity(inner);
        }
      });
    place.appendChild(componentContainer);
    } else {
      alert("error at inserComponent");
    }
Array.from(Paint.createSheet(component.css).cssRules).forEach(function (rule){
     if(!Entrypoint || !Entrypoint.returnBackupSheet) return;
     var entry = Entrypoint.returnBackupSheet()[0].parentStyleSheet;
     entry.insertRule(rule.cssText,Entrypoint.returnBackupSheet()[0].parentStyleSheet.cssRules.length);
   var s = {};
 if(typeof CSSStyleSheet === "function") {
     s = new CSSStyleSheet();
   } else {
     var style = document.createElement("style");
     style.id = "emergency";
     document.head.appendChild(style);
     style.addEventListener("load",()=>{
     style.sheet.insertRule(rule.cssText,style.sheet.cssRules.length);
     });
     s = style.sheet;
   }
   if(s instanceof CSSStyleSheet && s.ownerNode == null) {
     document.adoptedStyleSheets = [...document.adoptedStyleSheets,s];
   }
   s.insertRule(rule.cssText,s.cssRules.length);
    });
  });
}
window.addEventListener("load",()=>{
  newComponent();
});