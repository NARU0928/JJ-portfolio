let currentLang = "ko";
let timeline = [];
let dataContent = {};

// 타임라인 렌더링 함수
function renderTimeline() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  // 앵커 포인트로 사용할 연도들을 정의합니다.
  const anchorYears = [2025, 2024, 2017, 2013, 2010];
  const anchorLabels = {
    ko: {
      2025: "2025~2024<br><small>지속가능한 대안교육 동행하기</small>",
      2024: "2024~2017<br><small>교육 가능성 찾기</small>",
      2017: "2017~2013<br><small>대안교육의 시작과 이해</small>",
      2013: "2013~2010<br><small>전문성 향상을 위한 준비</small>",
      2010: "2010~2004<br><small>기본기 형성</small>"
    },
    en: {
      2025: "2025~2024<br><small>Sustainable Alternative Education</small>",
      2024: "2024~2017<br><small>Finding Educational Possibilities</small>",
      2017: "2017~2013<br><small>Beginning of Alternative Education</small>",
      2013: "2013~2010<br><small>Professional Development</small>",
      2010: "2010~2004<br><small>Foundation Building</small>"
    }
  };

  // 상단 앵커 버튼 업데이트
  const anchorButtons = document.querySelector('.anchor-buttons');
  anchorButtons.innerHTML = anchorYears.map(year => {
    const label = anchorLabels[currentLang][year];
    return `<a href="#year-${year}" class="anchor-btn">${label}</a>`;
  }).join('');

  // 스크롤 이벤트 리스너 추가
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) {
      const timeline = document.getElementById('timeline');
      if (timeline) {
        const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY < timelineTop - 10) {
          document.body.classList.add('at-top');
        } else {
          document.body.classList.remove('at-top');
        }
      }
    }
  });

  timeline.forEach(entry => {
    const year = parseInt(entry.year);
    
    // 앵커 연도인 경우 앵커 포인트 생성
    if (anchorYears.includes(year)) {
      const anchor = document.createElement("div");
      anchor.className = "anchor-point";
      anchor.id = `year-${year}`;
      container.appendChild(anchor);
    }

    const card = createTimelineCard(entry);
    
    // 앵커 연도인 경우 카드에 앵커 버튼 추가
    if (anchorYears.includes(year)) {
      const anchorBtn = document.createElement("a");
      anchorBtn.href = `#year-${year}`;
      anchorBtn.className = "timeline-anchor-btn";
      // 타임라인 내 앵커 버튼에는 연도만 표시
      anchorBtn.innerHTML = `<span>${year}</span>`;
      card.appendChild(anchorBtn);
    }
    
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

  // 내비게이션 링크 텍스트 변경
  document.querySelector("nav ul li:nth-child(1) a").innerHTML = `<i class='fas fa-layer-group'></i> ${currentLang === "ko" ? "포트폴리오" : "Portfolio"}`;
  document.querySelector("nav ul li:nth-child(2) a").innerHTML = `<i class='fas fa-user'></i> ${currentLang === "ko" ? "소개" : "About"}`;
  document.querySelector("nav ul li:nth-child(3) a").innerHTML = `<i class='fas fa-envelope'></i> ${currentLang === "ko" ? "연락처" : "Contact"}`;

  const logoTextElement = document.querySelector(".logo a");
  logoTextElement.innerHTML = currentLang === "ko"
    ? "이정재의 <span>인생 포트폴리오</span>"
    : "Lee Jungjae's <span>Life Portfolio</span>";

  document.querySelector("footer p").textContent = currentLang === "ko"
    ? "© 2025 이정재. 모든 권리 보유."
    : "© 2025 Lee Jungjae. All rights reserved.";

  // Hero 섹션 텍스트 변경
  document.querySelector(".hero h1").innerHTML = currentLang === "ko"
    ? "교사가 아닌, <br class='mobile-break'><strong>삶의 설계자</strong>로<br class='mobile-break'>살고 있습니다."
    : "Not just a teacher, <br class='mobile-break'>I live as a <strong>life designer</strong>.";

  document.querySelector(".hero p").innerHTML = currentLang === "ko"
    ? "교육은 말보다 <strong>사람</strong>이 먼저였고,<br>기록보다 <strong>만남</strong>이 먼저였습니다.<br>이 이야기는 단지 이력서가 아니라,<br>한 사람의 <strong>길</strong>에 대한 이야기입니다."
    : "Education prioritized <strong>people</strong> over words,<br>and <strong>encounters</strong> over records.<br>This story is not just a resume,<br>but a narrative of one's <strong>path</strong>.";

  document.querySelector(".hero #show-timeline").innerHTML = currentLang === "ko"
    ? `이야기 보기 <i class='fas fa-arrow-down'></i>`
    : `View Story <i class='fas fa-arrow-down'></i>`;

  document.querySelector(".hero #show-data-modal").innerHTML = currentLang === "ko"
    ? `한눈에 보기 <i class='fas fa-database'></i>`
    : `View All <i class='fas fa-database'></i>`;

  // 소개 및 연락처 섹션 텍스트 변경
  document.querySelector("#about h2").textContent = currentLang === "ko" ? "소개" : "About";
  document.querySelector("#about p").textContent = currentLang === "ko" 
    ? "삶의 길을 밝히는 교육을 통해 사람과 사람, 배움과 세상을 연결하는 삶의 설계자, 이정재입니다." 
    : "I am Lee Jungjae, a life designer who connects people to people, and learning to the world through education that illuminates the path of life.";
  document.querySelector("#contact h2").textContent = currentLang === "ko" ? "연락하기" : "Contact";

  // 앵커 버튼 텍스트 변경
  document.querySelector('.anchor-group .anchor-buttons a:nth-child(1)').innerHTML = currentLang === "ko" ? `2025~2024<br><small>지속가능한 대안교육 동행하기</small>` : `2025~2024<br><small>Accompanying Sustainable Alternative Education</small>`;
  document.querySelector('.anchor-group .anchor-buttons a:nth-child(2)').innerHTML = currentLang === "ko" ? `2024~2017<br><small>교육 가능성 찾기</small>` : `2024~2017<br><small>Exploring Educational Possibilities</small>`;
  document.querySelector('.anchor-group .anchor-buttons a:nth-child(3)').innerHTML = currentLang === "ko" ? `2017~2013<br><small>대안교육의 시작과 이해</small>` : `2017~2013<br><small>Beginning and Understanding Alternative Education</small>`;
  document.querySelector('.anchor-group .anchor-buttons a:nth-child(4)').innerHTML = currentLang === "ko" ? `2013~2010<br><small>전문성 향상을 위한 준비</small>` : `2013~2010<br><small>Preparation for Professional Development</small>`;
  document.querySelector('.anchor-group .anchor-buttons a:nth-child(5)').innerHTML = currentLang === "ko" ? `2010~2004<br><small>기본기 형성</small>` : `2010~2004<br><small>Foundation Building</small>`;


  loadTimeline(currentLang);
  loadData(currentLang);
}

// 해시 앵커 스크롤
function handleHashScroll() {
  const hash = window.location.hash;
  if (hash) {
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      // 타임라인 렌더링 이후에 스크롤되도록 setTimeout 사용
      setTimeout(() => {
        const headerOffset = 100; // 상단 여백 조정
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 300);
    }
  }

  // 앵커 버튼 클릭 이벤트 처리
  document.querySelectorAll('.anchor-btn, .timeline-anchor-btn').forEach(btn => {
    btn.removeEventListener('click', handleAnchorClick);
    btn.addEventListener('click', handleAnchorClick);
  });
}

function handleAnchorClick(e) {
  e.preventDefault();
  const targetId = this.getAttribute('href');
  const targetElement = document.querySelector(targetId);
  
  if (targetElement) {
    const headerOffset = 100;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // URL 해시 업데이트
    history.pushState(null, null, targetId);
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

  // 초기 로드 시 URL 해시가 있다면 처리하기 위해 DOMContentLoaded에서 한 번 호출 (이전 제거된 코드 복원)
  // renderTimeline이 비동기적으로 로드되므로, renderTimeline 내부에서 handleHashScroll을 호출하는 것이 더 안정적입니다.
  // 이중 호출을 막기 위해 여기서는 제거하고 renderTimeline 내에서만 호출하도록 유지합니다.

  document.getElementById("toggle-lang").addEventListener("click", e => {
    e.preventDefault();
    switchLanguage();
  });

  document.getElementById("show-data-modal").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("dataModal").classList.remove("hidden");
    document.getElementById("dataModal").classList.add("visible"); // visible 클래스 추가
    document.body.style.overflow = "hidden";
  });

  document.getElementById("closeDataModal").addEventListener("click", () => {
    document.getElementById("dataModal").classList.remove("visible"); // visible 클래스 제거
    setTimeout(() => { // 애니메이션 후 hidden 적용
        document.getElementById("dataModal").classList.add("hidden");
    }, 300); // CSS transition 시간과 일치
    document.body.style.overflow = "auto";
  });

  // PDF 팝업
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfModal = document.getElementById("pdfModal");
  let currentZoom = 1;

  // PDF 컨트롤 기능
  document.getElementById("pdfZoomIn").addEventListener("click", () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // 모바일에서는 더 작은 단위로 확대
      currentZoom = Math.min(currentZoom + 0.1, 1.5);
    } else {
      currentZoom = Math.min(currentZoom + 0.25, 2);
    }
    updatePdfZoom();
  });

  document.getElementById("pdfZoomOut").addEventListener("click", () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // 모바일에서는 더 작은 단위로 축소
      currentZoom = Math.max(currentZoom - 0.1, 0.5);
    } else {
      currentZoom = Math.max(currentZoom - 0.25, 0.5);
    }
    updatePdfZoom();
  });

  document.getElementById("pdfFitWidth").addEventListener("click", () => {
    const isMobile = window.innerWidth <= 768;
    const iframe = document.getElementById("pdfViewer");
    
    if (isMobile) {
      // 모바일에서는 PDF URL 파라미터를 통해 화면에 맞게 조정
      const currentUrl = new URL(iframe.src);
      currentUrl.searchParams.set('view', 'FitH');
      iframe.src = currentUrl.toString();
    } else {
      // 데스크탑에서는 기존 동작 유지
      iframe.style.width = "100%";
      iframe.style.transform = "none";
    }
    currentZoom = 1;
  });

  function updatePdfZoom() {
    const iframe = document.getElementById("pdfViewer");
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // 모바일에서는 transform 대신 scale 파라미터 사용
      const currentUrl = new URL(iframe.src);
      currentUrl.searchParams.set('zoom', currentZoom * 100);
      iframe.src = currentUrl.toString();
    } else {
      // 데스크탑에서는 기존 방식 유지
      iframe.style.transform = `scale(${currentZoom})`;
      iframe.style.transformOrigin = "0 0";
    }
  }

  document.getElementById("closeModal").addEventListener("click", () => {
    pdfViewer.src = "";
    pdfModal.classList.add("hidden");
    document.body.style.overflow = "auto";
    // PDF 뷰어 상태 초기화
    currentZoom = 1;
    pdfViewer.style.transform = "none";
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
      // 모바일 환경 감지
      const isMobile = window.innerWidth <= 768;
      
      // PDF URL에 파라미터 추가
      const pdfUrl = new URL(btn.href);
      if (isMobile) {
        // 모바일에서는 자동으로 화면에 맞게 표시되도록 설정
        pdfUrl.searchParams.set('view', 'FitH');
        pdfUrl.searchParams.set('embedded', 'true');
        pdfUrl.searchParams.set('toolbar', '0');
        pdfUrl.searchParams.set('navpanes', '0');
        pdfUrl.searchParams.set('scrollbar', '0');
      }
      
      pdfViewer.src = pdfUrl.toString();
      pdfModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      
      // 모바일에서는 초기 확대/축소 비율 조정
      if (isMobile) {
        currentZoom = 1;
        pdfViewer.style.transform = "none";
        // 모바일에서 PDF가 화면에 맞게 표시되도록 설정
        pdfViewer.style.width = "100%";
        pdfViewer.style.height = "100%";
      } else {
        // 데스크탑에서는 기존 설정 유지
        currentZoom = 1;
        pdfViewer.style.transform = "none";
      }
    } else if (btn.href.startsWith("http")) {
      e.preventDefault();
      externalViewer.src = btn.href;
      document.getElementById("externalModal").classList.remove("hidden");
      document.body.style.overflow = "hidden";
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

function openPdfModal(pdfUrl) {
  const modal = document.getElementById('pdfModal');
  const pdfContent = document.querySelector('.pdf-content');
  const iframe = pdfContent.querySelector('iframe');
  const isMobile = window.innerWidth <= 768;

  // PDF URL에 파라미터 추가
  let finalPdfUrl = pdfUrl;
  if (isMobile) {
    finalPdfUrl = `${pdfUrl}#view=FitH&embedded=true&toolbar=0&navpanes=0&scrollbar=1`;
  } else {
    finalPdfUrl = `${pdfUrl}#view=FitH&embedded=true&toolbar=0&navpanes=0`;
  }

  iframe.src = finalPdfUrl;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // iframe 로드 완료 후 처리
  iframe.onload = function() {
    try {
      // iframe 내부의 문서에 접근
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // PDF 뷰어의 스크롤 가능하도록 설정
      if (iframeDoc.body) {
        iframeDoc.body.style.overflow = 'auto';
        iframeDoc.body.style.height = '100%';
        iframeDoc.body.style.margin = '0';
        iframeDoc.body.style.padding = '0';
      }

      // PDF 뷰어 컨테이너 스타일 조정
      const viewer = iframeDoc.querySelector('#viewer');
      if (viewer) {
        viewer.style.height = '100%';
        viewer.style.overflow = 'auto';
      }
    } catch (e) {
      console.log('PDF 뷰어 스타일 조정 중 오류:', e);
    }
  };
}

// PDF 컨트롤 함수들 수정
function zoomIn() {
  const iframe = document.querySelector('.pdf-content iframe');
  const isMobile = window.innerWidth <= 768;
  const currentUrl = iframe.src;
  const zoomStep = isMobile ? 0.1 : 0.2;
  
  // 현재 줌 레벨 추출
  const currentZoom = parseFloat(currentUrl.match(/zoom=([\d.]+)/)?.[1] || '1.0');
  const newZoom = Math.min(currentZoom + zoomStep, isMobile ? 2.0 : 3.0);
  
  // URL 업데이트
  const newUrl = currentUrl.replace(/zoom=[\d.]+/, `zoom=${newZoom}`) || 
                `${currentUrl}${currentUrl.includes('?') ? '&' : '#'}zoom=${newZoom}`;
  iframe.src = newUrl;
}

function zoomOut() {
  const iframe = document.querySelector('.pdf-content iframe');
  const isMobile = window.innerWidth <= 768;
  const currentUrl = iframe.src;
  const zoomStep = isMobile ? 0.1 : 0.2;
  
  // 현재 줌 레벨 추출
  const currentZoom = parseFloat(currentUrl.match(/zoom=([\d.]+)/)?.[1] || '1.0');
  const newZoom = Math.max(currentZoom - zoomStep, isMobile ? 0.5 : 0.3);
  
  // URL 업데이트
  const newUrl = currentUrl.replace(/zoom=[\d.]+/, `zoom=${newZoom}`) || 
                `${currentUrl}${currentUrl.includes('?') ? '&' : '#'}zoom=${newZoom}`;
  iframe.src = newUrl;
}

function fitWidth() {
  const iframe = document.querySelector('.pdf-content iframe');
  const isMobile = window.innerWidth <= 768;
  const currentUrl = iframe.src;
  
  // FitH 파라미터 추가/업데이트
  const newUrl = currentUrl.replace(/#.*$/, '') + 
                `#view=FitH&embedded=true&toolbar=0&navpanes=0${isMobile ? '&scrollbar=1' : ''}`;
  iframe.src = newUrl;
}