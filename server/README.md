# racing-horse server (Express + MongoDB)

## 요구 사항
- Node.js 18+
- 로컬 MongoDB (기본: mongodb://localhost:27017)

## 설치 & 실행
```powershell
cd server
npm install
npm run dev
```

- 서버: http://localhost:4000
- 헬스체크: GET /api/health
- 말 목록: GET /api/horses?page=1&limit=10&hr_name=말이름&hr_no=마번
- 공공 API 파라미터 호환: pageNo, numOfRows, hrName, hrNo 도 동일하게 사용 가능
- 즐겨찾기/노트/댓글 기능 추가 (아래 API 문서 참고)

### 모델 설계 (Horse)
| 필드 | 타입 | 설명 |
|------|------|------|
| hrNo | String (unique) | 말 고유 번호 |
| hrName | String | 말 이름 (부분 검색 가능, 대소문자 무시) |
| meet | String | 경마장 명 |
| age | Number | 나이 |
| sex | String | 성별 ('수','암' 등) |
| debut | String | 데뷔일 (ISO 문자열, 추후 Date 변환 가능) |
| rcCntT | Number | 통산 출주 수 |
| ord1CntT | Number | 통산 1위 횟수 |
| ord2CntT | Number | 통산 2위 횟수 |
| winRateT | Number | 통산 승률(%) |
| qnlRateT | Number | 통산 연대율(%) |
| recentRcDate | String | 최근 경주일 |
| recentOrd | Number | 최근 순위(1이 가장 우수) |
| recentRcDist | Number | 최근 경주 거리(m) |
| recentRating | Number | 최근 레이팅 |
| recentBudam | Number | 최근 부담중량(kg) |
| chaksunT | String | 최근 착순 패턴 예: '1-2-3' |
| popularity | Number | 인기(가중치/정렬용) |
| raw | Mixed | 원본 외부 API 응답 저장 |
| timestamps | Date | createdAt / updatedAt 자동 관리 |

인덱스: hrNo(unique), hrName(검색), updatedAt(최신 정렬).

### 목록 API 설계
Endpoint: GET /api/horses

Query Params:
- page | pageNo: 페이지 번호 (기본 1)
- limit | numOfRows: 페이지당 문서 수 (기본 20, 최대 100)
- hr_name | hrName: 말 이름 부분 검색 (대소문자 무시, regex)
- hr_no | hrNo: 말 번호 정확 매칭
- sort: 정렬 기준 (popularity | recentOrd | updatedAt[기본])

응답 구조:
```json
{
  "page": 1,
  "limit": 20,
  "total": 120,
  "totalPages": 6,
  "sort": "updatedAt",
  "items": [ { "hrNo": "H001", "hrName": "..." } ]
}
```

### 단건 조회 API
Endpoint: GET /api/horses/:hrNo
404 시 `{ "error": "Not Found" }`

### 응답 예시 (요약 버전)
```json
{
  "page": 1,
  "limit": 10,
  "total": 2,
  "totalPages": 1,
  "items": [ { /* Horse */ } ]
}
```

## 시드 데이터(선택)
```powershell
npm run seed
```

## 폴더 구조
```
server/
  package.json
  .env.example
  README.md
  src/
    index.js            # 앱 부트스트랩(Express, Mongo 연결)
    middleware/
      auth.js           # JWT 서명/검증 미들웨어
    controllers/
      horseController.js   # 요청 처리: 말 목록/단건
      userController.js    # 요청 처리: 사용자 me/즐겨찾기/노트
      authController.js    # 요청 처리: 회원가입/로그인
      commentController.js # 요청 처리: 댓글 목록/작성
      aiController.js      # 요청 처리: AI 분석 요청
    services/
      ai.js             # OpenAI 연동 및 휴리스틱 분석
      horseService.js   # 말 도메인 비즈니스 로직
      userService.js    # 사용자 도메인 비즈니스 로직
      authService.js    # 인증 도메인 비즈니스 로직
      commentService.js # 댓글 도메인 비즈니스 로직
    routes/
      health.js         # /api/health
      horses.js         # /api/horses -> controllers.horseController 위임
      users.js          # /api/users -> controllers.userController 위임
      comments.js       # /api/comments -> controllers.commentController 위임
      auth.js           # /api/auth -> controllers.authController 위임
      ai.js             # /api/ai -> controllers.aiController 위임
    models/
      Horse.js          # 말 스키마
      User.js           # 사용자 스키마(email,favorites,notes)
      Comment.js        # 댓글 스키마(hrNo,userEmail,content)
    seed/
      seed.js           # 샘플 데이터 주입 스크립트
```

## CORS
- 기본 허용: http://localhost:5173
- 필요 시 `src/index.js`의 cors 옵션에서 도메인 추가/변경

## AI 분석 API (GPT)

환경변수(.env):
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

엔드포인트:
- POST `/api/ai/analyze`
  - Body: `{ "hrNo": "H001" }`
  - 동작: DB에서 hrNo로 말 데이터를 읽어 GPT에 프롬프트로 전달 → 분석 텍스트 반환
  - 응답: `{ success: true, analysis: "강점...", model?: "..." }`
  - 키 미설정/오류 시: 휴리스틱 분석으로 대체 반환 `{ success: true, analysis: "...", heuristic: true }`

프롬프트 정책:
- 모델에 전달되는 정보: 말의 기본/통계/최근 정보(스키마 기반)
- 출력: 한국어, 강점/리스크/종합 평가 순서의 간결 문장

## 인증 / 사용자 / 즐겨찾기 / 노트 / 댓글 API (JWT 기반)

### 인증 개요
- 회원가입 / 로그인 시 JWT 발급 (Bearer 토큰)
- 이후 보호된 엔드포인트에 `Authorization: Bearer <token>` 헤더 필요
- 환경변수: `JWT_SECRET`, `JWT_EXPIRES_IN`

### 회원가입
POST /api/auth/register
```json
{ "email": "user@example.com", "password": "secret123" }
```
응답:
```json
{ "token": "<JWT>", "user": { "email": "user@example.com", ... } }
```

### 로그인
POST /api/auth/login
```json
{ "email": "user@example.com", "password": "secret123" }
```
응답:
```json
{ "token": "<JWT>", "user": { "email": "user@example.com", ... } }
```

### 내 정보 조회 (보호)
GET /api/users/me
Headers: `Authorization: Bearer <token>`
응답: 사용자 문서(JSON)

### 즐겨찾기 토글 (보호)
POST /api/users/favorites/toggle
Headers: `Authorization: Bearer <token>`
Body:
```json
{ "hrNo": "H001" }
```
응답:
```json
{ "favorites": ["H001", "H002"] }
```

### 노트 저장 (보호)
POST /api/users/notes
Headers: `Authorization: Bearer <token>`
Body:
```json
{ "hrNo": "H001", "note": "이 말은 장거리에서 강함" }
```
응답:
```json
{ "notes": { "H001": "이 말은 장거리에서 강함" } }
```

### 댓글 목록 조회
GET /api/comments?hrNo=H001&page=1&limit=10
응답:
```json
{ "page":1, "limit":10, "total":5, "totalPages":1, "items":[ { "id":"...", "hrNo":"H001", "userEmail":"user@example.com", "content":"최근 폼 좋음" } ] }
```

### 댓글 작성 (현재는 공개)
POST /api/comments
Body:
```json
{ "hrNo": "H001", "userEmail": "user@example.com", "content": "최근 폼 좋음" }
```
응답: 생성된 댓글 문서

> 댓글 작성도 JWT 인증으로 userEmail을 자동 주입하도록 변경 가능 (현재는 단순 프로토타입)

### 에러 포맷
```json
{ "error": "메시지" }
```