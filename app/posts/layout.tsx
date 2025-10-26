'use client'
import Link from 'next/link'
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'

export default function PostsLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const clearAuth = useAuthStore(s => s.clearAuth)
  const user = useAuthStore(s => s.user)

  const onLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <nav className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <Link href="/posts">목록</Link>
          <Link href="/posts/new">작성</Link>
          <Link href="/charts">차트</Link>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user?.email && <span className="text-zinc-500">{user.email}</span>}
          <button className="underline" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </nav>
      {children}
    </div>
  )
}
