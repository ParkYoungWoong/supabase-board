import { signInWithGoogle } from '@/app/auth/actions'

export default function SignInPage() {
  return (
    <main className="mx-auto w-full max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">로그인</h1>
      <form action={signInWithGoogle}>
        <button className="w-full rounded border px-4 py-2" type="submit">
          Google 계정으로 로그인
        </button>
      </form>
    </main>
  )
}
