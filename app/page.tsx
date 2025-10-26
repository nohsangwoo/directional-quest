'use client'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Hero />
      <Highlights />
      <Showcase />
      <CTA />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-fuchsia-800/30 via-cyan-700/20 to-amber-700/20 dark:from-fuchsia-900/50 dark:via-cyan-900/40 dark:to-amber-900/40" />
      <WebGLBackdrop />

      <div className="mx-auto flex min-h-[72svh] w-full max-w-6xl flex-col items-center justify-center px-6 py-24 text-center sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Available for opportunities
        </span>
        <h1 className="mt-6 bg-[linear-gradient(180deg,#fff,rgba(255,255,255,.7))] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl">
          노상우 <span className="text-white/70">|</span> 프론트엔드 개발자
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-7 text-white/80 sm:text-lg">
          혁신적인 웹·앱 개발 솔루션. React/Next.js를 기반으로 사용자 경험과
          퍼포먼스를 극대화합니다.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/posts"
            className="rounded-md bg-white/90 px-5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-white"
          >
            작업 보러가기
          </Link>
          <Link
            href="/charts"
            className="rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/15"
          >
            데이터 시각화
          </Link>
          <a
            href="https://github.com/nohsangwoo"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-white/0 bg-white/0 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            GitHub
          </a>
        </div>

        <div className="mt-10 grid w-full max-w-3xl grid-cols-3 gap-3 sm:gap-4">
          <Stat label="팔로워" value="80" />
          <Stat label="팔로잉" value="58" />
          <Stat label="포인트" value="0P" />
        </div>
      </div>
    </section>
  )
}

function WebGLBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const shaders = useMemo(
    () => ({
      frag: `
      precision highp float;
      uniform vec2 u_res; // viewport resolution (pixels)
      uniform float u_time; // time (seconds)
      uniform vec2 u_mouse; // normalized mouse

      // hash & noise
      float hash(vec2 p){
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.45);
        return fract(p.x * p.y);
      }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy / u_res.xy);
        vec2 p = (uv - 0.5) * vec2(u_res.x/u_res.y, 1.0);

        // neon fog + scan waves
        float t = u_time * 0.25;
        float n = 0.0;
        n += noise(p * 1.5 + t);
        n += 0.5 * noise(p * 3.0 - t * 0.7);
        n += 0.25 * noise(p * 6.0 + t * 1.3);
        n /= 1.75;

        float grid = abs(sin((p.x + p.y * 0.5 + t) * 6.2831 * 1.5)) * 0.15;
        float scan = 0.07 * sin((uv.y + t * 1.6) * 120.0);

        // mouse parallax tint
        vec2 m = u_mouse - 0.5;
        vec3 col = vec3(0.0);
        col += vec3(0.1, 0.3, 0.9) * (n + grid);
        col += vec3(0.9, 0.1, 0.6) * (0.6 - n * 0.5);
        col += vec3(0.0, 1.0, 0.7) * (0.2 + 0.4 * length(m));
        col += scan;

        // vignette
        float v = smoothstep(1.2, 0.2, length(p));
        col *= v;

        gl_FragColor = vec4(col, 1.0);
      }
      `,
      vert: `
      attribute vec2 position;
      void main(){
        gl_Position = vec4(position, 0.0, 1.0);
      }
      `,
    }),
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      antialias: false,
      depth: false,
      stencil: false,
    })
    if (!gl) return

    // helpers
    const createShader = (type: number, source: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, source)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error('shader error', gl.getShaderInfoLog(sh))
      }
      return sh
    }
    const program = gl.createProgram()!
    const vs = createShader(gl.VERTEX_SHADER, shaders.vert)
    const fs = createShader(gl.FRAGMENT_SHADER, shaders.frag)
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    // quad
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    const vertices = new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1, // tri 1
      -1,
      1,
      1,
      -1,
      1,
      1, // tri 2
    ])
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    const positionLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    // uniforms
    const uRes = gl.getUniformLocation(program, 'u_res')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / Math.max(1, rect.width)
      mouseRef.current.y = 1 - (e.clientY - rect.top) / Math.max(1, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)

    const loop = (t: number) => {
      if (!startRef.current) startRef.current = t
      const elapsed = (t - startRef.current) / 1000
      gl.uniform1f(uTime, elapsed)
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [shaders.frag, shaders.vert])

  return (
    <div className="absolute inset-0 -z-10">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* overlay gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(255,255,255,0.4)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40 scanlines" />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 p-4 text-center text-white backdrop-blur-md">
      <div className="text-xs text-white/70">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  )
}

function Highlights() {
  const items = [
    {
      title: '성능 최적화',
      desc: 'React 19, Next.js App Router 기반으로 웹 핵심 지표 개선',
    },
    { title: '데이터 시각화', desc: 'Recharts로 요구 스펙 충족 + 상호작용' },
    {
      title: '탄탄한 API 연동',
      desc: 'axios + react-query with 토큰 인터셉트',
    },
  ]
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map(it => (
          <div
            key={it.title}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {it.title}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {it.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Showcase() {
  const chips = [
    'React',
    'Next.js',
    'TypeScript',
    'Zustand',
    'React Query',
    'Recharts',
    'WebGL',
  ]
  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          스킬 & 스택
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {chips.map(c => (
            <span
              key={c}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-fuchsia-600/20 via-cyan-600/15 to-amber-600/20" />
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            함께 멋진 것을 만들어볼까요?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            프로젝트 제안 및 협업 문의는 게시판 또는 GitHub 이슈를 통해
            남겨주세요.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/posts"
              className="rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 dark:bg-zinc-200 dark:text-black"
            >
              게시판 이동
            </Link>
            <a
              href="https://github.com/nohsangwoo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
