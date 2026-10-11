# kids-village (가칭)

광고 없는 2~5세 아이용 종합 게임 마을. 마을 지도에서 건물을 골라 미니게임을 하고, 스티커를 모아요.

- 코드 하나로 홈페이지(웹)와 안드로이드 앱(Capacitor)을 함께 운영
- 완전 무료: 광고·결제·외부 링크·데이터 수집 없음
- 첫 출시 건물 5개: 부릉부릉 차고, 콕콕 단어 학교, 동물 농장, 풍선 공원, 미술관

기획 전체는 [docs/기획서.md](docs/기획서.md)에 있어요. 개발은 클로드 코드로, 기획서의 "클로드 코드 작업 순서"를 따라 단계별로 진행해요. 작업 규칙은 [CLAUDE.md](CLAUDE.md)에 있어요.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173/kids-village/)
npm run build    # 타입 검사 + 빌드 → dist/
npm run preview  # 빌드 결과 확인
```

## 안드로이드 앱

`main`에 push하면 GitHub Actions가 테스트용 APK를 만들어 Releases에 올려요. Play 스토어용 서명 AAB는 `npm run build:app` 후 Android Studio에서 만들어요. 자세한 순서는 [docs/앱빌드.md](docs/앱빌드.md)에 있어요.

## 배포

`main`에 push하면 GitHub Actions가 자동으로 GitHub Pages에 올려요.
저장소 Settings → Pages에서 Source를 **GitHub Actions**로 한 번만 설정하면 돼요.
주소는 `https://<계정>.github.io/kids-village/` 예요.

## 진행 상황

- [x] 1. 뼈대: Vite+React+TS+Tailwind, 해시 라우팅, CLAUDE.md, Pages 자동 배포
- [x] 2. 마을 허브
- [x] 3. 공통 core
- [x] 4. 스티커북
- [x] 5. 동물 농장
- [ ] 6. 안드로이드 중간 확인 (실기기 필요, [docs/앱빌드.md](docs/앱빌드.md) 체크리스트)
- [x] 7. 콕콕 단어 학교
- [x] 8. 풍선 공원
- [x] 9. 부릉부릉 차고
- [x] 10. 미술관
- [x] 11. PWA·오프라인
- [~] 12. 앱 빌드: 안드로이드 프로젝트 생성, 테스트용 APK는 GitHub Actions가 자동 생성(Releases). Play용 서명 AAB만 남음 ([docs/앱빌드.md](docs/앱빌드.md))
- [ ] 13. 점검
