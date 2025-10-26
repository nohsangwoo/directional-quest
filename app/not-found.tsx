import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100svh-56px)] items-center justify-center overflow-hidden bg-black text-zinc-100">
      {/* Cyberpunk background */}
      <div className="pointer-events-none absolute inset-0 cyber-bg" />
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40 scanlines" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <div className="mx-auto w-fit">
          <h1 className="glitch-title" data-text="404">404</h1>
        </div>
        <p className="mt-4 text-zinc-300">찾으시는 페이지를 찾을 수 없습니다.</p>
        <p className="text-zinc-500">broken link, moved resource or mistyped URL</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button className="neon-btn">Home</Button>
          </Link>
          <Link href="/posts">
            <Button className="text-zinc-800" variant="outline">Posts</Button>
          </Link>
          <Link href="/charts">
            <Button variant="ghost">Charts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
