import Link from 'next/link'
import { createPost } from '@/app/actions'

export default function WritePage() {
  return (
    <main className="mx-auto w-full max-w-xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">글쓰기</h1>
        <Link className="rounded border px-3 py-1 text-sm" href="/">목록</Link>
      </header>
      <form action={createPost} className="space-y-4">
        <textarea
          className="w-full rounded border px-3 py-2"
          name="content"
          placeholder="내용을 입력하세요"
          rows={5}
          required
        />
        <input className="block w-full text-sm" type="file" name="image" accept="image/*" />
        <button className="rounded bg-emerald-600 px-4 py-2 text-white" type="submit">작성</button>
      </form>
    </main>
  )
}
