# ToneOnMatch — Vercel 배포 가이드

## 폴더 구조

```
vercel_deploy/
├── api/
│   └── analyze.js        ← Claude API 프록시 (서버리스 함수)
├── public/
│   ├── landing_page.html  ← 3단계: 랜딩
│   ├── thankyou_page.html ← 5단계: 무료 가이드
│   ├── index.html         ← 6단계: 셀카 업로드 + AI 분석
│   ├── sales_page.html    ← 7단계: 결과 + 세일즈
│   └── share_card.html    ← 8단계: 공유 카드
├── vercel.json
└── .env.example
```

---

## 배포 순서

### 1. GitHub에 올리기

```bash
git init
git add .
git commit -m "first deploy"
git remote add origin https://github.com/너의계정/toneonmatch.git
git push -u origin main
```

### 2. Vercel 연결

1. https://vercel.com 접속 → 로그인
2. "Add New Project" → GitHub 레포 선택
3. **Framework Preset: Other** 선택
4. Deploy 클릭

### 3. 환경변수 설정 (필수)

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables

| 이름 | 값 |
|------|-----|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (console.anthropic.com에서 발급) |

설정 후 **Redeploy** 한 번 해야 적용됨.

---

## GHL 웹훅 연결 방법

1. GHL → Automations → Webhook Trigger 생성
2. 웹훅 URL 복사
3. `public/landing_page.html` 열기
4. 아래 줄 찾아서 URL 교체:

```js
const GHL_WEBHOOK_URL = 'YOUR_GHL_WEBHOOK_URL'; // ← 여기
```

5. GitHub push → Vercel 자동 재배포

---

## 카카오페이 결제 연결

결제 링크 준비 후 `public/index.html`과 `public/sales_page.html`에서
`YOUR_KAKAO_PAY_URL` 을 실제 링크로 교체.

---

## OG 이미지 교체

현재 OG 이미지 경로: `https://toneonmatch.com/og_image.jpg`

1. 1200×630px 이미지 제작
2. `public/og_image.jpg` 로 저장 후 배포
3. 도메인 연결 후 URL 자동 반영

---

## 도메인 연결

Vercel 대시보드 → 프로젝트 → Settings → Domains → 도메인 입력

---

## 배포 후 체크리스트

- [ ] `ANTHROPIC_API_KEY` 환경변수 설정됨
- [ ] 셀카 업로드 → AI 분석 동작 확인
- [ ] GHL 웹훅 URL 교체됨
- [ ] 카카오페이 링크 교체됨
- [ ] OG 이미지 업로드됨
- [ ] 도메인 연결됨
