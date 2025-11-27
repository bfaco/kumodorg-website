async function fetchInstagramPost() {
  const container = document.getElementById("instagram-highlight");
  if (!container) return;

  container.innerHTML =
    '<p class="muted">Instagram gönderisi yükleniyor...</p>';

  try {
    const res = await fetch("data/instagram.json?ts=" + Date.now());
    if (!res.ok) {
      throw new Error("instagram.json yüklenemedi: " + res.status);
    }

    const data = await res.json();
    const posts = (data && data.posts) || [];
    if (!posts.length) {
      container.innerHTML =
        '<p class="muted">Şu anda öne çıkarılmış bir Instagram paylaşımı bulunmuyor.</p>';
      return;
    }

    const post = posts[0]; // En güncel/öne çıkan gönderi
    const title = post.title || "";
    const caption = post.caption || "";
    const date = post.date
      ? new Date(post.date).toLocaleDateString("tr-TR")
      : "";
    const imageUrl = post.image || "";
    const link = post.link || "#";

    container.innerHTML = `
      <article class="insta-card">
        <header class="insta-header">
          <div class="insta-profile">
            <div class="insta-avatar">
              <img src="assets/img/kumod-icon.png" alt="KUMÖD" />
            </div>
            <div>
              <div class="insta-username">kocaeliumod</div>
              ${
                date
                  ? `<div class="insta-date">${date}</div>`
                  : ""
              }
            </div>
          </div>
          <a href="${link}" target="_blank" rel="noopener" class="insta-view-link">
            Instagram’da gör
          </a>
        </header>

        ${
          imageUrl
            ? `<div class="insta-image">
                 <img src="${imageUrl}" alt="${title}">
               </div>`
            : ""
        }

        <div class="insta-body">
          ${title ? `<h4>${title}</h4>` : ""}
          <p>${caption}</p>
        </div>
      </article>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="muted">Instagram paylaşımı yüklenirken bir sorun oluştu.</p>';
  }
}

document.addEventListener("DOMContentLoaded", fetchInstagramPost);
