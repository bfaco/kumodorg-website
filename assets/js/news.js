async function fetchNews() {
  const newsContainer = document.getElementById("news-list");
  if (!newsContainer) return;

  newsContainer.innerHTML =
    '<p class="muted">Haberler yükleniyor...</p>';

  try {
    const res = await fetch("data/news.json?ts=" + Date.now());
    if (!res.ok) {
      throw new Error("news.json yüklenemedi: " + res.status);
    }

    const data = await res.json();
    const records = (data && data.news) || [];

    if (!records.length) {
      newsContainer.innerHTML =
        '<p class="muted">Şu anda yayında haber bulunmuyor. Yakında yeni duyurular burada yer alacak.</p>';
      return;
    }

    const itemsHtml = records
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 6)
      .map((item) => {
        const title = item.title || "Başlıksız haber";
        const content =
          (item.content || "").toString().slice(0, 160) +
          (item.content && item.content.length > 160 ? "..." : "");
        const date = item.date
          ? new Date(item.date).toLocaleDateString("tr-TR")
          : "";
        const imageUrl = item.image || null;
        const instagramUrl = item.instagram_url || null;

        return `
          <article class="news-item">
            ${
              imageUrl
                ? `<div class="news-thumb"><img src="${imageUrl}" alt="${title}"></div>`
                : ""
            }
            <div class="news-body">
              <h4>${title}</h4>
              ${
                date
                  ? `<div class="news-meta">${date}${
                      instagramUrl
                        ? ` · <a href="${instagramUrl}" target="_blank" rel="noopener">Instagram gönderisi</a>`
                        : ""
                    }</div>`
                  : ""
              }
              <p>${content}</p>
            </div>
          </article>
        `;
      })
      .join("");

    newsContainer.innerHTML = itemsHtml;
  } catch (err) {
    console.error(err);
    newsContainer.innerHTML =
      '<p class="muted">Haberler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>';
  }
}

document.addEventListener("DOMContentLoaded", fetchNews);
