let currentLang = "ko";
let timeline = [];
let dataContent = {};

// 타임라인 렌더링 함수
function renderTimeline() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  const insertedAnchors = new Set(); // 앵커 중복 생성을 막기 위한 Set
  // 앵커 포인트로 사용할 연도들을 정의합니다.
  // 이 연도들의 타임라인 카드 위에 anchor-point div가 생성됩니다.
  const anchorYears = [2025, 2024, 2017, 2013, 2010, 2004];

  timeline.forEach(entry => {
    const year = entry.year;

    // 지정된 해에만 앵커 포인트 생성 및 중복 방지
    if (anchorYears.includes(year) && !insertedAnchors.has(year)) {
      const anchor = document.createElement("div");
      anchor.className = "anchor-point";
      anchor.id = `year-${year}`; // 예: year-2025
      container.appendChild(anchor);
      insertedAnchors.add(year);
    }

    const card = createTimelineCard(entry);
    container.appendChild(card);
    observer.observe(card);
  });

  // 타임라인 렌더링이 완료된 후 해시 스크롤 처리
  handleHashScroll();
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

  entry.links.forEach(link => {
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

function getIconClass(url) {
  if (url.endsWith(".pdf")) return "fas fa-file-pdf";
  if (url.startsWith("http")) return "fas fa-up-right-from-square";
  return "fas fa-link";
}

function loadTimeline(lang) {
  fetch(`./data/timeline-${lang}.json`)
    .then(res => res.json())
    .then(data => {
      timeline = data;
      renderTimeline(); // 타임라인 데이터를 로드한 후 렌더링
    })
    .catch(err => console.error("❌ Timeline load error:", err));
}

function loadData(lang) {
  fetch(`./data/data-${lang}.json`)
    .then(res => res.json())
    .then(data => {
      dataContent = data;
      renderDataModal();
    })
    .catch(err => console.error("❌ Data load error:", err));
}

function switchLanguage() {
  currentLang = currentLang === "ko" ? "en" : "ko";
  document.getElementById("lang-label").textContent = currentLang === "ko" ? "English" : "한국어";

  document.querySelector("nav ul li:nth-child(1) a").innerHTML = `<i class='fas fa-layer-group'></i> ${currentLang === "ko" ? "포트폴리오" : "Portfolio"}`;
  document.querySelector("nav ul li:nth-child(2) a").innerHTML = `<i class='fas fa-user'></i> ${currentLang === "ko" ? "소개" : "About"}`;
  document.querySelector("nav ul li:nth-child(3) a").innerHTML = `<i class='fas fa-envelope'></i> ${currentLang === "ko" ? "연락처" : "Contact"}`;

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

// 해시 앵커 스크롤
function handleHashScroll() {
  const hash = window.location.hash;
  if (hash && document.querySelector(hash)) {
    // 타임라인 렌더링 이후에 스크롤되도록 setTimeout 사용
    setTimeout(() => {
      document.querySelector(hash).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300); // 충분한 렌더링 지연 시간
  }

  // 앵커 버튼 클릭 시 부드럽게 스크롤
  document.querySelectorAll('.anchor-btn').forEach(btn => {
    // 기존 이벤트 리스너 제거 (중복 방지)
    btn.removeEventListener('click', handleAnchorClick);
    // 새 이벤트 리스너 추가
    btn.addEventListener('click', handleAnchorClick);
  });
}

function handleAnchorClick(e) {
  const hash = this.getAttribute('href');
  if (hash && document.querySelector(hash)) {
    e.preventDefault(); // 기본 앵커 동작 방지
    // URL의 해시를 업데이트하여 브라우저 기록에 남김
    history.pushState(null, '', hash);
    // 부드러운 스크롤
    setTimeout(() => {
      document.querySelector(hash).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // 약간의 지연으로 부드러운 스크롤
  }
}

// 데이터 모달 렌더링
function renderDataModal() {
  if (!dataContent || !dataContent.sections) return;

  document.getElementById("data-modal-title").textContent = dataContent.title;
  const sectionBox = document.getElementById("data-modal-sections");
  sectionBox.innerHTML = "";

  dataContent.sections.forEach(section => {
    const div = document.createElement("div");
    div.className = "data-section";

    const h3 = document.createElement("h3");
    h3.textContent = section.heading;
    div.appendChild(h3);

    const ul = document.createElement("ul");
    section.items.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.name}</strong>`;
      if (item.description) li.innerHTML += `<p>${item.description}</p>`;
      ul.appendChild(li);
    });

    div.appendChild(ul);
    sectionBox.appendChild(div);
  });

  // 자격증
  const cert = dataContent.certifications;
  document.getElementById("certifications-heading").textContent = cert.heading;

  const headers = document.getElementById("certifications-table-headers");
  const body = document.getElementById("certifications-table-body");
  headers.innerHTML = "";
  body.innerHTML = "";

  cert.table.headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headers.appendChild(th);
  });

  cert.table.rows.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

// 카드 등장 애니메이션
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("timeline").classList.remove("hidden");

  loadTimeline(currentLang); // 타임라인 로드 및 렌더링 시작
  loadData(currentLang); // 데이터 로드 및 모달 렌더링

  // handleHashScroll은 renderTimeline 내부에서 호출되므로 여기서는 직접 호출할 필요 없음
  // 하지만 초기 페이지 로드 시 URL에 해시가 있다면 처리하기 위해 DOMContentLoaded에서는 한 번 호출해주는 것이 좋습니다.
  // renderTimeline이 비동기적으로 로드되므로, 초기 해시 스크롤은 loadTimeline 완료 후 처리하도록 renderTimeline 내부에 넣는 것이 더 안정적입니다.
  // 따라서 아래 호출은 제거하거나, 정말 초기 로드 시점만 고려할 때 사용합니다.
  // 이 예시에서는 renderTimeline 내부에서 호출하므로 여기서는 제거합니다.
  // handleHashScroll(); // 이 줄은 이전 대화에서 제가 제거하라고 권고했던 줄입니다. 다시 제거해주세요.

  document.getElementById("toggle-lang").addEventListener("click", e => {
    e.preventDefault();
    switchLanguage();
  });

  document.getElementById("show-data-modal").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("dataModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  document.getElementById("closeDataModal").addEventListener("click", () => {
    document.getElementById("dataModal").classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  // PDF 팝업
  const pdfViewer = document.getElementById("pdfViewer");
  document.getElementById("closeModal").addEventListener("click", () => {
    pdfViewer.src = "";
    document.getElementById("pdfModal").classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  // 외부 링크 팝업
  const externalViewer = document.getElementById("externalViewer");
  document.getElementById("closeExternalModal").addEventListener("click", () => {
    externalViewer.src = "";
    document.getElementById("externalModal").classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  document.addEventListener("click", e => {
    const btn = e.target.closest(".timeline-button");
    if (!btn || !btn.href) return;

    if (btn.href.endsWith(".pdf")) {
      e.preventDefault();
      pdfViewer.src = btn.href;
      document.getElementById("pdfModal").classList.remove("hidden");
      document.body.style.overflow = "hidden";
    } else if (btn.href.startsWith("http")) {
      e.preventDefault();
      externalViewer.src = btn.href;
      document.getElementById("externalModal").classList.remove("hidden");
      document.body.style.overflow = "auto";
    }
  });

  // Scroll Top
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});