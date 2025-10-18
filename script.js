// === KONFIGURASI ===
const API_KEY = "8d62e1ebe4544270ac56851303a0db37";
const BASE_URL = "/v2/top-headlines"; // pakai proxy Vercel

let page = 1;
let currentQuery = "";
let currentCategory = "";
let currentCountry = "";

const statusMsg = document.getElementById("status");
const newsGrid = document.getElementById("news-grid");
const loadMoreBtn = document.getElementById("loadMore");
const searchBtn = document.getElementById("searchBtn");

// ==== Gambar fallback ====
const fallbackImages = {
  business: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800",
  technology: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
  entertainment: "https://images.unsplash.com/photo-1505238680356-667803448bb6?w=800",
  sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
  health: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=800",
  science: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
  default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
};

// === FUNGSI FETCH BERITA ===
async function fetchNews(loadMore = false) {
  if (!loadMore) {
    page = 1;
    newsGrid.innerHTML = "";
  }

  statusMsg.style.display = "block";
  statusMsg.innerHTML = '<div class="spinner"></div> Memuat berita...';
  loadMoreBtn.style.display = "none";

  const url = new URL(BASE_URL, window.location.origin);
  if (currentQuery) url.searchParams.set("q", currentQuery);
  if (currentCategory) url.searchParams.set("category", currentCategory);
  if (currentCountry) url.searchParams.set("country", currentCountry);
  url.searchParams.set("page", page);
  url.searchParams.set("pageSize", 12);
  url.searchParams.set("apiKey", API_KEY);

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.articles && data.articles.length > 0) {
      renderNews(data.articles);
      statusMsg.style.display = "none";
      if (data.articles.length >= 12) loadMoreBtn.style.display = "block";
    } else {
      statusMsg.innerHTML = "Berita Menampilkan berita lokal.";
      renderNews(localArticles);
    }
  } catch (err) {
    console.error(err);
    statusMsg.innerHTML = "Gagal memuat berita. Menampilkan berita lokal...";
    renderNews(localArticles);
  }
}

// === TAMPILKAN BERITA ===
function renderNews(articles) {
  for (const a of articles) {
    let imgSrc = a.urlToImage || fallbackImages[currentCategory] || fallbackImages.default;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img class="thumb" src="${imgSrc}" alt="thumbnail berita" onerror="this.src='${fallbackImages.default}'">
      <div class="card-body">
        <div class="meta">${a.source?.name || "Tanpa sumber"}</div>
        <h3 class="title">${a.title || "Tanpa judul"}</h3>
        <div class="desc">${a.description || "Tidak ada deskripsi"}</div>
        <div class="actions">
          <span class="source">${new Date(a.publishedAt).toLocaleDateString()}</span>
          <a href="${a.url}" target="_blank" rel="noopener noreferrer">Baca →</a>
        </div>
      </div>
    `;
    newsGrid.appendChild(card);
  }
}

// === EVENT HANDLER ===
searchBtn.addEventListener("click", () => {
  currentQuery = document.getElementById("q").value.trim();
  currentCountry = document.getElementById("country").value;
  currentCategory = document.getElementById("category").value;
  fetchNews();
});

loadMoreBtn.addEventListener("click", () => {
  page++;
  fetchNews(true);
});

// === ARTIKEL LOKAL ===
const localArticles = [
  {
    source: { name: "Sawit Indonesia" },
    title: "Menteri Pertanian Menindaklanjuti Instruksi Presiden untuk Revitalisasi Pabrik Pupuk",
    description: "Menteri Pertanian Andi Amran Sulaiman menegaskan pihaknya siap menindaklanjuti Instruksi Presiden Prabowo Subianto untuk revitalisasi pabrik pupuk guna mendukung ketahanan pangan nasional.",
    url: "https://sawitindonesia.com/menteri-pertanian-menindaklanjuti-instruksi-presiden-untuk-revitalisasi-pabrik-pupuk/",
    urlToImage: "https://sawitindonesia.com/wp-content/uploads/2025/10/menteri-pertanian.jpg",
    publishedAt: "2025-10-17T10:00:00Z"
  },
  {
    source: { name: "Antara News" },
    title: "XPeng Indonesia Resmi Hadirkan Diler Flagship Terbaru di Pondok Indah",
    description: "XPeng Indonesia resmi menghadirkan diler flagship di kawasan elit Pondok Indah, Jakarta Selatan.",
    url: "https://www.antaranews.com/berita/5180009/xpeng-indonesia-resmi-hadirkan-diler-flagship-terbaru-di-pondok-indah",
    urlToImage: "https://www.antaranews.com/images/2025/10/17/xpeng-diler-pondok-indah.jpg",
    publishedAt: "2025-10-17T09:30:00Z"
  }
];

// === AUTO LOAD ===
fetchNews();

