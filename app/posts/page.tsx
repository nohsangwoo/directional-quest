"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import Link from "next/link";
import AuthGuard from "../(routes)/guard";

const categories = ["ALL", "NOTICE", "QNA", "FREE"] as const;

interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: "NOTICE" | "QNA" | "FREE";
  tags: string[];
  createdAt: string;
}

interface PostsResponse {
  items: Post[];
  nextCursor?: string | null;
  prevCursor?: string | null;
}

export default function PostsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [category, setCategory] = useState<(typeof categories)[number]>("ALL");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorParam, setCursorParam] = useState<"next" | "prev" | undefined>(undefined);

  const { data, isLoading, error, refetch } = useQuery<PostsResponse>({
    queryKey: [
      "posts",
      { search, sortBy, sortOrder, category, cursor, cursorParam },
    ],
    queryFn: async () => {
      const params: Record<string, any> = {
        search: search || undefined,
        sort: sortBy, // Swagger: sort
        order: sortOrder, // Swagger: order
        category: category === "ALL" ? undefined : category,
      };
      if (cursor && cursorParam === "next") params.nextCursor = cursor;
      if (cursor && cursorParam === "prev") params.prevCursor = cursor;
      const res = await http.get("/posts", { params });
      return res.data as PostsResponse;
    },
    staleTime: 10_000,
  });

  const onToggleSort = (key: "title" | "createdAt") => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortOrder("desc");
    } else {
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    }
    // 정렬 변경 시 커서 초기화
    setCursor(undefined);
    setCursorParam(undefined);
  };

  return (
    <AuthGuard>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">게시판</h1>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="block text-xs">검색</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && refetch()}
              className="rounded border px-2 py-1"
              placeholder="제목/본문 검색"
            />
          </div>
          <div>
            <label className="block text-xs">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="rounded border px-2 py-1"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            <button
              className="rounded border px-2 py-1 text-sm"
              onClick={() => onToggleSort("title")}
            >
              제목정렬 {sortBy === "title" ? `(${sortOrder})` : ""}
            </button>
            <button
              className="rounded border px-2 py-1 text-sm"
              onClick={() => onToggleSort("createdAt")}
            >
              생성일정렬 {sortBy === "createdAt" ? `(${sortOrder})` : ""}
            </button>
            <button className="rounded bg-black px-3 py-1 text-white" onClick={() => refetch()}>
              검색/정렬/필터 적용
            </button>
          </div>
        </div>

        {isLoading && <div>로딩중...</div>}
        {error && <div className="text-red-600">불러오기 실패</div>}

        {data && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {data.items.map((p) => (
                <Link
                  key={p.id}
                  href={`/posts/${p.id}`}
                  className="rounded border p-3 hover:bg-zinc-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
                    <span className="rounded bg-zinc-100 px-2 py-0.5">{p.category}</span>
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.map((t) => (
                        <span key={t} className="rounded bg-zinc-100 px-2 py-0.5">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              {data.items.length === 0 && (
                <div className="text-sm text-zinc-500">내 게시글이 없습니다. 먼저 새 글을 작성해보세요.</div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="rounded border px-3 py-1"
                disabled={!data.prevCursor}
                onClick={() => {
                  setCursor(data.prevCursor || undefined);
                  setCursorParam("prev");
                }}
              >
                이전 페이지
              </button>
              <button
                className="rounded border px-3 py-1"
                disabled={!data.nextCursor}
                onClick={() => {
                  setCursor(data.nextCursor || undefined);
                  setCursorParam("next");
                }}
              >
                다음 페이지
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
