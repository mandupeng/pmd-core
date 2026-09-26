# 직접 해야 할 일 (Claude가 대신 못 하는 것)

순서대로. 각 항목 옆은 예상 시간.

1. [ ] Supabase에 프로젝트 `pmd` 생성 (무료 프로젝트 2개 한도 확인) — 5분
2. [ ] SQL Editor에서 `sql/0001_product_schema.sql` 실행 — 2분
3. [ ] 제품마다: `select public.pmd_create_product_schema('제품슬러그');` 실행 후 Settings > API > Exposed schemas에 슬러그 추가 — 2분
4. [ ] GitHub repo Secrets에 `SUPABASE_URL`, `SUPABASE_ANON_KEY` 등록 (keepalive 워크플로용) — 3분
5. [ ] Google OAuth 클라이언트 발급 → Supabase Auth > Providers > Google — 10분
6. [ ] Kakao Developers 앱 생성 → Supabase Auth > Providers > Kakao — 10분
7. [ ] Apple 로그인은 Apple Developer 유료 계정 필요 — iOS 출시 시점에 진행
8. [ ] Vercel 계정을 GitHub(mandupeng)에 연결 — 3분
