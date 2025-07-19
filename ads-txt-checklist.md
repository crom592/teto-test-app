# ads.txt 파일 체크리스트

## 배포 후 확인 사항

### 1. ads.txt 파일 접근성 확인
- [ ] 브라우저에서 `https://teto-test-app.pages.dev/ads.txt` 접속 가능 확인
- [ ] 파일 내용이 올바르게 표시되는지 확인
- [ ] 404 에러가 발생하지 않는지 확인

### 2. AdSense 관리자 페이지에서 확인
1. [Google AdSense](https://www.google.com/adsense/) 로그인
2. 좌측 메뉴에서 **사이트** 클릭
3. 해당 도메인의 ads.txt 상태 확인
4. "승인됨" 상태가 표시될 때까지 대기 (최대 24시간 소요)

### 3. ads.txt 검증 도구 사용
- [Google ads.txt 검증기](https://adstxt.guru/)
- [IAB ads.txt Validator](https://iabtechlab.com/ads-txt-validator/)

### 4. 일반적인 문제 해결

#### "찾을 수 없음" 상태가 계속되는 경우:
1. 파일이 루트 디렉토리에 있는지 확인
2. 파일명이 정확히 `ads.txt` (소문자)인지 확인
3. 파일 인코딩이 UTF-8인지 확인
4. 파일에 BOM(Byte Order Mark)이 없는지 확인

#### "승인되지 않음" 상태인 경우:
1. 게시자 ID가 정확한지 확인 (pub-5534320609992391)
2. 쉼표와 공백이 올바른지 확인
3. 각 줄이 정확한 형식을 따르는지 확인

### 5. ads.txt 파일 형식
```
google.com, pub-5534320609992391, DIRECT, f08c47fec0942fa0
```

- **google.com**: 광고 시스템 도메인
- **pub-5534320609992391**: AdSense 게시자 ID
- **DIRECT**: 게시자와 광고 시스템의 관계
- **f08c47fec0942fa0**: 광고 시스템의 고유 식별자

### 6. 추가 광고 네트워크
향후 다른 광고 네트워크를 추가하는 경우:
```
# Google AdMob (앱 광고)
google.com, pub-5534320609992391, DIRECT, f08c47fec0942fa0

# Amazon Publisher Services
aps.amazon.com, YOUR-AMAZON-ID, DIRECT

# Media.net
media.net, YOUR-MEDIA-NET-ID, DIRECT
```

### 7. 모니터링
- AdSense 대시보드에서 주기적으로 ads.txt 상태 확인
- 광고 수익이 정상적으로 발생하는지 모니터링
- 크롤링 오류가 발생하지 않는지 Search Console에서 확인

## 참고 자료
- [Google AdSense ads.txt 가이드](https://support.google.com/adsense/answer/7532444)
- [IAB ads.txt 사양](https://iabtechlab.com/ads-txt/)