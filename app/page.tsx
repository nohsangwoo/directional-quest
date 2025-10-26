"use client";
import Link from "next/link";
import { useState } from "react";

const tabs = ["소개", "경력", "학력", "스킬", "링크"] as const;

type Tab = (typeof tabs)[number];

export default function Home() {
  const [active, setActive] = useState<Tab>("소개");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        {/* 헤더 영역 */}
        <section className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {/* 아바타: 이니셜 */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-zinc-200 to-zinc-100 text-lg font-semibold text-zinc-800 dark:from-zinc-800 dark:to-zinc-700 dark:text-zinc-100">
              SN
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">노상우</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">주식회사 럿지 · 개발</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/posts"
              className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-zinc-200 dark:text-black"
            >
              게시판 바로가기
            </Link>
            <Link
              href="/charts"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              차트 보기
            </Link>
          </div>
        </section>

        {/* 통계 요약 */}
        <section className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-4">
          <Stat label="팔로워" value="80" />
          <Stat label="팔로잉" value="58" />
          <Stat label="포인트" value="0P" />
        </section>

        {/* 탭 내비게이션 */}
        <section className="mt-8 border-b border-zinc-200 dark:border-zinc-800">
          <nav className="-mb-px flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={
                  `rounded-t-md px-3 py-2 text-sm font-medium ` +
                  (active === t
                    ? "border-b-2 border-black text-black dark:border-zinc-100 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200")
                }
                aria-current={active === t ? "page" : undefined}
              >
                {t}
              </button>
            ))}
          </nav>
        </section>

        {/* 탭 콘텐츠 */}
        <section className="mt-6">
          {active === "소개" && <IntroSection />}
          {active === "경력" && <ExperienceSection />}
          {active === "학력" && <EducationSection />}
          {active === "스킬" && <SkillsSection />}
          {active === "링크" && <LinksSection />}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{value}</div>
    </div>
  );
}

function IntroSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">소개</h2>
        <button className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
          편집
        </button>
      </div>
      <p className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        혁신적인 웹·앱 개발 솔루션을 제공하는 소프트웨어 전문 기업
      </p>
      <div className="flex justify-end">
        <button className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
          설정
        </button>
      </div>
    </div>
  );
}

function ExperienceSection() {
  const items = [
    { title: "주식회사 럿지", period: "2024.12 - 재직중" },
    { title: "(주)험블럼블", period: "2024.08 - 2024.08 · 1개월" },
    { title: "주식회사뮤즈블라썸", period: "2024.03 - 2024.08 · 6개월" },
    { title: "밀리", period: "2023.11 - 2024.08 · 10개월" },
    { title: "(주)뱅크클리어", period: "2023.03 - 2023.05 · 3개월" },
    { title: "(주)우리투자증권", period: "2022.09 - 2023.03 · 7개월" },
    { title: "한국전력공사 절감전력량계산 프로젝트 납품", period: "2024.11 - 2025.02 · 4개월" },
    { title: "한*전*공사", period: "2023.03 - 2024.01 · 11개월" },
    { title: "한국포스증권 주식회사", period: "2022.09 - 재직중" },
    { title: "주식회사 클라운지", period: "2021.03 - 2022.09 · 1년 7개월" },
    { title: "페어리플로스", period: "2019.02 - 2021.01 · 2년" },
    { title: "(주)비지에프", period: "2014.04 - 2014.08 · 5개월" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">경력</h2>
        <button className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
          편집
        </button>
      </div>
      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {items.map((it) => (
          <li key={`${it.title}-${it.period}`} className="bg-white p-4 dark:bg-zinc-900">
            <div className="font-medium text-zinc-900 dark:text-zinc-100">{it.title}</div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{it.period}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EducationSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">학력</h2>
        <button className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
          편집
        </button>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="font-medium text-zinc-900 dark:text-zinc-100">홍익대학교</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">컴퓨터정보통신공학과</div>
      </div>
    </div>
  );
}

function SkillsSection() {
  const skills = [
    "Android",
    "Firebase",
    "GraphQL",
    "MySQL",
    "React",
    "CSS",
    "Java",
    "JavaScript",
    "PHP",
    "Python",
    "C++",
    "HTML5",
    "PostgreSQL",
    "phpMyAdmin",
    "React.js",
    "React Native",
    "ES6",
    "Flutter",
    "SQL",
    "Docker",
    "GitHub",
    "AWS",
    "WebRTC",
    "Oracle",
    "MongoDB",
    "Lua",
    "Shell Scripting",
    "Git",
    "TypeScript",
    "HTML",
    "Next.js",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">스킬</h2>
        <button className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
          편집
        </button>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinksSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">링크</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href="https://github.com/nohsangwoo"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">GitHub</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">nohsangwoo · 80 followers · 58 following</div>
        </a>
        <Link
          href="/posts"
          className="rounded-lg border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">게시판</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">CRUD + 검색/정렬/필터/페이지네이션</div>
        </Link>
      </div>
    </div>
  );
}
