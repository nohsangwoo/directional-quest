'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { http } from '@/lib/http'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { useAuthStore, AuthUser } from '@/lib/store/auth-store'
import { Mail, Lock, LogIn } from 'lucide-react'

// 로그인 폼 검증 스키마
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const setAuth = useAuthStore(s => s.setAuth)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'nsgr12@gmail.com',
      password: 'K9fC2hQxB4',
    },
  })

  // /auth/login 호출 후 토큰/유저를 스토어에 저장
  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      const payload = {
        email: values.email.trim(),
        password: values.password.trim(),
      }
      const res = await http.post('/auth/login', payload)
      const token = (res.data?.accessToken ?? res.data?.token) as
        | string
        | undefined
      const user = res.data?.user as AuthUser | undefined
      if (token) {
        setAuth(token, user ?? null)
        router.replace('/posts')
      } else {
        setError('토큰이 응답에 없습니다.')
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : err instanceof Error
        ? err.message
        : undefined
      setError(message || '로그인 실패')
    }
  }

  const onDemo = () => {
    setValue('email', 'nsgr12@gmail.com', { shouldValidate: true })
    setValue('password', 'K9fC2hQxB4', { shouldValidate: true })
  }

  return (
    <div className="relative min-h-[calc(100svh-56px)] overflow-hidden bg-black">
      {/* Aurora / Neon background */}
      <div className="pointer-events-none absolute inset-0 aurora-bg" />
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40 scanlines" />

      <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-6xl items-center justify-center px-6 py-16 sm:py-20">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[0_0_80px_rgba(195,255,10,0.12)] backdrop-blur-xl">
          <div className="text-center">
            <h1 className="bg-[linear-gradient(180deg,#fff,rgba(255,255,255,.7))] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
              로그인
            </h1>
            <p className="mt-2 text-sm text-white/70">
              계정으로 계속 진행해주세요
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-white/80">
                이메일
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={16}
                />
                <input
                  type="email"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-10 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-emerald-400/0 transition focus:border-emerald-300/40 focus:ring-2"
                  placeholder="you@example.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-white/80">
                비밀번호
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={16}
                />
                <input
                  type="password"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-10 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-emerald-400/0 transition focus:border-emerald-300/40 focus:ring-2"
                  placeholder="••••••••"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="mt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(52,211,153,0.6)] transition hover:bg-emerald-300 disabled:opacity-60"
              >
                <LogIn
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
                {isSubmitting ? '로그인 중...' : '로그인'}
              </button>
              <button
                type="button"
                onClick={onDemo}
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 backdrop-blur hover:bg-white/10"
              >
                데모 계정 채우기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
