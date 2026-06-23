# src — Feature-Sliced Design (FSD)

레이어는 위에서 아래로만 의존한다 (상위 → 하위). 같은 레이어 슬라이스끼리는 직접 import 금지.

```
app/        앱 초기화: providers, navigation, 폰트/테마 부트스트랩, 루트 App
pages/      화면 단위 (React Navigation 스크린). 슬라이스: home / feed / share / settings / post-detail / search
widgets/    여러 entity·feature를 조합한 복합 UI 블록 (예: feed-card-stack, comment-list, player-bar)
features/   사용자 행동 단위 (예: auth, like-post, write-comment, share-post, play-track, music-search)
entities/   비즈니스 엔티티 (post / comment / user / track) — 타입·서버쿼리·표시 UI
shared/     공용 기반: api(fetch 클라이언트), config(env), ui(디자인 토큰·기본 컴포넌트), lib(헬퍼)
```

각 슬라이스 내부 세그먼트: `ui/` `model/`(상태·zustand·쿼리훅) `api/` `lib/` `config/`.
슬라이스는 `index.ts`(public API)로만 외부에 노출한다.

상태관리: 서버상태 = TanStack Query(`entities/*/api`, 훅), 클라상태 = Zustand(`*/model`).
import alias: `@/` → `src/` (예: `import { colors } from '@/shared/ui'`).
