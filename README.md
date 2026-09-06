# Supabase Board

[Supabase 핵심 정리](https://heropy.dev/p/Q15h8Q) 글의 예제 프로젝트입니다.
Next.js 16과 Supabase로 만든 게시판으로, 글에서 다루는 기능을 모두 구현했습니다.

- 글 목록과 상세 페이지, 글 작성과 삭제(서버 컴포넌트와 서버 액션)
- Google 로그인과 가입 시 프로필 자동 생성
- 행 수준 보안(RLS) 정책으로 작성자만 수정하고 삭제
- 스토리지에 이미지 업로드, 글을 삭제하면 이미지도 함께 삭제
- 댓글 작성과 삭제, Realtime 구독으로 새 댓글을 즉시 반영
- 데이터베이스 스키마에서 생성한 TypeScript 타입

## 준비

1. Supabase 프로젝트를 만들고, 글에 있는 SQL을 SQL Editor에서 순서대로 실행해 테이블과 정책, 함수, 버킷을 만듭니다.
2. 글의 'Google 로그인' 절을 따라 Google Cloud와 Supabase에 로그인 제공자를 설정합니다.
3. 'Database > Publications' 페이지에서 `supabase_realtime` 항목의 `comments` 테이블을 켭니다.
4. 루트에 `.env.local` 파일을 만들고 프로젝트 주소와 Publishable 키를 저장합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://프로젝트ID.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인합니다.

## 타입 생성

`lib/database.types.ts`는 데이터베이스 스키마에서 생성한 파일입니다.
테이블을 변경한 뒤에는 다시 생성합니다.

```bash
npx supabase login
npx supabase gen types typescript --project-id 프로젝트ID > lib/database.types.ts
```

## 구조

| 경로 | 역할 |
| --- | --- |
| `app/page.tsx` | 글 목록과 빠른 작성 폼 |
| `app/write/page.tsx` | 사진과 함께 글쓰기 |
| `app/posts/[id]/page.tsx` | 글 상세와 댓글 |
| `app/actions.ts` | 글, 댓글, 이미지 업로드 서버 액션 |
| `app/auth/` | Google 로그인 액션과 콜백 |
| `app/signin/page.tsx` | 로그인 페이지 |
| `components/Comments.tsx` | 새 댓글 Realtime 구독 |
| `lib/supabase/` | 서버와 브라우저 클라이언트, 세션 갱신 |
| `lib/database.types.ts` | 생성된 데이터베이스 타입 |
| `proxy.ts` | 세션 갱신과 `/write` 경로 보호 |
