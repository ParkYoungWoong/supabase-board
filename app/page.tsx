import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createPost, deletePost } from '@/app/actions'
import { signOut } from '@/app/auth/actions'

type Profile = { username: string }

function authorName(profiles: unknown) {
  const p = profiles as Profile | Profile[] | null
  return (Array.isArray(p) ? p[0]?.username : p?.username) ?? '알 수 없음'
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims.sub

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, content, created_at, user_id, profiles (username)')
    .order('created_at', { ascending: false })

  return (
    <main className="mx-auto w-full max-w-xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">게시판</h1>
        {userId ? (
          <form action={signOut}>
            <button className="rounded border px-3 py-1 text-sm" type="submit">로그아웃</button>
          </form>
        ) : (
          <Link className="rounded border px-3 py-1 text-sm" href="/signin">로그인</Link>
        )}
      </header>

      {userId && (
        <form action={createPost} className="mb-6 flex gap-2">
          <input className="flex-1 rounded border px-3 py-2" name="content" placeholder="내용을 입력하세요" required />
          <button className="rounded bg-emerald-600 px-4 py-2 text-white" type="submit">작성</button>
        </form>
      )}

      {error && <p className="text-red-500">글을 가져오지 못했습니다.</p>}

      <ul className="space-y-3">
        {posts?.map(post => (
          <li key={post.id} className="rounded border p-4">
            <p>{post.content}</p>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <span>{authorName(post.profiles)}</span>
              {post.user_id === userId && (
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit">삭제</button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
