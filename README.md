# 애니리뷰 (Ani Review)

애니메이션 리뷰 커뮤니티 정적 웹사이트입니다. Next.js + Supabase + Vercel 스택으로 구성되어 있습니다.

애니메이션 메타데이터는 [Jikan API](https://jikan.moe)(MyAnimeList 비공식 REST API)에서 가져오며, Supabase에는 사용자 리뷰만 저장합니다.

## 기능

- MyAnimeList 인기 애니 목록 조회 (더 보기 페이지네이션)
- 애니 제목 검색 (Jikan)
- 애니 상세 페이지 (줄거리, 장르, MAL 평점 + 커뮤니티 평점)
- 애니 검색 후 리뷰 작성 (1~10점 평점)
- 리뷰 조회

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router, Static Export) |
| 스타일 | Tailwind CSS 4 |
| 애니 데이터 | Jikan API (MyAnimeList) — 키 불필요 |
| 리뷰 저장 | Supabase (PostgreSQL) |
| 배포 | Vercel |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성합니다.
2. **SQL Editor**에서 `supabase/schema.sql` 파일 내용을 실행합니다.
3. **Project Settings > API**에서 URL과 **Publishable key**를 복사합니다.
   - `Publishable key` (`sb_publishable_...`) = 예전 `anon` key와 동일 → **이 프로젝트에서 사용**
   - `Secret key` (`sb_secret_...`) = 예전 `service_role` key와 동일 → **사용하지 않음** (서버 전용)

### 3. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 Supabase 값을 입력합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxx
```

> 변수 이름은 `ANON_KEY`지만, 값에는 **Publishable key**를 넣으면 됩니다.

### 4. 로컬 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## Vercel 배포

### 방법 1: GitHub 연동 (권장)

1. GitHub에 저장소를 푸시합니다.
2. [Vercel Dashboard](https://vercel.com/new)에서 저장소를 Import합니다.
3. **Environment Variables**에 아래 값을 추가합니다:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy를 클릭합니다.

### 방법 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

환경 변수는 Vercel 대시보드 또는 CLI로 설정하세요:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 프로젝트 구조

```
ani-review/
├── src/
│   ├── app/              # 페이지 (App Router)
│   │   ├── page.tsx      # 홈
│   │   ├── anime/        # 애니 목록 & 상세
│   │   ├── reviews/      # 전체 리뷰
│   │   └── write/        # 리뷰 작성
│   ├── components/       # UI 컴포넌트
│   ├── lib/              # Supabase 클라이언트 & API
│   └── types/            # TypeScript 타입
├── supabase/
│   └── schema.sql        # DB 스키마 & 샘플 데이터
└── vercel.json           # Vercel 설정
```

## 데이터 구조

애니 메타데이터는 Jikan API에서 실시간으로 가져오므로 DB에 저장하지 않습니다.
Supabase에는 `reviews` 테이블 하나만 두고, 애니는 MyAnimeList의 `mal_id`로 식별합니다.
리뷰 목록 표시 속도를 위해 애니 제목/포스터는 리뷰에 함께 저장(비정규화)합니다.

### `reviews` 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| mal_id | integer | MyAnimeList 애니 ID |
| anime_title | text | 애니 제목 (표시용) |
| anime_image | text | 포스터 URL (표시용) |
| author_name | text | 작성자 닉네임 |
| rating | integer | 평점 (1~10) |
| title | text | 리뷰 제목 |
| content | text | 리뷰 내용 |

## 애니 데이터 (Jikan API)

- 인기 순위: `GET https://api.jikan.moe/v4/top/anime`
- 검색: `GET https://api.jikan.moe/v4/anime?q={query}`
- 상세: `GET https://api.jikan.moe/v4/anime/{mal_id}/full`

> Jikan 공용 API는 레이트 리밋(분당 약 60회)이 있습니다.

## 라이선스

MIT
