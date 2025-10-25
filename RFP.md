
# 퀘스트 개요

* 목표: **React + TS**로 게시판 CRUD + 검색/정렬/필터/페이지네이션, 그리고 **3종 데이터 시각화** 구현
* 인증: `/auth/login`으로 토큰 발급 → 모든 보호 API 호출 시 `Authorization: Bearer {token}` 헤더 사용
* API 문서: [https://fe-hiring-rest-api.vercel.app/docs](https://fe-hiring-rest-api.vercel.app/docs)

---

# 0. 스타트(부트업)

* [ ] Vite(또는 CRA) + React 18 + TypeScript 새 프로젝트 생성
* [ ] 라이브러리 설치(권장):

  * 데이터패칭: **@tanstack/react-query**
  * 요청: **axios**
  * 라우팅: **react-router-dom**
  * 차트: **recharts**(또는 nivo/ECharts)
  * 폼/검증(선택): **react-hook-form + zod**
* [ ] 환경변수: `VITE_API_BASE_URL=https://fe-hiring-rest-api.vercel.app`
* [ ] 전역에 axios 인스턴스 만들고, 토큰 있으면 `Authorization` 헤더 자동 주입

---

# 1. 인증 퀘스트

* [ ] **로그인 페이지**: 이메일/비밀번호 입력 → `/auth/login` 호출 → `accessToken` 저장(localStorage 등)
* [ ] **토큰 가드**: 토큰 없으면 로그인으로 리다이렉트
* [ ] **로그아웃**: 토큰 제거

---

# 2. 게시판 퀘스트 (핵심)

데이터 구조(요약):
`id, userId, title(≤80), body(≤2000), category(NOTICE|QNA|FREE), tags(string[] ≤5, 각 ≤24), createdAt`

## 2-1. 목록 페이지

* [ ] **목록 조회**: `/posts` 커서 기반 페이징
* [ ] **검색**: 제목+본문 like 검색 쿼리 반영
* [ ] **정렬**: `title` 또는 `createdAt` 기준 **asc/desc** 토글
* [ ] **필터**: `category` 드롭다운(NOTICE/QNA/FREE/ALL)
* [ ] **페이지네이션**: **커서 기반**(nextCursor/prevCursor 버튼)

  * API 응답의 `nextCursor` 받아 다음 페이지 요청
* [ ] 카드/테이블 형태로 `title`, `category`, `createdAt`, `tags` 표시
* [ ] 상세로 이동 링크

## 2-2. 상세 페이지

* [ ] `/posts/{id}` 조회
* [ ] **수정 버튼**, **삭제 버튼** 노출(본인 작성자 검증은 API 정책에 따름—없다면 UI만 제공)

## 2-3. 작성/수정 페이지

* [ ] 필드: `title`, `body`, `category(라디오/셀렉트)`, `tags(쉼표 구분 또는 태그 입력 UI)`
* [ ] **금칙어 필터(프론트 선제 체크)**:
  포함되면 제출 막기 및 에러 안내

  * `"캄보디아"`, `"프놈펜"`, `"불법체류"`, `"텔레그램"`
* [ ] **유효성**:

  * title ≤ 80
  * body ≤ 2000
  * tags ≤ 5 & 각 길이 ≤ 24 & **중복 제거**
* [ ] 작성: `POST /posts`
* [ ] 수정: `PATCH /posts/{id}`
* [ ] 삭제: `DELETE /posts/{id}`(상세/목록에서 가능)

## 2-4. UX 디테일

* [ ] 로딩 스켈레톤/스피너
* [ ] 실패 시 토스트/에러영역 노출
* [ ] 성공 후 목록/상세로 라우팅 및 캐시 무효화(react-query)

---

# 3. 데이터 시각화 퀘스트 (3개 엔드포인트)

## 3-1. `/mock/top-coffee-brands`

* [ ] **바 차트** 1개
* [ ] **도넛 차트** 1개

  * 브랜드별 값 시각화, 범례 및 툴팁 표시

## 3-2. `/mock/weekly-mood-trend`

* [ ] **스택형 바 차트** 1개
* [ ] **스택형 면적 차트** 1개(Area Stack)

  * X축: `week` / Y축: **%**
  * 시리즈: `happy`, `tired`, `stressed` **누적(Stacked)**
  * 툴팁: 주차별 시리즈 값 합계 100% 컨텍스트 전달

## 3-3. `/mock/coffee-consumption`

* [ ] **멀티라인 차트** 1개

  * X축: **커피 섭취량(잔/일)**
  * **좌 Y축**: 버그 수(`bugs`)
  * **우 Y축**: 생산성(`productivity`)
  * 팀별(Frontend/Backend/AI 등) **2개 라인** 표시

    * 실선: 버그 수(원형 마커)
    * 점선: 생산성(사각형 마커)
    * **같은 팀은 같은 색상**(실선/점선 구분만 스타일로)
  * 범례/툴팁: 호버한 **라인의 X 지점** 기준으로 **잔수 + 해당 팀의 버그/생산성** 함께 표시

---

# 4. 라우팅 구조(예시)

* `/login`
* `/posts` (목록 + 검색/정렬/필터/커서 페이징)
* `/posts/new` (작성)
* `/posts/:id` (상세)
* `/posts/:id/edit` (수정)
* `/charts` (3개 섹션 탭으로 분리하거나 앵커 링크)

---

# 5. API 연동 팁

* [ ] axios 인스턴스에 `baseURL` 설정 + 응답 에러 공통 처리
* [ ] 요청 전 인터셉터에서 **토큰 주입**
* [ ] react-query: `useQuery`/`useMutation` + `queryKey`에 검색/정렬/필터/커서 포함
* [ ] 태그 입력 시 **중복 제거**(Set) & 최대 5개 제한

---

# 6. README 체크리스트(제출 필수)

* [ ] **실행 방법**(env, 설치, dev/build, 포트)
* [ ] **기술 스택**(왜 선택했는지 한 줄 메모)
* [ ] **주요 구현 기능 요약**(위 요구사항 매핑 표)
* [ ] **페이지/기능 스크린샷**(선택)
* [ ] **배포 링크**(선택: Vercel 등)
* [ ] **한계/추가하고 싶은 개선점**(선택)

---

# 7. 완료 판정(간단 테스트 시나리오)

* [ ] 로그인 성공 → 토큰 저장됨
* [ ] 게시글 작성: 금칙어 포함 시 거절, 정상 데이터는 생성 OK
* [ ] 목록: 검색/정렬/필터 동작, **다음 페이지** 버튼으로 커서 이동
* [ ] 상세: 내용 보임, 수정/삭제 동작
* [ ] 수정: 제목 81자/태그 6개/태그 25자 초과 시 프론트 차단
* [ ] 차트 페이지: 3개 엔드포인트 시각화 모두 렌더, 툴팁/범례/축 설정 요구사항 충족
* [ ] 새로고침해도 상태 일관(토큰 유지, react-query 재패칭)

---

# 8. 가점 포인트(선택)

* [ ] **배포(Vercel)** + 간단한 404/에러 바운더리
* [ ] ESLint + Prettier 설정
* [ ] 접근성 고려(aria-label, 색 대비)
* [ ] 간단한 유닛테스트(예: 태그 유효성 유틸)
* [ ] 스켈레톤/낙관적 업데이트 적용

---

