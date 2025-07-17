# Google AdSense 설정 가이드

## 1. AdSense 계정 설정

### 1.1 AdSense 계정 생성
1. [Google AdSense](https://www.google.com/adsense/) 방문
2. "시작하기" 클릭
3. 웹사이트 URL 입력: `https://your-domain.com`
4. 국가/지역 선택: 대한민국
5. 결제 정보 입력

### 1.2 사이트 추가 및 승인
1. AdSense 대시보드에서 "사이트" → "사이트 추가"
2. 사이트 URL 입력
3. 승인 대기 (보통 1-14일 소요)

## 2. 코드 구현 방법

### 2.1 Publisher ID 교체
각 HTML 파일에서 다음 부분을 실제 Publisher ID로 교체:

```html
<!-- 현재 코드 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossorigin="anonymous"></script>

<!-- 교체 예시 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
        crossorigin="anonymous"></script>
```

### 2.2 광고 슬롯 ID 교체
각 광고 유닛의 data-ad-slot 값을 실제 슬롯 ID로 교체:

```html
<!-- 현재 코드 -->
<ins class="adsbygoogle"
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
     data-ad-slot="YOUR_AD_SLOT_ID">

<!-- 교체 예시 -->
<ins class="adsbygoogle"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210">
```

## 3. 광고 유닛 생성

### 3.1 ads.html 광고 유닛
1. AdSense 대시보드 → "광고" → "광고 유닛별"
2. "디스플레이 광고" 선택
3. 이름: "Main Ad - Quiz Result"
4. 크기: "반응형"
5. 생성 후 코드 복사

### 3.2 result.html 광고 유닛
1. 새 광고 유닛 생성
2. 이름: "Result Page Ad"
3. 크기: "반응형"
4. 생성 후 코드 복사

## 4. 파일별 수정 사항

### 4.1 ads.html 수정
```html
<!-- line 17-18 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossorigin="anonymous"></script>

<!-- line 39-46 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
     data-ad-slot="YOUR_MAIN_AD_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>

<!-- line 60-67 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
     data-ad-slot="YOUR_SECONDARY_AD_SLOT_ID"
     data-ad-format="rectangle"
     data-full-width-responsive="true"></ins>
```

### 4.2 result.html 수정
```html
<!-- line 305-306 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossorigin="anonymous"></script>

<!-- line 307-314 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
     data-ad-slot="YOUR_RESULT_AD_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

## 5. 테스트 및 검증

### 5.1 로컬 테스트
1. 로컬 서버에서 테스트 시 광고가 표시되지 않는 것은 정상
2. 실제 도메인에 배포 후 테스트 필요

### 5.2 AdSense 정책 준수
1. 클릭 유도 금지
2. 광고 라벨 명시 ("광고", "후원")
3. 충분한 콘텐츠 제공
4. 사용자 경험 저해 방지

## 6. 수익 최적화 팁

### 6.1 광고 배치 최적화
- 사용자가 자연스럽게 보는 위치에 배치
- 콘텐츠와 광고의 명확한 구분
- 모바일 친화적 크기 사용

### 6.2 성능 모니터링
- AdSense 대시보드에서 수익 확인
- 클릭률(CTR) 및 노출률 분석
- A/B 테스트를 통한 최적화

## 7. 문제 해결

### 7.1 광고가 표시되지 않는 경우
1. Publisher ID 및 슬롯 ID 확인
2. 사이트 승인 상태 확인
3. 브라우저 광고 차단 확인
4. 콘솔 오류 메시지 확인

### 7.2 승인 거부 시 대응
1. 사이트 콘텐츠 보강
2. 개인정보처리방침 추가
3. 사용자 경험 개선
4. 재신청 전 충분한 트래픽 확보

## 8. 법적 고려사항

### 8.1 개인정보처리방침 업데이트
- 광고 쿠키 사용 명시
- 개인정보 수집 및 이용 목적 설명
- 사용자 동의 메커니즘 구현

### 8.2 GDPR 준수 (EU 사용자 대상)
- 쿠키 동의 배너 추가
- 개인화 광고 동의 옵션
- 데이터 처리 목적 명시

## 9. 추가 개선 사항

### 9.1 광고 로딩 최적화
```javascript
// 광고 로딩 상태 확인
function checkAdLoad() {
    setTimeout(() => {
        const ads = document.querySelectorAll('.adsbygoogle');
        ads.forEach(ad => {
            if (!ad.innerHTML.trim()) {
                // 대체 광고 또는 콘텐츠 표시
                showFallbackAd(ad);
            }
        });
    }, 3000);
}
```

### 9.2 광고 차단 감지
```javascript
// 광고 차단 감지 및 대응
function detectAdBlock() {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
        if (testAd.offsetHeight === 0) {
            // 광고 차단 감지 시 메시지 표시
            showAdBlockMessage();
        }
        testAd.remove();
    }, 100);
}
```

## 10. 배포 전 체크리스트

- [ ] Publisher ID 교체 완료
- [ ] 모든 광고 슬롯 ID 교체 완료
- [ ] AdSense 사이트 승인 완료
- [ ] 개인정보처리방침 업데이트
- [ ] 광고 정책 준수 확인
- [ ] 모바일 광고 테스트 완료
- [ ] 페이지 로딩 속도 확인
- [ ] 사용자 경험 테스트 완료

---

**주의사항:** 
- 실제 AdSense 승인 후 Publisher ID와 슬롯 ID를 교체해야 합니다
- 가짜 클릭이나 부정적인 방법으로 수익을 늘리려 하지 마세요
- AdSense 정책을 정기적으로 확인하고 준수하세요