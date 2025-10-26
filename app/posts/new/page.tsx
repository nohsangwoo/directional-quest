'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { http } from '@/lib/http'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AuthGuard from '../../(routes)/guard'

const forbidden = ['캄보디아', '프놈펜', '불법체류', '텔레그램']

const schema = z.object({
  title: z.string().min(1).max(80),
  body: z.string().min(1).max(2000),
  category: z.enum(['NOTICE', 'QNA', 'FREE']),
  tags: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function parseTags(input?: string): string[] {
  if (!input) return []
  const raw = input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  const uniq = Array.from(new Set(raw)).slice(0, 5)
  return uniq.filter(t => t.length <= 24)
}

function containsForbidden(text: string): string | null {
  for (const w of forbidden) if (text.includes(w)) return w
  return null
}

export default function NewPostPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const create = useMutation({
    mutationFn: async (payload: any) => {
      const res = await http.post('/posts', payload)
      return res.data
    },
    onSuccess: async (res: any) => {
      await qc.invalidateQueries({ queryKey: ['posts'] })
      router.replace(`/posts/${res.id}`)
    },
  })

  const onSubmit = async (values: FormValues) => {
    const bad = containsForbidden(values.title + values.body)
    if (bad) {
      alert(`금칙어 포함: ${bad}`)
      return
    }
    const tags = parseTags(values.tags)
    await create.mutateAsync({
      title: values.title,
      body: values.body,
      category: values.category,
      tags,
    })
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-xl font-bold">게시글 작성</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">제목</label>
            <input
              className="w-full rounded border px-3 py-2"
              {...register('title')}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm">내용</label>
            <textarea
              rows={10}
              className="w-full rounded border px-3 py-2"
              {...register('body')}
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm">카테고리</label>
            <select
              className="rounded border px-2 py-1"
              {...register('category')}
            >
              <option value="NOTICE">NOTICE</option>
              <option value="QNA">QNA</option>
              <option value="FREE">FREE</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm">
              태그(쉼표 구분, 최대 5개)
            </label>
            <input
              placeholder="coffee,react"
              className="w-full rounded border px-3 py-2"
              {...register('tags')}
            />
            <p className="mt-1 text-xs text-zinc-500">
              각 태그 최대 24자, 중복 자동 제거
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || create.isPending}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {create.isPending ? '작성 중...' : '작성'}
          </button>
        </form>
      </div>
    </AuthGuard>
  )
}
