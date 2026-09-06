'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createPost(formData: FormData) {
  const content = formData.get('content') as string
  const image = formData.get('image') as File | null
  const supabase = await createClient()

  const image_path = image && image.size > 0 ? await uploadImage(image) : null

  const { error } = await supabase.from('posts').insert({ content, image_path })
  if (error) throw new Error('글을 저장하지 못했습니다.')

  revalidatePath('/')
  redirect('/')
}

export async function deletePost(formData: FormData) {
  const id = Number(formData.get('id'))
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .select('image_path')
    .single()

  if (post?.image_path) {
    await supabase.storage.from('post-images').remove([post.image_path])
  }

  revalidatePath('/')
  redirect('/')
}

async function uploadImage(file: File) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims.sub

  const { data: uploaded, error } = await supabase.storage
    .from('post-images')
    .upload(`${userId}/${crypto.randomUUID()}`, file)

  if (error) return null

  return uploaded.path
}

export async function createComment(formData: FormData) {
  const post_id = Number(formData.get('post_id'))
  const content = formData.get('content') as string
  const supabase = await createClient()

  const { error } = await supabase.from('comments').insert({ post_id, content })
  if (error) throw new Error('댓글을 저장하지 못했습니다.')

  revalidatePath('/')
  revalidatePath(`/posts/${post_id}`)
}

export async function deleteComment(formData: FormData) {
  const id = Number(formData.get('id'))
  const post_id = Number(formData.get('post_id'))
  const supabase = await createClient()

  await supabase.from('comments').delete().eq('id', id)

  revalidatePath('/')
  revalidatePath(`/posts/${post_id}`)
}
