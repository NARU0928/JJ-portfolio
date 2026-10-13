let currentLang = "ko";
let timeline = [];
let dataContent = {};
let currentZoom = 1;
const ZOOM_STEP = 0.25;
const MOBILE_ZOOM_STEP = 0.1;

// 스크롤 버튼 관련 전역 변수
let scrollTopBtn;

// 타임라인 렌더링 함수
function renderTimeline() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  // 앵커 포인트로 사용할 연도들을 정의합니다.
  const anchorYears = [2025, 2024, 2017, 2013, 2010];
  const anchorLabels = {
    ko: {
      2025: "2025~2024<br><small>지속가능한 대안교육 동행</small>",
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
  title.textContent = `${entry.year} · ${entry.title}`;
  card.appendChild(title);
  
  const text = document.createElement("p");
  text.textContent = entry.text;
  card.appendChild(text);
  
  if (entry.links && entry.links.length > 0) {
    const linksContainer = document.createElement("div");
    linksContainer.className = "timeline-links";
    
    entry.links.forEach(link => {
      const linkBtn = document.createElement("a");
      linkBtn.href = link.url;
      linkBtn.textContent = link.label;
      linkBtn.className = "timeline-button";
      
      // 링크 타입에 따른 클래스와 동작 설정
      if (link.url.toLowerCase().endsWith('.pdf')) {
        linkBtn.classList.add('pdf-link');
        linkBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openPdfViewer(link.url, link.label);
        });
      } else if (link.url.startsWith('http')) {
        linkBtn.classList.add('external-link');
        linkBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openLinkViewer(link.url, link.label);
        });
      }
      
      // 아이콘 추가
      const icon = document.createElement("i");
      icon.className = getIconClass(link.url);
      linkBtn.insertBefore(icon, linkBtn.firstChild);
      
      linksContainer.appendChild(linkBtn);
    });
    
    card.appendChild(linksContainer);
  }
  
  return card;
}

function getIconClass(url) {
  if (url.toLowerCase().endsWith('.pdf')) {
    return 'fas fa-file-pdf';
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'fab fa-youtube';
  } else if (url.includes('instagram.com')) {
    return 'fab fa-instagram';
  } else if (url.includes('blogspot.com') || url.includes('blog')) {
    return 'fas fa-blog';
  } else if (url.startsWith('http')) {
    return 'fas fa-external-link-alt';
  }
  return 'fas fa-link';
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

    // 관심분야와 언어능력 섹션은 카드 형태로 표시
    if (section.heading === "관심 분야" || section.heading === "Areas of Interest") {
      const cardContainer = document.createElement("div");
      cardContainer.className = "interest-cards";
      
      section.items.forEach(item => {
        const card = document.createElement("div");
        card.className = "interest-card";
        
        // 아이콘 매핑
        const iconMap = {
          "대안 교육": "fa-graduation-cap",
          "Alternative Education": "fa-graduation-cap",
          "느린 학습자 교육": "fa-user-graduate",
          "Slow Learner Education": "fa-user-graduate",
          "삶 중심 교육": "fa-heart",
          "Life-Centered Education": "fa-heart",
          "디지털 교육 혁신": "fa-laptop-code",
          "Digital Education Innovation": "fa-laptop-code",
          "교육 생태계 구축": "fa-seedling",
          "Building Educational Ecosystems": "fa-seedling"
        };
        
        const icon = document.createElement("i");
        icon.className = `fas ${iconMap[item.name] || "fa-star"} interest-icon`;
        card.appendChild(icon);
        
        const name = document.createElement("span");
        name.textContent = item.name;
        card.appendChild(name);
        
        cardContainer.appendChild(card);
      });
      
      div.appendChild(cardContainer);
    } else if (section.heading === "언어 능력" || section.heading === "Language Proficiency") {
      const cardContainer = document.createElement("div");
      cardContainer.className = "language-cards";
      
      section.items.forEach(item => {
        const card = document.createElement("div");
        card.className = "language-card";
        
        // 언어별 아이콘 매핑
        const iconMap = {
          "한국어": "fa-flag",
          "Korean": "fa-flag",
          "영어": "fa-globe-americas",
          "English": "fa-globe-americas"
        };
        
        const icon = document.createElement("i");
        icon.className = `fas ${iconMap[item.name] || "fa-language"} language-icon`;
        card.appendChild(icon);
        
        const content = document.createElement("div");
        content.className = "language-content";
        
        const name = document.createElement("strong");
        name.textContent = item.name;
        content.appendChild(name);
        
        const level = document.createElement("span");
        level.className = "language-level";
        level.textContent = item.description;
        content.appendChild(level);
        
        card.appendChild(content);
        cardContainer.appendChild(card);
      });
      
      div.appendChild(cardContainer);
    } else {
      // 다른 섹션들은 기존 방식대로 표시
      const ul = document.createElement("ul");
      section.items.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.name}</strong>`;
        if (item.description) li.innerHTML += `<p>${item.description}</p>`;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }

    sectionBox.appendChild(div);
  });

  // 자격증 섹션 렌더링 (기존 코드 유지)
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

  // 스크롤 버튼 초기화
  scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    // 스크롤 이벤트 리스너
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });

    // 클릭 이벤트 리스너
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

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

  // PDF 뷰어 관련 이벤트 리스너
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfModal = document.getElementById("pdfModal");
  const closePdfBtn = document.getElementById("closePdfViewer");

  // PDF 뷰어 닫기
  if (closePdfBtn) {
    closePdfBtn.addEventListener("click", closePdfViewer);
  }

  // 모달 외부 클릭 시 닫기
  pdfModal.addEventListener("click", (e) => {
    if (e.target === pdfModal) {
      closePdfViewer();
    }
  });

  // 윈도우 리사이즈 이벤트
  window.addEventListener("resize", () => {
    if (pdfModal && !pdfModal.classList.contains("hidden")) {
      adjustPdfViewer();
    }
  });

  // PDF 뷰어 스타일 조정
  adjustPdfViewer();
});

function openPdfViewer(url, title) {
  const modal = document.getElementById("pdfModal");
  const viewer = document.getElementById("pdfViewer");
  const titleElement = document.getElementById("pdfTitle");
  
  if (!modal || !viewer || !titleElement) {
    console.error("PDF 뷰어 요소를 찾을 수 없습니다.");
    return;
  }
  
  try {
    // 모바일 기기 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // PDF URL 파라미터 설정
    const pdfUrl = new URL(url, window.location.href);
    
    // 공통 파라미터
    pdfUrl.searchParams.set('toolbar', '1');
    pdfUrl.searchParams.set('navpanes', '1');
    pdfUrl.searchParams.set('scrollbar', '1');
    pdfUrl.searchParams.set('pagemode', 'none');
    
    if (isMobile) {
      // 모바일 전용 파라미터
      pdfUrl.searchParams.set('view', 'FitH');
      pdfUrl.searchParams.set('embedded', 'true');
      pdfUrl.searchParams.set('mobilebasic', '1');
      pdfUrl.searchParams.set('scrollbar', '1');
      pdfUrl.searchParams.set('navpanes', '1');
      pdfUrl.searchParams.set('toolbar', '1');
      pdfUrl.searchParams.set('viewrect', '0,0,1000,1000');
      pdfUrl.searchParams.set('pagemode', 'none');
      pdfUrl.searchParams.set('pagefit', 'page-actual');
      pdfUrl.searchParams.set('pageview', 'single');
      pdfUrl.searchParams.set('enablejs', 'true');
      pdfUrl.searchParams.set('search', 'true');
      pdfUrl.searchParams.set('highlight', 'true');
      pdfUrl.searchParams.set('viewerpreferences', 'FitWindow');
    }
    
    // 파일명 추출하여 제목 설정
    const fileName = url.split('/').pop().replace('.pdf', '');
    titleElement.textContent = title || fileName;
    
    // 뷰어 설정
    viewer.src = pdfUrl.toString();
    
    // 모달 표시
    modal.classList.remove("hidden");
    modal.classList.add("visible");
    document.body.style.overflow = "hidden";
    
    // 뷰어 크기 조정
    adjustPdfViewer();

    // 모바일에서 스크롤 활성화
    if (isMobile) {
      viewer.style.overflow = "auto";
      viewer.style.webkitOverflowScrolling = "touch";
      viewer.style.touchAction = "pan-y";
      
      // 모바일에서 PDF 뷰어 로드 완료 후 추가 설정
      viewer.onload = function() {
        try {
          // PDF 뷰어가 로드된 후 추가 설정
          viewer.contentWindow.document.body.style.overflow = "auto";
          viewer.contentWindow.document.body.style.webkitOverflowScrolling = "touch";
          viewer.contentWindow.document.body.style.touchAction = "pan-y";
        } catch (e) {
          console.log("PDF 뷰어 추가 설정 실패:", e);
        }
      };
    }
  } catch (error) {
    console.error("PDF 뷰어 오류:", error);
    alert("PDF 파일을 열 수 없습니다. 파일 경로를 확인해주세요.");
  }
}

function adjustPdfViewer() {
  const viewer = document.getElementById("pdfViewer");
  const modal = document.getElementById("pdfModal");
  const content = modal.querySelector(".pdf-content");
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    content.style.width = "100%";
    content.style.height = "100%";
    content.style.margin = "0";
    viewer.style.height = "calc(100% - 60px)";
    viewer.style.width = "100%";
    viewer.style.border = "none";
    viewer.style.overflow = "auto";
    viewer.style.webkitOverflowScrolling = "touch";
    viewer.style.touchAction = "pan-y";
  } else {
    content.style.width = "90%";
    content.style.height = "90%";
    content.style.margin = "auto";
    viewer.style.height = "calc(100% - 50px)";
  }
}

function closePdfViewer() {
  const modal = document.getElementById("pdfModal");
  const viewer = document.getElementById("pdfViewer");
  
  modal.classList.remove("visible");
  setTimeout(() => {
    modal.classList.add("hidden");
    viewer.src = "";
    document.body.style.overflow = "auto";
  }, 300);
}

function openLinkViewer(url, title) {
  const modal = document.getElementById('linkModal');
  const viewer = document.getElementById('linkViewer');
  const titleElement = document.getElementById('linkTitle');
  
  titleElement.textContent = title;
  viewer.src = url;
  modal.classList.remove('hidden');
  
  // 닫기 버튼 이벤트 리스너 추가
  const closeBtn = document.getElementById('closeLinkViewer');
  closeBtn.onclick = closeLinkViewer;
  
  // 모달 외부 클릭 시 닫기
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeLinkViewer();
    }
  };
}

function closeLinkViewer() {
  const modal = document.getElementById('linkModal');
  const viewer = document.getElementById('linkViewer');
  
  modal.classList.add('hidden');
  viewer.src = ''; // 뷰어 초기화
}