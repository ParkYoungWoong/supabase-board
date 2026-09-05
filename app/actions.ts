'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createPost(formData: FormData) {
  const content = formData.get('content') as string
  const supabase = await createClient()

  const { error } = await supabase.from('posts').insert({ content })
  if (error) throw new Error('글을 저장하지 못했습니다.')

  revalidatePath('/')
}

export async function deletePost(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()

  await supabase.from('posts').delete().eq('id', id)
  revalidatePath('/')
}
