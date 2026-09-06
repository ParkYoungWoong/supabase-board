import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createComment, deleteComment, deletePost } from '@/app/actions'
import Comments from '@/components/Comments'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const postId = Number(id)
  if (!Number.isInteger(postId)) notFound()

  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles (username), comments (id, content, user_id, profiles (username))')
    .eq('id', postId)
    .order('created_at', { referencedTable: 'comments', ascending: true })
    .single()

  if (!post) notFound()

  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims.sub

  const imageUrl = post.image_path
    ? supabase.storage.from('post-images').getPublicUrl(post.image_path).data.publicUrl
    : null

  return (
    <main className="mx-auto w-full max-w-xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">글</h1>
        <Link className="rounded border px-3 py-1 text-sm" href="/">목록</Link>
      </header>

      <article className="rounded border p-4">
        {imageUrl && (
          // 공개 버킷의 주소를 그대로 사용하므로 next/image의 최적화는 거치지 않습니다.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="mb-4 w-full rounded" src={imageUrl} alt="" />
        )}
        <p className="whitespace-pre-wrap">{post.content}</p>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>{post.profiles.username}</span>
          {post.user_id === userId && (
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <button type="submit">삭제</button>
            </form>
          )}
        </div>
      </article>

      <section className="mt-8">
        <h2 className="mb-3 font-bold">댓글 {post.comments.length}</h2>
        <ul className="space-y-2">
          {post.comments.map(comment => (
            <li key={comment.id} className="rounded border p-3">
              <p className="whitespace-pre-wrap">{comment.content}</p>
              <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                <span>{comment.profiles.username}</span>
                {comment.user_id === userId && (
                  <form action={deleteComment}>
                    <input type="hidden" name="id" value={comment.id} />
                    <input type="hidden" name="post_id" value={post.id} />
                    <button type="submit">삭제</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>

        {userId ? (
          <form action={createComment} className="mt-4 flex gap-2">
            <input type="hidden" name="post_id" value={post.id} />
            <input className="flex-1 rounded border px-3 py-2" name="content" placeholder="댓글을 입력하세요" required />
            <button className="rounded bg-emerald-600 px-4 py-2 text-white" type="submit">등록</button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            <Link className="underline" href="/signin">로그인</Link>하면 댓글을 작성할 수 있습니다.
          </p>
        )}
      </section>

      <Comments postId={post.id} />
    </main>
  )
}
