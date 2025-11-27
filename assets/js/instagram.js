let instaPosts = [];
let instaIndex = 0;

function renderInstagramSlide() {
  const wrapper = document.querySelector(".insta-slide-wrapper");
  if (!wrapper || !instaPosts.length) return;

  const post = instaPosts[instaIndex];
  const title = post.title || "";
  const caption = post.caption || "";
  const date = post.date
    ? new Date(post.date).toLocaleDateString("tr-TR")
    : "";
  const imageUrl = post.image || "";
  const link = post.link || "#";

  wrapper.innerHTML = `
    <article class="insta-card">
      <header class="insta-header">
        <div class="insta-profile">
          <div class="insta-avatar">
            <img src="assets/img/kumod-icon.png" alt="KUMÖD" />
          </div>
          <div>
            <div class="insta-username">kocaeliumod</div>
            ${date ? `<div class="insta-date">${date}</div>` : ""}
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
}

async function fetchInstagramPost() {
  const container = document.getElementById("instagram-highlight");
  if (!container) return;

  container.innerHTML =
    '<p class="muted">Instagram gönderileri yükleniyor...</p>';

  try {
    const res = await fetch("data/instagram.json?ts=" + Date.now());
    if (!res.ok) {
      throw new Error("instagram.json yüklenemedi: " + res.status);
    }

    const data = await res.json();
    instaPosts = (data && data.posts) || [];

    if (!instaPosts.length) {
      container.innerHTML =
        '<p class="muted">Şu anda öne çıkarılmış Instagram gönderisi bulunmuyor.</p>';
      return;
    }

    container.innerHTML = `
      <div class="insta-carousel">
        <button class="insta-nav insta-prev" type="button" aria-label="Önceki gönderi">‹</button>
        <div class="insta-slide-wrapper"></div>
        <button class="insta-nav insta-next" type="button" aria-label="Sonraki gönderi">›</button>
      </div>
    `;

    renderInstagramSlide();

    const prevBtn = container.querySelector(".insta-prev");
    const nextBtn = container.querySelector(".insta-next");

    prevBtn.addEventListener("click", () => {
      instaIndex = (instaIndex - 1 + instaPosts.length) % instaPosts.length;
      renderInstagramSlide();
    });

    nextBtn.addEventListener("click", () => {
      instaIndex = (instaIndex + 1) % instaPosts.length;
      renderInstagramSlide();
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="muted">Instagram paylaşımları yüklenirken bir sorun oluştu.</p>';
  }
}

document.addEventListener("DOMContentLoaded", fetchInstagramPost);
