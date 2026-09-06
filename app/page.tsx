import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createPost, deletePost } from '@/app/actions'
import { signOut } from '@/app/auth/actions'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims.sub

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, content, image_path, user_id, profiles (username), comments (count)')
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
        <div className="mb-6">
          <form action={createPost} className="flex gap-2">
            <input className="flex-1 rounded border px-3 py-2" name="content" placeholder="내용을 입력하세요" required />
            <button className="rounded bg-emerald-600 px-4 py-2 text-white" type="submit">작성</button>
          </form>
          <p className="mt-2 text-right text-sm">
            <Link className="text-gray-500 underline" href="/write">사진과 함께 글쓰기</Link>
          </p>
        </div>
      )}

      {error && <p className="text-red-500">글을 가져오지 못했습니다.</p>}

      <ul className="space-y-3">
        {posts?.map(post => {
          const imageUrl = post.image_path
            ? supabase.storage.from('post-images').getPublicUrl(post.image_path).data.publicUrl
            : null

          return (
            <li key={post.id} className="rounded border p-4">
              <Link className="block" href={`/posts/${post.id}`}>
                {imageUrl && (
                  // 공개 버킷의 주소를 그대로 사용하므로 next/image의 최적화는 거치지 않습니다.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="mb-3 w-full rounded" src={imageUrl} alt="" loading="lazy" />
                )}
                <p className="whitespace-pre-wrap">{post.content}</p>
              </Link>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{post.profiles.username}</span>
                <span className="flex gap-3">
                  <Link href={`/posts/${post.id}`}>댓글 {post.comments[0]?.count ?? 0}</Link>
                  {post.user_id === userId && (
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit">삭제</button>
                    </form>
                  )}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
