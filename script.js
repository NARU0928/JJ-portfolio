// ✅ 다국어 전환을 지원하는 완전한 버전 (언어 toggle 복구 및 메뉴도 전환)

let currentLang = "ko";
let timeline = [];
let dataContent = {}; // 팝업 데이터를 저장할 변수

// 새롭게 추가된 요소들
const dataModal = document.getElementById("dataModal");
const closeDataModalBtn = document.getElementById("closeDataModal");
const showDataModalBtn = document.getElementById("show-data-modal"); // '한눈에 보기' 버튼
const dataModalTitle = document.getElementById("data-modal-title");
const dataModalSections = document.getElementById("data-modal-sections");
const dataModalCertifications = document.getElementById("data-modal-certifications");
const certificationsHeading = document.getElementById("certifications-heading");
const certificationsTableHeaders = document.getElementById("certifications-table-headers");
const certificationsTableBody = document.getElementById("certifications-table-body");

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

  // 상단 언어 전환 버튼 텍스트
  document.getElementById("lang-label").textContent = currentLang === "ko" ? "English" : "한국어";

  // 메뉴 이름 바꾸기
  document.querySelector("nav ul li:nth-child(1) a").innerHTML = `<i class='fas fa-layer-group'></i> ${currentLang === "ko" ? "포트폴리오" : "Portfolio"}`;
  document.querySelector("nav ul li:nth-child(2) a").innerHTML = `<i class='fas fa-user'></i> ${currentLang === "ko" ? "소개" : "About"}`;
  document.querySelector("nav ul li:nth-child(3) a").innerHTML = `<i class='fas fa-envelope'></i> ${currentLang === "ko" ? "연락처" : "Contact"}`;

  // Hero 텍스트
  const hero = document.getElementById("hero");
  if (hero) {
    hero.querySelector("h1").innerHTML = currentLang === "ko"
      ? "교사가 아닌, <br class='mobile-break'><strong>삶의 설계자</strong>로<br class='mobile-break'>살고 있습니다."
      : "Not just a teacher, but a designer of life.";
    hero.querySelector("p").innerHTML = currentLang === "ko"
      ? "교육은 말보다 <strong>사람</strong>이 먼저였고,<br>기록보다 <strong>만남</strong>이 먼저였습니다.<br>이 이야기는 단지 이력서가 아니라,<br>한 사람의 <strong>길</strong>에 대한 이야기입니다." // 변경된 부분
      : "My education has always put people before words, and encounters before records.<br>This is not just a resume, but a story of a life.";
    
    // '이야기 보기' 버튼 텍스트 변경
    const showTimelineButton = document.getElementById("show-timeline");
    if (showTimelineButton) {
        showTimelineButton.innerHTML = currentLang === "ko"
            ? "이야기 보기 <i class='fas fa-arrow-down'></i>"
            : "View My Story <i class='fas fa-arrow-down'></i>";
    }

    // '한눈에 보기' 버튼 텍스트 변경
    if (showDataModalBtn) {
        showDataModalBtn.innerHTML = currentLang === "ko"
            ? "한눈에 보기 <i class='fas fa-database'></i>" // 변경된 부분
            : "At a Glance <i class='fas fa-database'></i>";
    }
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

  // 푸터 텍스트 변경
  const footerTextElement = document.querySelector("footer p");
  if (footerTextElement) {
    footerTextElement.textContent = currentLang === "ko"
      ? "© 2025 이정재. 모든 권리 보유."
      : "© 2025 Lee Jungjae. All rights reserved.";
  }

  loadTimeline(currentLang);
  loadData(currentLang); // 팝업 데이터도 로드
}

// 소개 및 연락처 섹션 높이 조정 함수
function adjustAboutContactHeight() {
  const characterImageBox = document.querySelector('.character-image-box');
  const aboutContactContent = document.querySelector('.about-contact-content');

  if (characterImageBox && aboutContactContent) {
    const imageHeight = characterImageBox.offsetHeight;
    aboutContactContent.style.minHeight = `${imageHeight}px`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // 초기 로고 텍스트 설정
  const logoTextElement = document.querySelector(".logo a");
  if (logoTextElement) {
    if (currentLang === "ko") {
      logoTextElement.innerHTML = "이정재의 <span>인생 포트폴리오</span>";
    } else {
      logoTextElement.innerHTML = "Lee Jungjae’s <span>Life Portfolio</span>";
    }
  }

  // 초기 Hero 텍스트 설정
  const hero = document.getElementById("hero");
  if (hero) {
    hero.querySelector("h1").innerHTML = currentLang === "ko"
      ? "교사가 아닌, <br class='mobile-break'><strong>삶의 설계자</strong>로<br class='mobile-break'>살고 있습니다."
      : "Not just a teacher, but a designer of life.";
    hero.querySelector("p").innerHTML = currentLang === "ko"
      ? "교육은 말보다 <strong>사람</strong>이 먼저였고,<br>기록보다 <strong>만남</strong>이 먼저였습니다.<br>이 이야기는 단지 이력서가 아니라,<br>한 사람의 <strong>길</strong>에 대한 이야기입니다." // 변경된 부분
      : "My education has always put people before words, and encounters before records.<br>This is not just a resume, but a story of a life.";
    
    const showTimelineButton = document.getElementById("show-timeline");
    if (showTimelineButton) {
        showTimelineButton.innerHTML = currentLang === "ko"
            ? "이야기 보기 <i class='fas fa-arrow-down'></i>"
            : "View My Story <i class='fas fa-arrow-down'></i>";
    }

    if (showDataModalBtn) {
        showDataModalBtn.innerHTML = currentLang === "ko"
            ? "한눈에 보기 <i class='fas fa-database'></i>" // 변경된 부분
            : "At a Glance <i class='fas fa-database'></i>";
    }
  }

  // 초기 푸터 텍스트 설정
  const footerTextElement = document.querySelector("footer p");
  if (footerTextElement) {
    footerTextElement.textContent = currentLang === "ko"
      ? "© 2025 이정재. 모든 권리 보유."
      : "© 2025 Lee Jungjae. All rights reserved.";
  }

  loadTimeline(currentLang);
  loadData(currentLang); // 초기 팝업 데이터 로드

  // PDF 모달 이벤트 리스너
  const pdfModal = document.getElementById("pdfModal");
  const pdfViewer = document.getElementById("pdfViewer");
  const closeModalBtn = document.getElementById("closeModal");

  document.addEventListener("click", (e) => {
    if (e.target.closest(".timeline-button")) {
      const btn = e.target.closest(".timeline-button");
      const url = btn.getAttribute("href");
      if (url.endsWith(".pdf")) {
        e.preventDefault();
        pdfViewer.src = url;
        pdfModal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // 스크롤 방지
      }
    }
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      pdfViewer.src = "";
      pdfModal.classList.add("hidden");
      document.body.style.overflow = "auto"; // 스크롤 복원
    });
  }

  // '데이터로 보기' 버튼 클릭 시 팝업 열기
  if (showDataModalBtn) {
    showDataModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dataModal.classList.remove("hidden");
      dataModal.classList.add("visible");
      document.body.style.overflow = "hidden";
      renderDataModal(); // 팝업 열 때마다 내용 다시 렌더링 (언어 변경 반영)
    });
  }

  // '데이터 팝업' 닫기 버튼
  if (closeDataModalBtn) {
    closeDataModalBtn.addEventListener("click", () => {
      dataModal.classList.remove("visible");
      dataModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    });
  }

  // 팝업 외부 클릭 시 닫기 (dataModal)
  if (dataModal) {
    dataModal.addEventListener("click", (e) => {
      if (e.target === dataModal) {
        dataModal.classList.remove("visible");
        dataModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Hero → 타임라인 전환
  const showBtn = document.getElementById("show-timeline");
  const timelineSection = document.getElementById("timeline");

  if (showBtn && hero && timelineSection) {
    showBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hero.style.display = "hidden";
      timelineSection.classList.remove("hidden");
      timelineSection.classList.add("fade-in");
    });
  }

  // 상단 로고 클릭 시 Hero 화면으로 돌아오기
const backToHeroBtn = document.getElementById("back-to-hero");
if (backToHeroBtn && hero && timelineSection) {
  backToHeroBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // ✅ Hero 초기 상태로 복원
    hero.classList.remove("hidden");                   // hero 보이기
    timelineSection.classList.add("hidden");           // 타임라인 숨기기
    timelineSection.classList.remove("fade-in");       // 애니메이션 제거
    window.scrollTo(0, 0);                              // 맨 위로 스크롤 이동

    // ✅ Hero 내부 버튼/구성 등 다시 보여지게 (초기 로드와 동일하게)
    const showTimelineButton = document.getElementById("show-timeline");
    if (showTimelineButton) {
      showTimelineButton.style.display = "inline-block"; // 혹시 숨겼다면 복원
    }

    const showDataModalBtn = document.getElementById("show-data-modal");
    if (showDataModalBtn) {
      showDataModalBtn.style.display = "inline-block";   // 마찬가지로 복원
    }

    // ✅ Hero 자체 스타일 정렬 깨짐 방지 (안전망)
    hero.style.display = ""; // 직접 설정한 display 속성 제거 (flex 복원)
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

  // 페이지 로드 시 및 창 크기 변경 시 높이 조정 함수 호출
  adjustAboutContactHeight();
  window.addEventListener('resize', adjustAboutContactHeight);
});

// 팝업 데이터 로드 함수
function loadData(lang) {
  const url = `./data/data-${lang}.json`;
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      dataContent = data;
      renderDataModal(); // 데이터 로드 후 팝업 내용 렌더링
    })
    .catch(err => console.error("❌ Data load error:", err));
}

// 팝업 내용 렌더링 함수
function renderDataModal() {
  if (!dataContent || Object.keys(dataContent).length === 0) {
    console.warn("데이터가 로드되지 않았습니다.");
    return;
  }

  dataModalTitle.textContent = dataContent.title;
  dataModalSections.innerHTML = ""; // 기존 내용 비우기

  // 각 섹션 렌더링
  dataContent.sections.forEach(section => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "data-section";

    const sectionHeading = document.createElement("h3");
    // 섹션 제목에 따른 아이콘 추가
    let iconClass = '';
    if (section.heading === "핵심 역량" || section.heading === "Core Competencies") {
      iconClass = 'fas fa-lightbulb';
    } else if (section.heading === "보유 기술" || section.heading === "Technical Skills") {
      iconClass = 'fas fa-laptop-code';
    } else if (section.heading === "관심 분야" || section.heading === "Areas of Interest") {
      iconClass = 'fas fa-heart';
    } else if (section.heading === "언어 능력" || section.heading === "Language Proficiency") {
      iconClass = 'fas fa-language';
    }
    sectionHeading.innerHTML = `<i class="${iconClass}"></i> ${section.heading}`;
    sectionDiv.appendChild(sectionHeading);

    // 관심 분야와 언어 능력 섹션은 다른 형태로 렌더링 (가로 배치 박스)
    if (section.heading === "관심 분야" || section.heading === "Areas of Interest" ||
        section.heading === "언어 능력" || section.heading === "Language Proficiency") {
      const itemContainer = document.createElement("div");
      itemContainer.className = "data-item-tags"; // 새로운 CSS 클래스

      section.items.forEach(item => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "data-tag"; // 새로운 CSS 클래스
        tagSpan.innerHTML = `<strong>${item.name}</strong>`;
        if (item.description) {
          tagSpan.innerHTML += `<br><small>${item.description}</small>`; // 작은 글씨로 설명 추가
        }
        itemContainer.appendChild(tagSpan);
      });
      sectionDiv.appendChild(itemContainer);
    } else {
      // 기존 세로 목록 렌더링
      const ul = document.createElement("ul");
      section.items.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.name}</strong>`;
        if (item.description) {
          li.innerHTML += `<p>${item.description}</p>`;
        }
        ul.appendChild(li);
      });
      sectionDiv.appendChild(ul);
    }
    dataModalSections.appendChild(sectionDiv);
  });

  // 자격증 테이블 렌더링
  certificationsHeading.textContent = dataContent.certifications.heading;
  certificationsTableHeaders.innerHTML = ""; // 기존 헤더 비우기
  certificationsTableBody.innerHTML = ""; // 기존 바디 비우기

  // 테이블 헤더 생성
  dataContent.certifications.table.headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    certificationsTableHeaders.appendChild(th);
  });

  // 테이블 행 생성
  dataContent.certifications.table.rows.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cellData => {
      const td = document.createElement("td");
      td.textContent = cellData;
      tr.appendChild(td);
    });
    certificationsTableBody.appendChild(tr);
  });
}

// 맨 위로 스크롤 버튼
const scrollTopBtn = document.getElementById("scrollTopBtn");

// 스크롤 이벤트 감지
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

// 클릭 시 부드럽게 상단 이동
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
