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

## 수익화 (제품마다 택1 — `monetization` 인테이크 결과 따라)

**ads 모드:**
9. [ ] Google AdSense 계정 생성 + 사이트 등록·심사 통과 — 심사 대기 수일
10. [ ] 승인 후 `ca-pub-...` 클라이언트 ID를 제품 env `NEXT_PUBLIC_ADSENSE_CLIENT_ID`에 등록 — 2분
11. [ ] 광고 단위(슬롯) 생성 후 슬롯 ID를 `createAdSenseConfig(clientId, { 슬롯명: 'ID' })`에 채우기 — 슬롯당 2분

**membership 모드:**
12. [ ] Stripe 계정 생성 — 5분
13. [ ] SQL Editor에서 `sql/0002_membership.sql` 실행 (함수 생성, 1회) — 2분
14. [ ] 제품마다: `select public.pmd_enable_membership('제품슬러그');` — 2분
15. [ ] Stripe 대시보드에서 티어별 Product + recurring Price 생성 → `priceId`를 제품 코드의 `Tiers` 맵에 등록 — 티어당 5분
16. [ ] Webhook 엔드포인트(제품 배포 URL) 등록 + Signing secret을 env `STRIPE_WEBHOOK_SECRET`에 등록 — 5분
17. [ ] Secret key를 env `STRIPE_SECRET_KEY`에 등록 (서버 전용, 클라이언트에 노출 금지) — 2분
