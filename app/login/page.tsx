"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { http } from "@/lib/http";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useAuthStore, AuthUser } from "@/lib/store/auth-store";

// 로그인 폼 검증 스키마
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "nsgr12@gmail.com",
      password: "K9fC2hQxB4",
    },
  });

  // /auth/login 호출 후 토큰/유저를 스토어에 저장
  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const payload = {
        email: values.email.trim(),
        password: values.password.trim(),
      };
      const res = await http.post("/auth/login", payload);
      const token = (res.data?.accessToken ?? res.data?.token) as string | undefined;
      const user = res.data?.user as AuthUser | undefined;
      if (token) {
        setAuth(token, user ?? null);
        router.replace("/posts");
      } else {
        setError("토큰이 응답에 없습니다.");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : err instanceof Error
        ? err.message
        : undefined;
      setError(message || "로그인 실패");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">이메일</label>
          <input
            type="email"
            className="w-full rounded border px-3 py-2"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">비밀번호</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            placeholder="••••••••"
            {...register("password")}
          />
        {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
