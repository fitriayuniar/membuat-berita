export default async function handler(req, res) {
  const url = new URL("https://newsapi.org/v2/top-headlines");

  // Teruskan semua parameter query dari client
  for (const [key, value] of Object.entries(req.query)) {
    url.searchParams.set(key, value);
  }

  // Pakai API key NewsAPI kamu
  url.searchParams.set("apiKey", "8d62e1ebe4544270ac56851303a0db37");

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Gagal mengambil berita dari NewsAPI" });
  }
}
