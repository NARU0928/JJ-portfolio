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
    // <h1> 태그 텍스트 조정: 모바일에서 줄바꿈을 CSS로 제어합니다.
    hero.querySelector("h1").innerHTML = currentLang === "ko"
      ? "교사가 아닌,<br class='mobile-break'><strong>삶의 설계자</strong>로<br class='mobile-break'>살고 있습니다." // <br class='mobile-break'> 추가
      : "Not just a teacher, but a designer of life.";
    hero.querySelector("p").innerHTML = currentLang === "ko"
      ? "교육은 말보다 <strong>사람</strong>이 먼저였고,<br>기록보다 <strong>만남</strong>이 먼저였습니다.<br>이 이야기는 단지 이력서가 아니라,<br>한 사람의 <strong>길</strong>에 대한 기록입니다."
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

  // 상단 로고 텍스트 변경
  const logoTextElement = document.querySelector(".logo a");
  if (logoTextElement) {
    if (currentLang === "ko") {
      logoTextElement.innerHTML = "이정재의 <span>인생 포트폴리오</span>";
    } else {
      logoTextElement.innerHTML = "Lee Jungjae’s <span>Life Portfolio</span>";
    }
  }

  loadTimeline(currentLang);
}

window.addEventListener("DOMContentLoaded", () => {
  // 로고 텍스트 초기 설정
  const logoTextElement = document.querySelector(".logo a");
  if (logoTextElement) {
    if (currentLang === "ko") {
      logoTextElement.innerHTML = "이정재의 <span>인생 포트폴리오</span>";
    } else {
      logoTextElement.innerHTML = "Lee Jungjae’s <span>Life Portfolio</span>";
    }
  }

  // Hero 텍스트 초기 설정
  const hero = document.getElementById("hero");
  if (hero) {
    // <h1> 태그 텍스트 조정: 모바일에서 줄바꿈을 CSS로 제어합니다.
    hero.querySelector("h1").innerHTML = currentLang === "ko"
      ? "교사가 아닌,<br class='mobile-break'><strong>삶의 설계자</strong>로<br class='mobile-break'>살고 있습니다." // <br class='mobile-break'> 추가
      : "Not just a teacher, but a designer of life.";
    hero.querySelector("p").innerHTML = currentLang === "ko"
      ? "교육은 말보다 <strong>사람</strong>이 먼저였고,<br>기록보다 <strong>만남</strong>이 먼저였습니다.<br>이 이야기는 단지 이력서가 아니라,<br>한 사람의 <strong>길</strong>에 대한 기록입니다."
      : "My education has always put people before words, and encounters before records.<br>This is not just a resume, but a record of a life.";
    hero.querySelector("a").innerHTML = currentLang === "ko"
      ? "나의 이야기 보기 <i class='fas fa-arrow-down'></i>"
      : "View My Story <i class='fas fa-arrow-down'></i>";
  }

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

  // Hero → 타임라인 전환
  const showBtn = document.getElementById("show-timeline");
  const timelineSection = document.getElementById("timeline");

  if (showBtn && hero && timelineSection) {
    showBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hero.style.display = "none";
      timelineSection.classList.remove("hidden");
      timelineSection.classList.add("fade-in");
    });
  }

  // 상단 로고 클릭 시 Hero 화면으로 돌아오기
  const backToHeroBtn = document.getElementById("back-to-hero");
  if (backToHeroBtn && hero && timelineSection) {
    backToHeroBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hero.style.display = "block";
      timelineSection.classList.add("hidden");
      timelineSection.classList.remove("fade-in");
      window.scrollTo(0, 0);
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