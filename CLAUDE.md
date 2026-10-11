# kids-village 작업 규칙 (클로드 코드용)

2~5세 아이용 광고 없는 게임 마을. 기획 전체는 `docs/기획서.md`에 있고, 작업은 그 안의
"클로드 코드 작업 순서" 13단계를 한 단계씩 진행한다. 세션 시작 시 이 파일과 기획서를 먼저 읽는다.

## 꼭 지킬 것

- **글 몰라도 된다**: 모든 안내는 그림 + 음성. 글자에만 의존하는 버튼·안내 금지. 글자는 장식용.
- **터치 영역 64px 이상** (`min-h-touch min-w-touch`), 화면 가장자리 오조작 주의. 홈(집) 버튼은 항상 왼쪽 위.
- **실패가 없다**: 벌점·게임오버 없음. 틀리면 부드럽게 재시도, 맞히면 크게 칭찬.
- **음성은 음성 파일 우선**. 기기 TTS(Web Speech API)에 기대는 코드 금지. 개발 중 임시 TTS는 `core/voice`
  안에서만, 파일이 없을 때의 대체로만 쓴다.
- **외부 링크·광고·분석 SDK·결제 코드 추가 금지**. 네트워크 요청 없이 동작해야 한다(폰트·CDN 포함).
- **새 게임** = `src/games/<id>/` 폴더 + `src/games/registry.ts` 한 줄. `core`를 직접 고치는 일은 최소화.
  게임은 `onComplete(stickerId)`, `onExit()` 두 신호만 호출한다(`src/games/types.ts`).
- **PixiJS는 풍선 공원·부릉부릉 차고에만**. 나머지 건물은 일반 React(SVG 포함).
- **새 그림·소리를 넣으면** 출처와 라이선스를 `public/assets/CREDITS.md`에 기록. 무료 라이선스(CC0, MIT 등)만.
- **작업 끝나면 `npm run build` 통과 확인 후 커밋.** (`tsc -b` 타입 검사 포함)

## 구조

```
src/
  app/       라우팅(HashRouter), 마을 허브, 부모 잠금
  core/      스티커, 저장, 음성, 사운드, 설정, i18n
  ui/        공통 버튼·홈 버튼·축하 효과
  games/     registry.ts + 건물별 폴더 (동적 import)
public/assets/  그림·소리 (건물별 폴더) + CREDITS.md
docs/      기획서, 게임별 스펙
```

- 경로 별칭 `@/` = `src/`.
- 화면 이동은 **해시 라우팅**(`#/farm`). GitHub Pages 하위 경로와 Capacitor `file://`에서 새로고침해도 깨지지 않게 하기 위함.
- Vite `base`는 `/kids-village/` (GitHub Pages). 다른 곳에 올릴 때는 `VITE_BASE=/ npm run build`.
- 가로 모드 기준. 앱은 가로 고정, 웹은 세로일 때 "폰을 돌려주세요" 화면(2단계).
- 저장은 기기 안(localStorage / Capacitor Preferences / IndexedDB)에만. 계정·서버 없음.
- 색: 건물 대표색은 `src/index.css`의 `@theme`에 정의 (차고 주황, 학교 노랑, 농장 초록, 공원 하늘, 미술관 보라).

## 명령

- `npm run dev` 개발 서버 / `npm run build` 빌드(타입 검사 포함) / `npm run preview` 빌드 결과 확인
- `main`에 push하면 GitHub Actions가 GitHub Pages로 자동 배포 (`.github/workflows/deploy.yml`)
