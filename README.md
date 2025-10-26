# Quest For Job

## 실행 방법

1. 의존성 설치

```bash
npm i
```

2. 배포링크
   https://directional-quest.vercel.app/

````

3. 개발 서버 실행

```bash
npm run dev
````

- 기본 포트: 3000

## 기술 스택

- Next.js(App Router), React 19, TypeScript
- 데이터 패칭: @tanstack/react-query
- HTTP: axios
- 폼/검증: react-hook-form + zod
- 차트: recharts

## 라우팅

- `/login`
- `/posts` (목록 + 검색/정렬/필터/커서 페이징)
- `/posts/new` (작성)
- `/posts/:id` (상세)
- `/posts/:id/edit` (수정)
- `/charts` (데이터 시각화)

## 구현 요약 (요구사항 매핑)

- 인증
  - `/auth/login` 연동, `accessToken` localStorage 저장, 가드/로그아웃 구현
- 게시판
  - 목록: `/posts` 커서 페이징, 검색/정렬(title|createdAt asc/desc)/카테고리 필터(ALL 포함)
  - 상세: `/posts/{id}` 조회, 수정/삭제 제공
  - 작성: `POST /posts`, 수정: `PATCH /posts/{id}`, 삭제: `DELETE /posts/{id}`
  - 금칙어(캄보디아/프놈펜/불법체류/텔레그램) 사전차단, 제목≤80/본문≤2000/태그≤5(중복 제거, 각 ≤24)
  - 로딩/에러 메시지, 성공 시 라우팅 및 캐시 무효화
- 시각화
  - `/mock/top-coffee-brands`: 바 차트, 도넛(Pie) 차트 + 범례/툴팁
  - `/mock/weekly-mood-trend`: 스택형 바/스택형 면적, X: week, Y: %
  - `/mock/coffee-consumption`: 멀티라인(좌Y: bugs, 우Y: productivity), 팀별 동일색/실선/점선, 범례/툴팁

## 한계/개선점

- 서버 렌더링 구간에서 토큰 접근 제한으로 가드는 클라이언트에서 동작
- 디자인은 심플한 기본 스타일, 필요 시 컴포넌트화/디자인 시스템 도입 가능
