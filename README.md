# JJ-portfolio, 이정재의 인생 포트폴리오

느린 학습자 곁에서, 관계로 시작한 교육을 오래가는 구조로 남깁니다.

- 현재 버전: **v2.1 (2026.10.14)**
- 이전 버전: [`versions/v1_2025-06/`](versions/v1_2025-06/) (2025년 6월판 보관본)
- 바뀐 내용: [`CHANGELOG.md`](CHANGELOG.md)

---

## 1. 폴더 구조

```
JJ-portfolio/
├─ index.html              화면 뼈대 (내용은 거의 없음)
├─ css/main.css            디자인 (색과 간격은 맨 위 :root 토큰)
├─ js/app.js               data/*.json 을 읽어 화면을 그림
├─ data/                   ← 내용은 여기만 고치면 됩니다
│  ├─ site.json            첫 화면 문장, '지금 하는 일', 수상 소개, 역량 5가지, 채널, 소개
│  ├─ works.json           대표 작업 카드 (+ 역할 용어집)
│  ├─ journey.json         걸어온 길 (장 → 연도)
│  ├─ credentials.json     자격, 수상, 학력, 장학
│  └─ ui.json              버튼과 제목 같은 화면 문구 (한/영)
├─ assets/
│  ├─ works/               작업 대표 이미지(작업id.webp, 작업id_sm.webp)와 상세 이미지(작업id/g1.webp…)
│  ├─ docs/                공개용 PDF (영문 파일명, 용량 정리됨)
│  ├─ credentials/         증명서 마스킹본 이미지 (원본 PDF는 올리지 않음)
│  ├─ journey/             연표용 이미지 (개인정보 가림 처리)
│  └─ img/                 캐릭터 프로필, 상단 아이콘, 파비콘, 공유 이미지, 휴대폰 홈 화면 아이콘(og-YYYYMM.png, 바꿀 때 파일명도 바꿔야 카카오톡 미리보기가 갱신됨)
├─ versions/               이전 버전 보관
│  └─ v1_2025-06/
└─ tools/                  정리용 스크립트
```

모든 글은 `{"ko": "...", "en": "..."}` 형태입니다. 영어를 비워 두면(`"en"` 생략) 한국어가 대신 나옵니다.

**줄바꿈 위치 정하기** — 화면 폭에 따라 어색하게 끊기는 문장은 띄어쓰기 대신 `|`(큰 묶음)와 `¦`(그 안의 작은 묶음)을 넣습니다. 줄은 이 경계에서만 바뀌고, 화면에는 띄어쓰기로 보입니다. 문장(마침표)끼리는 자동으로 줄이 나뉩니다.
예: `"수업과 교재, 연수와 문서,¦웹과 이야기로|함께하는 사람들이¦오래 쓸 수 있는 도구를 만듭니다."`

## 2. 내용을 더하는 방법 (누적 규칙)

### 새 작업 추가 — `data/works.json` 의 `items` 에 하나 더하기

```json
{
  "id": "new-project",                       // 영문 소문자와 하이픈. 이미지 파일명과 같아야 함
  "date": "2026-11",                         // 정렬 기준 (YYYY-MM)
  "period": {"ko": "2026.11", "en": "Nov 2026"},
  "status": {"ko": "진행 중", "en": "Ongoing"},   // 선택
  "title": {"ko": "작업 이름", "en": "Title"},
  "summary": {"ko": "한 줄 설명", "en": "..."},
  "context": {"ko": "왜 필요했나", "en": "..."},
  "with": {"ko": ["함께한 기관 1", "함께한 사람 2"], "en": ["...", "..."]},   // 목록으로 쓰면 태그로 보임
  "facts": {"ko": ["숫자로 보이는 결과 1", "결과 2"]},             // 선택
  "steps": [{"label": {"ko": "기획"}, "text": {"ko": "이 단계에서 한 일"}}],   // 선택, 진행 과정 (날짜 없이)
  "roles": ["plan", "write"],               // 아래 역할 용어 중에서 선택
  "roleText": {"ko": "내가 실제로 한 일", "en": "..."},
  "tags": ["content"],                      // teach, content, people, system, digital
  "featured": false,                        // true 면 첫 화면 '대표 작업'에 보임
  "evidence": [
    {"type": "pdf", "label": {"ko": "자료 (PDF)"}, "src": "assets/docs/2026_new-project.pdf", "size": 123456},
    {"type": "link", "label": {"ko": "바로가기"}, "url": "https://..."}
  ],
  "cover": "assets/works/new-project.webp",
  "coverSmall": "assets/works/new-project_sm.webp",
  "gallery": [{"src": "assets/works/new-project/g1.webp", "w": 1100, "h": 1556}]
}
```

**역할 용어(roles)**: `plan` 기획, `write` 집필, `design` 디자인, `build` 웹 구축, `teach` 강의, `run` 운영, `doc` 문서화, `research` 조사, `video` 영상 제작, `develop` 교재 개발, `story` 스토리 구성

> **서술 원칙** — 기관이 함께 이룬 결과(평가 등급, 선정, 지정 등)는 작업의 성과로 쓰지 않습니다.
> `with` 에 함께한 주체를, `roleText` 에는 **내가 실제로 한 일만** 적습니다.

### 연표에 한 해 추가 — `data/journey.json`

- 맨 위 장(`together`)의 `entries` 맨 앞에 `{ "year": "2027", "title": …, "text": …, "evidence": [] }` 를 넣습니다.
- `evidence` 는 비워 둬도 됩니다. 넣을 때는 `{"type":"work","ref":"작업id"}`, `{"type":"credential","ref":"자격id"}`, `{"type":"image","label":…,"src":…}`, `{"type":"pdf",…}`, `{"type":"link",…}` 중에서 고릅니다.
- 새 시기가 시작되면 `chapters` 맨 앞에 장을 하나 더 만들고, 이전 장은 그대로 둡니다.

### 자격과 수상 추가 — `data/credentials.json`

- `items` 에 `{ "id", "category"(award, license, education, scholarship, etc 중 하나), "name", "issuer", "date" }` 를 더합니다.
- 증빙 이미지가 있으면 `image`와 `thumb` 경로를 넣습니다. **반드시 마스킹한 이미지(webp/jpg)만** 올립니다. 원본 PDF는 올리지 않습니다.

### 매번 바꿀 것

- `data/site.json` 의 `updated`(날짜)와 `now.items`(지금 하는 일)
  - `now.items` 는 `{"text": 누구나 이해하는 말로 하는 일, "sub": 사업 이름}` 형태입니다. 상시 업무는 `now.routine` 한 줄에 적습니다.
- **누적 원칙** (작업이 계속 쌓여도 관리가 쉽도록)
  - 날짜는 `date`(정렬용 YYYY-MM)와 `period`(월 단위)에만 씁니다. 본문, 주요 내용, 진행 과정에는 일자를 넣지 않습니다.
  - `facts` 는 규모나 결과를 보여 주는 짧은 말 3~5개(인원, 개수 등). 장소와 일시는 넣지 않습니다.
  - `steps` 는 큰 작업에만 씁니다. 단계 이름은 되도록 `기획, 준비, 제작, 운영, 정리, 공유` 가운데서 고르고, 한두 문장으로 적습니다.
  - 영상은 파일을 올리지 않고 유튜브 링크(`type: link`)로 연결합니다.
  - `featured: true` 는 여러 개여도 됩니다. 첫 화면에는 최신순으로 `site.json` 의 `featuredMax`(기본 9)개만 보이고, 나머지는 '더 보기'로 자동으로 내려갑니다.
- **표기 원칙**: 띄어 쓴 구분점( · )으로 항목을 잇지 않습니다. 말로 잇거나(와/과), 쉼표를 쓰거나, 목록(태그)으로 나눕니다. 붙여 쓴 가운뎃점은 공식 명칭에만 씁니다.
- `CHANGELOG.md` 에 한 줄

## 3. 개인정보 체크리스트 (올리기 전에)

- [ ] 주민등록번호, 생년월일, 학번, 수험번호, 자격번호, 관리번호, 바코드/QR, 증명사진이 가려졌는가
- [ ] 다른 사람(동료, 학생, 후원자)의 이름이나 얼굴이 나오지 않는가 — 특히 **학생 사진**
- [ ] 금액이나 급여 같은 재정 정보가 없는가
- [ ] 내부 계획 문서(5개년 계획, 내부 운영안 등)가 아닌가
- [ ] 문서 안의 공유 링크(구글 시트 등)가 공개 범위로 열려 있지 않은가

마스킹은 **이미지로 내보낸 뒤** 가립니다. PDF 위에 도형만 덮으면 글자가 그대로 남아 복사될 수 있습니다.

## 4. 로컬에서 미리 보기

`data/*.json` 을 불러오기 때문에 파일을 더블클릭해서 열면 내용이 보이지 않습니다.
VS Code의 **Live Server** 확장으로 열거나, 폴더에서 `python -m http.server` 를 실행한 뒤 `http://localhost:8000` 으로 엽니다.

## 5. 버전 관리 규칙

- 구조를 크게 바꿀 때만 새 버전을 만듭니다. 내용 추가는 같은 버전 안에서 누적합니다.
- 새 버전을 만들 때: 현재 화면 파일(`index.html`, `css/`, `js/`, `data/`)을 `versions/v2_2026-10/` 같은 폴더로 복사한 뒤 작업합니다. 보관본 안의 자료 경로는 `../../assets/...` 로 공용 자료를 가리키게 합니다.
- 보관본 `index.html` 하단에는 '보관본입니다, 최신 보기' 띠가 붙어 있습니다.
