// ✅ 다국어 전환을 지원하는 버전입니다

let currentLang = "ko";
let timeline = [];

function getIconClass(url) {
  if (url.endsWith(".pdf")) return "fas fa-file-pdf";
  if (url.startsWith("http")) return "fas fa-up-right-from-square";
  return "fas fa-link";
}

function createTimelineCard(entry) {
  const card = document.createElement("div");
  card.className = "timeline-card";

  const title = document.createElement("h3");
  title.innerText = `${entry.year} · ${entry.title}`;
  card.appendChild(title);

  const description = document.createElement("p");
  description.innerText = entry.text;
  card.appendChild(description);

  const linkBox = document.createElement("div");
  linkBox.className = "timeline-links";

  entry.links.forEach((link) => {
    const btn = document.createElement("a");
    btn.href = link.url;
    btn.className = "timeline-button";
    btn.target = "_blank";

    const icon = document.createElement("i");
    icon.className = getIconClass(link.url);
    icon.style.marginRight = "6px";
    btn.appendChild(icon);

    const label = document.createTextNode(link.label);
    btn.appendChild(label);

    linkBox.appendChild(btn);
  });

  card.appendChild(linkBox);
  return card;
}

function renderTimeline() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";
  timeline.forEach(entry => {
    const card = createTimelineCard(entry);
    container.appendChild(card);
    observer.observe(card);
  });
}

function loadTimeline(lang) {
  const url = `./data/timeline-${lang}.json`;
  console.log("📦 Fetching:", url); // ← 이 줄 추가
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`📛 Fetch failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log("✅ Timeline data loaded:", data); // ← 이 줄 추가
      timeline = data;
      renderTimeline();
    })
    .catch(err => {
      console.error("❌ Timeline load error:", err); // ← 이 줄 추가
    });
}


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

function switchLanguage() {
  currentLang = currentLang === "ko" ? "en" : "ko";
  document.getElementById("lang-label").textContent = currentLang === "ko" ? "English" : "한국어";
  document.getElementById("toggle-lang").innerHTML = `<i class='fas fa-language'></i> ${currentLang === "ko" ? "English" : "한국어"}`;

  // Hero 텍스트
  const hero = document.getElementById("hero");
  if (hero) {
    hero.querySelector("h1").textContent = currentLang === "ko"
      ? "교사가 아닌, 삶의 설계자로 살고 있습니다."
      : "Not just a teacher, but a designer of life.";
    hero.querySelector("p").innerHTML = currentLang === "ko"
      ? "나의 교육은 말보다 사람이 먼저였고, 기록보다 만남이 먼저였습니다.<br>이 이야기는 단지 이력서가 아니라, 한 사람의 길에 대한 기록입니다."
      : "My education has always put people before words, and encounters before records.<br>This is not just a resume, but a record of a life.";
    hero.querySelector("a").innerHTML = currentLang === "ko"
      ? "나의 이야기 보기 <i class='fas fa-arrow-down'></i>"
      : "View My Story <i class='fas fa-arrow-down'></i>";
  }

  // 소개, 연락처
  document.getElementById("about").querySelector("h2").textContent = currentLang === "ko" ? "소개" : "About";
  document.getElementById("about").querySelector("p").textContent = currentLang === "ko"
    ? "사람과 교육의 연결을 삶으로 살아가는 사람, 이정재입니다."
    : "I am Lee Jungjae, someone who lives by connecting people and education.";

  document.getElementById("contact").querySelector("h2").textContent = currentLang === "ko" ? "연락하기" : "Contact";
  document.getElementById("contact").querySelector("p").innerHTML = `<i class='fas fa-envelope'></i> jungjae_lee@nate.com`;

  // 푸터도 바꿀 수 있음 (옵션)

  loadTimeline(currentLang);
}

window.addEventListener("DOMContentLoaded", () => {
  loadTimeline(currentLang);

  // PDF 모달
  const modal = document.getElementById("pdfModal");
  const viewer = document.getElementById("pdfViewer");
  const closeModal = document.getElementById("closeModal");

  document.addEventListener("click", (e) => {
    if (e.target.closest(".timeline-button")) {
      const btn = e.target.closest(".timeline-button");
      const url = btn.getAttribute("href");
      if (url.endsWith(".pdf")) {
        e.preventDefault();
        viewer.src = url;
        modal.classList.remove("hidden");
      }
    }
  });

  closeModal.addEventListener("click", () => {
    viewer.src = "";
    modal.classList.add("hidden");
  });

  // Hero 전환
  const showBtn = document.getElementById("show-timeline");
  const hero = document.getElementById("hero");
  const timelineSection = document.getElementById("timeline");

  if (showBtn && hero && timelineSection) {
    showBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hero.style.display = "none";
      timelineSection.classList.remove("hidden");
      timelineSection.classList.add("fade-in");
    });
  }

  // 언어 토글 버튼
  const langToggle = document.getElementById("toggle-lang");
  if (langToggle) {
    langToggle.addEventListener("click", (e) => {
      e.preventDefault();
      switchLanguage();
    });
  }
});
