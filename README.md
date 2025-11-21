## 이겨보자 - 더존비즈온 인턴십 과제 
공공데이터를 활용한 경주마 탐색/상세/즐겨찾기/노트/댓글/AI 분석 기능을 제공하는 풀스택 프로젝트입니다.

## 배포 주소
https://racing-horse.vercel.app/

## 기술 스택

- Frontend: React 18, Vite, styled-components, Axios
- Backend: Node.js (Express), MongoDB (Mongoose)
- Auth: JWT (bcrypt 비밀번호 해시)
- AI: OpenAI SDK (키 미제공 시 휴리스틱 분석으로 대체)

## 폴더 구조

```
client/                # Vite 기반 React 클라이언트
	src/
		api/               # axios 설정
		components/        # UI 컴포넌트 및 모달/탭 등
		App.jsx            # 앱 루트(검색/페이징/상세/AI 등)
server/                # Express + MongoDB 서버
	src/
		index.js           # 서버 부트스트랩(CORS/보안/라우팅)
		middleware/        # JWT 등 공통 미들웨어
		controllers/       # 요청 처리(컨트롤러 레이어)
		services/          # 비즈니스 로직(서비스 레이어)
		routes/            # 라우트 → 컨트롤러 위임
		models/            # Mongoose 스키마(Horse/User/Comment)
		seed/              # 샘플 데이터 주입 스크립트
```

## 빠른 시작

사전 요구사항: Node.js 18+, 로컬 MongoDB (기본: mongodb://localhost:27017)

2) 의존성 설치

```powershell
# 서버
cd server
npm install

# 클라이언트 (새 터미널)
cd ../client
npm install
```

3) 로컬 실행

```powershell
# 서버 실행 (http://localhost:4000)
cd server
npm run dev

# 클라이언트 실행 (http://localhost:5173)
cd client
npm run dev
```

## 주요 기능

- 말 목록 검색/페이징/정렬
- 말 상세 조회 및 AI 분석(선택)
- 회원가입/로그인(JWT), 내 정보 조회
- 즐겨찾기 토글, 말별 개인 노트 저장
- 말별 댓글 목록/작성

## 핵심 API 요약

Base URL: http://localhost:4000

- 헬스체크: GET /api/health
- 말 목록: GET /api/horses
	- Query: page|pageNo, limit|numOfRows, hr_name|hrName, hr_no|hrNo, sort(popularity|recentOrd|updatedAt)
	- 응답: { page, limit, total, totalPages, sort, items[] }
- 말 상세: GET /api/horses/:hrNo
- 회원가입: POST /api/auth/register { email, password }
- 로그인: POST /api/auth/login { email, password }
- 내 정보(보호): GET /api/users/me (Authorization: Bearer <token>)
- 즐겨찾기 토글(보호): POST /api/users/favorites/toggle { hrNo }
- 노트 저장(보호): POST /api/users/notes { hrNo, note }
- 댓글 목록: GET /api/comments?hrNo=H001&page=1&limit=10
- 댓글 작성: POST /api/comments { hrNo, userEmail, content }
- AI 분석: POST /api/ai/analyze { hrNo }

상세한 스키마/에러 포맷/AI 설정은 `server/README.md`를 참고하세요.

