let currentLang = "ko";
let timeline = [];
let dataContent = {};

// 데이터/타임라인 모달 관련 요소
const dataModal = document.getElementById("dataModal");
const closeDataModalBtn = document.getElementById("closeDataModal");
const showDataModalBtn = document.getElementById("show-data-modal");
const dataModalTitle = document.getElementById("data-modal-title");
const dataModalSections = document.getElementById("data-modal-sections");
const dataModalCertifications = document.getElementById("data-modal-certifications");
const certificationsHeading = document.getElementById("certifications-heading");
const certificationsTableHeaders = document.getElementById("certifications-table-headers");
const certificationsTableBody = document.getElementById("certifications-table-body");

// 아이콘 처리 함수
function getIconClass(url) {
  if (url.endsWith(".pdf")) return "fas fa-file-pdf";
  if (url.startsWith("http")) return "fas fa-up-right-from-square";
  return "fas fa-link";
}

// 타임라인 카드 생성
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

// 타임라인 렌더링
function renderTimeline() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";
  timeline.forEach(entry => {
    const card = createTimelineCard(entry);
    container.appendChild(card);
    observer.observe(card);
  });
}

// 타임라인 데이터 로딩
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

// 다국어 전환
function switchLanguage() {
  currentLang = currentLang === "ko" ? "en" : "ko";
  document.getElementById("lang-label").textContent = currentLang === "ko" ? "English" : "한국어";

  document.querySelector("nav ul li:nth-child(1) a").innerHTML = `<i class='fas fa-layer-group'></i> ${currentLang === "ko" ? "포트폴리오" : "Portfolio"}`;
  document.querySelector("nav ul li:nth-child(2) a").innerHTML = `<i class='fas fa-user'></i> ${currentLang === "ko" ? "소개" : "About"}`;
  document.querySelector("nav ul li:nth-child(3) a").innerHTML = `<i class='fas fa-envelope'></i> ${currentLang === "ko" ? "연락처" : "Contact"}`;

  const hero = document.getElementById("hero");
  if (hero) {
    hero.querySelector("h1").innerHTML = currentLang === "ko"
      ? "교사가 아닌, <br class='mobile-break'><strong>삶의 설계자</strong>로<br class='mobile-break'>살고 있습니다."
      : "Not just a teacher, but a designer of life.";
    hero.querySelector("p").innerHTML = currentLang === "ko"
      ? "교육은 말보다 <strong>사람</strong>이 먼저였고,<br>기록보다 <strong>만남</strong>이 먼저였습니다.<br>이 이야기는 단지 이력서가 아니라,<br>한 사람의 <strong>길</strong>에 대한 이야기입니다."
      : "My education has always put people before words, and encounters before records.<br>This is not just a resume, but a story of a life.";

    document.getElementById("show-timeline").innerHTML =
      currentLang === "ko" ? "이야기 보기 <i class='fas fa-arrow-down'></i>" : "View My Story <i class='fas fa-arrow-down'></i>";
    showDataModalBtn.innerHTML =
      currentLang === "ko" ? "한눈에 보기 <i class='fas fa-database'></i>" : "At a Glance <i class='fas fa-database'></i>";
  }

  document.getElementById("about").querySelector("h2").textContent = currentLang === "ko" ? "소개" : "About";
  document.getElementById("about").querySelector("p").textContent = currentLang === "ko"
    ? "사람과 교육의 연결을 삶으로 살아가는 사람, 이정재입니다."
    : "I am Lee Jungjae, someone who lives by connecting people and education.";

  document.getElementById("contact").querySelector("h2").textContent = currentLang === "ko" ? "연락하기" : "Contact";

  const logoTextElement = document.querySelector(".logo a");
  logoTextElement.innerHTML = currentLang === "ko"
    ? "이정재의 <span>인생 포트폴리오</span>"
    : "Lee Jungjae’s <span>Life Portfolio</span>";

  document.querySelector("footer p").textContent = currentLang === "ko"
    ? "© 2025 이정재. 모든 권리 보유."
    : "© 2025 Lee Jungjae. All rights reserved.";

  loadTimeline(currentLang);
  loadData(currentLang);
}

// 팝업 데이터 로드 및 렌더링
function loadData(lang) {
  const url = `./data/data-${lang}.json`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      dataContent = data;
      renderDataModal();
    })
    .catch(err => console.error("❌ Data load error:", err));
}

function renderDataModal() {
  if (!dataContent || Object.keys(dataContent).length === 0) return;

  dataModalTitle.textContent = dataContent.title;
  dataModalSections.innerHTML = "";

  dataContent.sections.forEach(section => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "data-section";

    const sectionHeading = document.createElement("h3");
    let iconClass = '';
    if (section.heading.includes("역량") || section.heading.includes("Competencies")) iconClass = 'fas fa-lightbulb';
    else if (section.heading.includes("기술") || section.heading.includes("Technical")) iconClass = 'fas fa-laptop-code';
    else if (section.heading.includes("분야") || section.heading.includes("Interest")) iconClass = 'fas fa-heart';
    else if (section.heading.includes("언어") || section.heading.includes("Language")) iconClass = 'fas fa-language';
    sectionHeading.innerHTML = `<i class="${iconClass}"></i> ${section.heading}`;
    sectionDiv.appendChild(sectionHeading);

    if (section.heading.includes("분야") || section.heading.includes("언어")) {
      const itemContainer = document.createElement("div");
      itemContainer.className = "data-item-tags";
      section.items.forEach(item => {
        const tag = document.createElement("span");
        tag.className = "data-tag";
        tag.innerHTML = `<strong>${item.name}</strong>`;
        if (item.description) tag.innerHTML += `<br><small>${item.description}</small>`;
        itemContainer.appendChild(tag);
      });
      sectionDiv.appendChild(itemContainer);
    } else {
      const ul = document.createElement("ul");
      section.items.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.name}</strong>`;
        if (item.description) li.innerHTML += `<p>${item.description}</p>`;
        ul.appendChild(li);
      });
      sectionDiv.appendChild(ul);
    }

    dataModalSections.appendChild(sectionDiv);
  });

  // 자격증 테이블
  certificationsHeading.textContent = dataContent.certifications.heading;
  certificationsTableHeaders.innerHTML = "";
  certificationsTableBody.innerHTML = "";

  dataContent.certifications.table.headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    certificationsTableHeaders.appendChild(th);
  });

  dataContent.certifications.table.rows.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    certificationsTableBody.appendChild(tr);
  });
}

// Intersection Observer로 타임라인 애니메이션
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

// 초기 실행
window.addEventListener("DOMContentLoaded", () => {
  loadTimeline(currentLang);
  loadData(currentLang);

  document.getElementById("toggle-lang").addEventListener("click", (e) => {
    e.preventDefault();
    switchLanguage();
  });

  // 한눈에 보기
  showDataModalBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    dataModal.classList.remove("hidden");
    dataModal.classList.add("visible");
    document.body.style.overflow = "hidden";
    renderDataModal();
  });

  closeDataModalBtn?.addEventListener("click", () => {
    dataModal.classList.remove("visible");
    dataModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  dataModal?.addEventListener("click", (e) => {
    if (e.target === dataModal) {
      dataModal.classList.remove("visible");
      dataModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });

  // PDF 팝업
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
        document.body.style.overflow = "hidden";
      }
    }
  });

  closeModalBtn?.addEventListener("click", () => {
    pdfViewer.src = "";
    pdfModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  // Scroll Top 버튼
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
