# EEUM-RN — iOS → React Native 포팅 플랜

이음(EEUM) 뮤직 플레이리스트 공유 소셜 앱의 React Native 재구현.
원본: `EE-UM/eeum_iOS` (SwiftUI + Tuist 모듈러 클린아키텍처, ~7,700 LOC).
목적: 학습 겸 실제 교체. 백엔드(`eeum.xyz`, `EE-UM/EEUM-BE`)는 그대로 재사용.

> 원칙: **TCA/Tuist 구조를 미러링하지 않는다.** RN 표준(관용) 구조로 단순화한다.
> Interface/Builder/Coordinator 같은 iOS DI 패턴은 옮기지 않음 (RN에선 과설계).

---

## 1. 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 런타임 | **Expo (dev client)** + TypeScript | 오디오/제스처 네이티브 모듈 때문에 dev client 사용 |
| 네비게이션 | React Navigation (native-stack + bottom-tabs) | 원본 Coordinator 대체 |
| 서버 상태 | **TanStack Query** | 캐싱·무효화·무한스크롤 |
| 클라 상태 | **Zustand** | auth 토큰, 오디오 플레이어 상태 |
| 네트워킹 | `ky`(또는 axios) + 얇은 API 레이어 | 원본 Moya `TargetType` 대체 |
| 오디오 | **react-native-track-player** | 원본 `AVPlayer`/`AVAudioSession` 대체 |
| 제스처/애니메이션 | Reanimated 3 + Gesture Handler | Feed 카드 스택 스와이프 |
| 저장소 | expo-secure-store(토큰) + AsyncStorage | 원본 `UserDefaults` 대체 |
| 폰트 | Pretendard (원본 자산 그대로 재사용) | |

---

## 2. 디렉터리 구조 (RN 관용)

```
src/
  api/            # ky 클라이언트 + 엔드포인트별 함수 (login, post, comment, like, music)
  types/          # DTO/엔티티 TS 타입 (원본 Domain/Entity + Data/DTO 이식)
  stores/         # zustand: authStore, playerStore
  hooks/          # useFeed, usePostDetail, useMusicSearch ... (TanStack Query 래핑)
  navigation/     # RootNavigator, TabNavigator, 타입 정의
  components/     # 공용 UI (Button, Avatar, ...)
  design/         # 컬러 토큰, 타이포, 폰트 로딩 (원본 DesignSystem 이식)
  features/
    feed/         # FeedScreen, FeedCard, CardStack
    home/
    postDetail/   # PostDetailScreen, CommentList, CommentInput, ActionSheet
    search/       # 음악 검색
    share/        # 공유 플로우
    settings/
  audio/          # track-player 설정/서비스
App.tsx
```

원본 모듈 → RN 매핑:
- `Data/API/*API.swift` (Moya) → `src/api/*.ts`
- `Data/DTO`, `Domain/Entity` → `src/types`
- `Domain/UseCase`, `Repository` → `src/hooks` (TanStack Query) — 별도 레이어로 분리 안 함
- `Domain/Service/AudioPlayerService` → `src/audio` + `playerStore`
- `Coordinator/*` → `src/navigation`
- `Feature/*` → `src/features/*`
- `DesignSystem` → `src/design`

---

## 3. 백엔드 API (원본에서 확인됨)

- Base URL: `https://eeum.xyz` (prod) / `https://eeum.xyz/dev` (debug)
- 인증: 게스트 로그인 `POST /user/guest {deviceId, provider}`, 소셜 `POST /user/login {idToken, provider}`
  - 응답 토큰을 secure-store에 저장, 이후 요청 `Authorization` 헤더에 주입 (원본 `AccessTokenPlugin` 대체)
- 도메인 리소스: post / comment / like / music — `src/api`에서 1:1 매핑
  (정확한 경로·파라미터는 각 마일스톤 진입 시 원본 `*API.swift`에서 확인 후 옮김)

---

## 4. 마일스톤 (증분 진행 — 각 단계 설계 확인 후 코드 작성)

- [x] **M0 — 스캐폴드**: Expo+TS, FSD 구조, 폰트, 디자인 토큰, 네비게이션(탭4), fetch 클라이언트
- [x] **M1 — 인증/네트워킹**: 게스트 로그인, 토큰 저장/주입(AuthGate), ApiResponse 봉투, 에러 정규화
- [x] **M2 — Feed 리스트**: Ing/Done 무한스크롤, PostCard, 당겨서 새로고침
- [x] **M3 — PostDetail**: 상세, 댓글 목록/입력, 좋아요(낙관), 액션시트/신고/수정
- [x] **M4 — Search/Share**: 음악 검색(디바운스), 공유(게시) + 완료방식 시트
- [x] **M5 — 오디오 재생**: expo-audio 전역 playerStore (track-player 대신 — Expo Go 호환)
- [x] **M6 — Feed Ing 캐러셀**: 가로 페이징 스냅(원본은 Tinder식이 아닌 페이저였음)
- [x] **M7 — Settings + Home**: 설정(계정/정보), Home '오늘의 사연' 랜덤, 탭 한글/아이콘

**전 마일스톤 완료.** 각 단계 `tsc --noEmit` + `expo export` 검증 통과, 마일스톤 단위 커밋.

### 미포팅(선택 후속)
- Inbox(내 사연/좋아요/댓글 단 리스트 — 원본 PostsListView)
- Feed Done 그리드(현재 리스트로 단순화), EditPostSheet 음악 변경
- 실기기 테스트, dev build/배포 설정

---

## 5. 진행 규칙

- 모듈 하나씩. 코드 일괄 투하 X — 화면/네이밍/데이터 흐름 먼저 합의 후 작성.
- 커밋은 마일스톤/논리 단위. push는 요청 시.
- 원본 동작이 모호하면 `eeum_iOS` 소스를 직접 확인하고 옮김 (추측 X).
