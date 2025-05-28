// ✅ 다국어 전환을 지원하는 완전한 버전 (언어 toggle 복구 및 메뉴도 전환)

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
  fetch(url)
    .then(res => res.json())
    .then(data => {
      timeline = data;
      renderTimeline();
    })
    .catch(err => console.error("❌ Timeline load error:", err));
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

  // 상단 버튼 텍스트
  const langToggle = document.getElementById("toggle-lang");
  document.getElementById("lang-label").textContent = currentLang === "ko" ? "English" : "한국어";

  // 메뉴 이름 바꾸기
  document.querySelector("nav ul li:nth-child(1) a").innerHTML = `<i class='fas fa-layer-group'></i> ${currentLang === "ko" ? "포트폴리오" : "Portfolio"}`;
  document.querySelector("nav ul li:nth-child(2) a").innerHTML = `<i class='fas fa-user'></i> ${currentLang === "ko" ? "소개" : "About"}`;
  document.querySelector("nav ul li:nth-child(3) a").innerHTML = `<i class='fas fa-envelope'></i> ${currentLang === "ko" ? "연락처" : "Contact"}`;

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

  // 소개/연락처
  document.getElementById("about").querySelector("h2").textContent = currentLang === "ko" ? "소개" : "About";
  document.getElementById("about").querySelector("p").textContent = currentLang === "ko"
    ? "사람과 교육의 연결을 삶으로 살아가는 사람, 이정재입니다."
    : "I am Lee Jungjae, someone who lives by connecting people and education.";

  document.getElementById("contact").querySelector("h2").textContent = currentLang === "ko" ? "연락하기" : "Contact";
  document.getElementById("contact").querySelector("p").innerHTML = `<i class='fas fa-envelope'></i> jungjae_lee@nate.com`;

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

  // Hero → 타임라인 전환 (기존 코드)
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

  // 상단 로고 클릭 시 Hero 화면으로 돌아오기 (새로운 코드 추가)
  const backToHeroBtn = document.getElementById("back-to-hero");
  if (backToHeroBtn && hero && timelineSection) {
    backToHeroBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hero.style.display = "block"; // Hero 섹션을 다시 보이게 합니다.
      timelineSection.classList.add("hidden"); // 타임라인 섹션을 숨깁니다.
      timelineSection.classList.remove("fade-in"); // 페이드인 애니메이션 클래스 제거 (선택 사항)
      window.scrollTo(0, 0); // 페이지 최상단으로 스크롤 (선택 사항)
    });
  }

  // 언어 전환 버튼
  const langToggle = document.getElementById("toggle-lang");
  if (langToggle) {
    langToggle.addEventListener("click", (e) => {
      e.preventDefault();
      switchLanguage();
    });
  }
});
