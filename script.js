/* ============================================================
   📸 사진 추가하는 방법 (아주 간단해요!)

   1) 사진 파일(jpg, png)을 images 폴더에 넣으세요.
   2) 아래 posts 목록 맨 위에 { } 블록을 하나 복사해서 붙이고,
      photo / title / date / text 를 내 사진에 맞게 바꾸세요.
   3) 저장 후 아래 3줄을 실행하면 홈페이지에 자동 반영돼요:
        git add .
        git commit -m "사진 추가"
        git push

   ⚠️ photo 는 반드시 "images/파일이름.jpg" 형식으로 적으세요.
   ============================================================ */

const posts = [
  {
    photo: "images/sample1.svg",   // ← images 폴더의 사진 파일 이름
    title: "첫 번째 사진",           // ← 사진 제목
    date: "2026.07.18",             // ← 날짜
    text: "여기에 사진에 대한 이야기를 적어보세요."  // ← 설명 글
  },
  {
    photo: "images/sample2.svg",
    title: "두 번째 사진",
    date: "2026.07.17",
    text: "이 사진들은 예시예요. images 폴더에 내 사진을 넣고 바꿔보세요."
  },
  {
    photo: "images/sample3.svg",
    title: "세 번째 사진",
    date: "2026.07.16",
    text: "사진을 위에 계속 추가하면 최신순으로 위에 쌓여요."
  }
];

/* ---------- 아래는 화면에 그려주는 코드 (건드릴 필요 없어요) ---------- */

const gallery = document.getElementById("gallery");
const emptyMsg = document.getElementById("empty");

if (posts.length === 0) {
  emptyMsg.hidden = false;
}

posts.forEach((post) => {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <img class="card-photo" src="${post.photo}" alt="${post.title}" loading="lazy" />
    <div class="card-body">
      <span class="card-date">${post.date}</span>
      <h2 class="card-title">${post.title}</h2>
      <p class="card-text">${post.text}</p>
    </div>
  `;
  card.querySelector(".card-photo").addEventListener("click", () => {
    openLightbox(post.photo, `${post.title} — ${post.date}`);
  });
  gallery.appendChild(card);
});

/* ---------- 사진 크게 보기 (라이트박스) ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox-img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const closeBtn = lightbox.querySelector(".lightbox-close");

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
}

closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

/* 푸터 연도 자동 표시 */
document.getElementById("year").textContent = new Date().getFullYear();
