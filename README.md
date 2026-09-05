# Supabase Board

[Supabase 핵심 정리](https://heropy.dev/p/Q15h8Q) 글의 예제 프로젝트입니다.
Next.js 16과 Supabase로 만든 게시판으로, 데이터베이스 조회와 수정, Google 로그인, 행 수준 보안(RLS), 스토리지 업로드를 다룹니다.

## 준비

Supabase 프로젝트를 만든 뒤 루트에 `.env.local` 파일을 만들고 프로젝트 주소와 Publishable 키를 저장합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://프로젝트ID.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

테이블과 정책, 버킷은 글에 있는 SQL을 Supabase 대시보드의 SQL Editor에서 순서대로 실행해 만듭니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인합니다.
