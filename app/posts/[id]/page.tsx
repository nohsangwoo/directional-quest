"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "../../(routes)/guard"; // 보호 페이지: 토큰 없으면 로그인으로 이동

// 단일 게시글 타입
interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: "NOTICE" | "QNA" | "FREE";
  tags: string[];
  createdAt: string;
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const id = params?.id as string;

  // 상세 조회
  const { data, isLoading, error } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await http.get(`/posts/${id}`);
      return res.data as Post;
    },
  });

  // 삭제
  const remove = useMutation({
    mutationFn: async () => {
      await http.delete(`/posts/${id}`);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["posts"] });
      router.replace("/posts");
    },
  });

  if (isLoading) return <AuthGuard>로딩중...</AuthGuard>;
  if (error || !data) return <AuthGuard>불러오기 실패</AuthGuard>;

  return (
    <AuthGuard>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{data.title}</h1>
          <div className="flex gap-2 text-sm">
            <Link className="rounded border px-3 py-1" href={`/posts/${id}/edit`}>
              수정
            </Link>
            <button
              className="rounded border px-3 py-1"
              onClick={() => remove.mutate()}
              disabled={remove.isPending}
            >
              {remove.isPending ? "삭제중..." : "삭제"}
            </button>
          </div>
        </div>
        <div className="text-xs text-zinc-600">
          {new Date(data.createdAt).toLocaleString()} · {data.category}
        </div>
        <div className="whitespace-pre-wrap rounded border p-4 text-sm">{data.body}</div>
        <div className="flex flex-wrap gap-1 text-xs">
          {data.tags?.map((t) => (
            <span key={t} className="rounded bg-zinc-100 px-2 py-0.5">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
