# @pmd/core

PMD 제품 공용 플랫폼 킷. 디자인은 `@pmd/ui`, 나머지(인증·DB·분석)는 여기.

- `createPmdConfig` — env 검증. `product`가 곧 Postgres 스키마 이름
- `createPmdClient(config, options?)` — 공유 Supabase 프로젝트, 제품별 스키마로 격리. `options`는 그대로 병합되지만 `schema`는 항상 `product`로 고정(다른 제품 스키마를 실수로 못 찌르게). React Native는 `{ auth: { storage: AsyncStorage } }`로 세션 영속화.
- `signInWith(client, 'google'|'kakao'|'apple', redirectTo)` — 소셜 로그인 (`providers`에 한 줄 추가로 확장)
- `createAnalytics(product, [adapter...])` — `track()` 한 번으로 여러 분석 도구에 전송. Vercel: `createAnalytics('x', [track])` (`@vercel/analytics`)

설치: `npm install github:mandupeng/pmd-core`. 직접 해야 할 설정은 `BACKLOG.md`.
개발: `npm run verify`
