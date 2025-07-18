# 마인드테스트 - 재미있는 심리테스트 모음 🧠

다양한 심리테스트를 제공하는 캐주얼한 웹 플랫폼입니다. 에겐남·테토녀 테스트를 시작으로 계속해서 새로운 테스트가 추가됩니다.

## 🎯 프로젝트 소개

에겐테토는 사용자의 감정 처리 방식과 의사결정 스타일을 분석하여 4가지 유형으로 분류하는 심리 테스트입니다.

### 특징
- 📝 12개의 간단한 질문
- 🎨 4가지 유형 분류 (에겐남, 에겐녀, 테토남, 테토녀)
- 📱 모바일 최적화 반응형 디자인
- 💰 Google AdSense 광고 연동
- 🚀 빠른 로딩 속도
- ♿ 웹 접근성 준수
- 🔐 Supabase 통합 (사용자 인증, 데이터 저장, 실시간 통계)
- 📊 실시간 참여자 수 표시
- 👤 개인화된 테스트 기록 저장

## 🏗️ 프로젝트 구조

```
teto-test-app/
├── index.html              # 메인 페이지 (테스트 목록)
├── quiz.html               # 에겐테토 테스트 페이지
├── result.html             # 결과 페이지
├── dashboard.html          # 사용자 대시보드 (개발 예정)
├── about.html              # 소개 페이지
├── privacy.html            # 개인정보처리방침
├── contact.html            # 문의하기
├── sitemap.xml             # 사이트맵
├── robots.txt              # 로봇 배제 표준
├── css/
│   ├── styles.css          # 기존 스타일시트
│   └── styles-new.css      # 새로운 메인 스타일
├── js/
│   ├── main.js             # 메인 JavaScript
│   └── supabase-config.js  # Supabase 설정 및 API
├── data/
│   └── tests.json          # 테스트 데이터
├── assets/                 # 이미지 및 정적 파일
│   └── icons/              # SVG 아이콘
├── supabase/
│   └── schema.sql          # 데이터베이스 스키마
├── CLAUDE.md               # 프로젝트 명세서
├── google-adsense-setup.md # AdSense 설정 가이드
└── README.md               # 프로젝트 설명서
```

## 🚀 시작하기

### 1. 로컬 실행

```bash
# 프로젝트 클론
git clone https://github.com/yourusername/teto-test-app.git
cd teto-test-app

# 로컬 서버 실행 (Python 3 기준)
python -m http.server 8000

# 또는 Node.js serve 사용
npx serve .

# 브라우저에서 http://localhost:8000 접속
```

### 2. 배포 준비

#### Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `supabase/schema.sql` 파일을 SQL Editor에서 실행
3. `js/supabase-config.js`에서 다음 값 교체:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
4. Authentication > Providers에서 이메일 인증 활성화
5. (선택사항) Google OAuth 설정

#### Google AdSense 설정
1. `google-adsense-setup.md` 가이드 참고
2. Publisher ID 교체 필요한 파일:
   - `index.html`
   - `quiz.html`
   - `result.html`
3. 광고 슬롯 ID 교체

#### 도메인 설정
다음 파일에서 `your-domain.com`을 실제 도메인으로 교체:
- `index.html`
- `quiz.html`
- `result.html`
- `about.html`
- `privacy.html`
- `contact.html`
- `sitemap.xml`
- `robots.txt`

## 📋 기능 설명

### 1. 테스트 플로우
1. **메인 페이지** (`index.html`) - 테스트 목록 및 로그인
2. **퀴즈 페이지** (`quiz.html`) - 성별 선택 후 12개 질문 답변
3. **결과 페이지** (`result.html`) - 유형 분석 결과 및 SNS 공유
4. **대시보드** (`dashboard.html`) - 개인 테스트 기록 확인 (로그인 필요)

### 2. 점수 계산 시스템
- 각 질문마다 A(E형) / B(T형) 선택
- E 점수 ≥ 7: 에겐 우세
- T 점수 ≥ 7: 테토 우세
- 성별 정보와 결합하여 최종 유형 결정

### 3. 사용자 시스템
- 이메일/비밀번호 로그인
- 테스트 결과 자동 저장 (로그인 시)
- 개인 테스트 기록 조회
- 실시간 참여자 수 표시

### 4. 광고 시스템
- Google AdSense 연동으로 수익 창출
- 반응형 광고 배치
- 사용자 경험 고려한 광고 위치

## 🎨 디자인 시스템

### 색상 팔레트 (Mejiro University 테마)
- **Primary**: #89C3EB (연한 파랑)
- **Secondary**: #F4C6D0 (연한 분홍)
- **Accent**: #A8D8B5 (연한 초록)
- **Warm**: #F0E5D8 (연한 베이지)
- **메인 그라데이션**: `linear-gradient(135deg, #89C3EB 0%, #F4C6D0 100%)`

### 타이포그래피
- 메인 폰트: Pretendard
- 폴백 폰트: -apple-system, BlinkMacSystemFont, 'Segoe UI'

### 반응형 브레이크포인트
- 모바일: < 768px
- 태블릿: 768px - 1024px
- 데스크톱: > 1024px

## 🔧 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **Vanilla JavaScript**: ES6+, 로컬스토리지
- **Pretendard**: 한국어 최적화 폰트

### Backend
- **Supabase**: PostgreSQL 데이터베이스
- **Supabase Auth**: 사용자 인증
- **Supabase Realtime**: 실시간 통계 업데이트
- **Row Level Security**: 데이터 보안

### 성능 최적화
- 이미지 지연 로딩
- CSS/JS 압축
- 브라우저 캐싱
- 프리로딩

### SEO 최적화
- 메타 태그 설정
- Open Graph 태그
- 구조화된 데이터
- 사이트맵 제공

## 📊 분석 및 모니터링

### Google Analytics 설정 (선택사항)
```html
<!-- Google Analytics 코드 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 추적 가능한 이벤트
- 테스트 시작
- 질문 답변
- 광고 클릭
- 결과 공유
- 페이지 체류 시간

## 🛠️ 커스터마이징

### 1. 질문 수정
`quiz.html`의 `questions` 배열에서 질문 내용 수정 가능:
```javascript
const questions = [
    {
        question: "새로운 질문 내용",
        answers: [
            { text: "A 선택지", type: "E" },
            { text: "B 선택지", type: "T" }
        ]
    }
];
```

### 2. 결과 메시지 수정
`result.html`의 `resultData` 객체에서 결과 내용 수정:
```javascript
const resultData = {
    'E남': {
        title: '에겐남',
        description: '새로운 설명...',
        // ...
    }
};
```

### 3. 디자인 수정
`css/styles.css`에서 색상, 폰트, 레이아웃 수정 가능

## 🚨 배포 전 체크리스트

### 필수 사항
- [ ] Supabase 프로젝트 설정
- [ ] Supabase URL 및 API 키 교체
- [ ] 데이터베이스 스키마 실행
- [ ] Google AdSense Publisher ID 교체
- [ ] 도메인 URL 교체
- [ ] 개인정보처리방침 검토
- [ ] 연락처 정보 업데이트
- [ ] 모든 링크 동작 확인

### 권장 사항
- [ ] Google Analytics 설정
- [ ] 파비콘 추가
- [ ] 404 페이지 생성
- [ ] 성능 테스트 실행
- [ ] 크로스 브라우저 테스트
- [ ] Supabase Edge Functions 설정 (고급)

## 🔒 보안 고려사항

### 데이터 보호
- 최소한의 개인정보만 수집
- 로컬스토리지 사용으로 서버 저장 최소화
- HTTPS 필수 사용

### 입력값 검증
- XSS 방지
- 적절한 입력값 길이 제한
- 클라이언트 사이드 유효성 검사

## 📱 모바일 최적화

### 터치 인터페이스
- 44px 이상 터치 타겟 크기
- 적절한 간격 유지
- 스와이프 제스처 고려

### 성능 최적화
- 이미지 압축
- 레이지 로딩
- 오프라인 대응

## 🤝 기여하기

### 개발 환경 설정
1. Fork 및 Clone
2. 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 커밋 (`git commit -m 'Add amazing feature'`)
4. 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

### 기여 가이드라인
- 코드 스타일 일관성 유지
- 접근성 준수
- 모바일 호환성 확인
- 성능 영향 고려

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

- 이메일: contact@example.com
- 이슈 트래커: [GitHub Issues](https://github.com/yourusername/teto-test-app/issues)

## 🙏 감사의 말

이 프로젝트는 다음 리소스들을 참고하여 제작되었습니다:
- MBTI 이론 참고
- 웹 접근성 가이드라인 (WCAG)
- Material Design 원칙

---

**면책 조항**: 이 테스트는 재미를 위한 것이며 과학적 진단 도구가 아닙니다. 모든 인간은 복합적인 성격을 가지고 있으며, 결과는 참고용으로만 활용해 주세요.