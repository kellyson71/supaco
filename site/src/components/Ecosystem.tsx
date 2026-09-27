import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CopyChip, GithubIcon } from './ui'

const ease = [0.22, 1, 0.36, 1] as const

/* ───────── CLI: digita o comando e "liga" os prints reais do TUI ───────── */

const CLI_SCREENS = [
  { src: './assets/cli/splash.png', alt: 'Tela de abertura do Supaco CLI com o banner e os dados do curso' },
  { src: './assets/cli/menu.png', alt: 'Menu do Supaco CLI com as aulas de hoje e a frequência' },
]

function Terminal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reduce = useReducedMotion()
  const cmd = 'supaco'
  const [typed, setTyped] = useState(reduce ? cmd.length : 0)
  const [screen, setScreen] = useState(reduce ? 0 : -1)

  useEffect(() => {
    if (!inView || reduce) return
    const timeouts: number[] = []
    setTyped(0)
    setScreen(-1)
    let t = 250
    for (let i = 1; i <= cmd.length; i++) timeouts.push(window.setTimeout(() => setTyped(i), (t += 110)))
    timeouts.push(window.setTimeout(() => setScreen(0), (t += 500)))
    const cycle = window.setInterval(() => setScreen((s) => (s + 1) % CLI_SCREENS.length), 3800)
    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(cycle)
    }
  }, [inView, reduce])

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl bg-[#0e0e0e] ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-3 font-mono text-[11px] text-white/35">~ supaco</span>
      </div>
      <div className="relative aspect-[1100/480] font-mono text-[12px] text-white/85 sm:text-[13px]">
        <div className="absolute left-4 top-3">
          <span className="text-go">❯ </span>
          {cmd.slice(0, typed)}
          {screen < 0 && <span className="caret">▍</span>}
        </div>
        <AnimatePresence mode="wait">
          {screen >= 0 && (
            <motion.img
              key={screen}
              src={CLI_SCREENS[screen].src}
              alt={CLI_SCREENS[screen].alt}
              className="crt-in absolute inset-x-0 bottom-0 top-9 h-[calc(100%-2.25rem)] w-full object-contain object-left-top px-2"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            />
          )}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(255_255_255/0.025)_0_1px,transparent_1px_3px)]" />
      </div>
    </div>
  )
}

/* ───────── Web: navegador alternando telas reais ───────── */

const WEB_SCREENS = [
  { src: './assets/web/login.webp', url: 'supaco.vercel.app', label: 'Entrada' },
  { src: './assets/web/home.webp', url: 'supaco.vercel.app/inicio', label: 'Painel' },
  { src: './assets/web/faltas.webp', url: 'supaco.vercel.app/faltas', label: 'Faltas' },
  { src: './assets/web/classroom.webp', url: 'supaco.vercel.app/classroom', label: 'Sala de Aula' },
]

function Browser() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const id = setInterval(() => setI((n) => (n + 1) % WEB_SCREENS.length), 3200)
    return () => clearInterval(id)
  }, [inView, reduce, i])

  const s = WEB_SCREENS[i]
  return (
    <div ref={ref}>
      <div className="relative overflow-hidden rounded-xl bg-[#0a0b0e] ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-2 flex-1 truncate rounded-md bg-white/[0.06] px-2 py-0.5 text-center font-mono text-[10px] text-white/45">
            {s.url}
          </span>
        </div>
        <div className="relative aspect-[1918/1038] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.img
              key={s.src}
              src={s.src}
              alt={`Supaco Web: ${s.label}`}
              loading="lazy"
              className="absolute inset-0 size-full object-cover object-top"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease }}
            />
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Telas do Supaco Web">
        {WEB_SCREENS.map((w, n) => (
          <button
            key={w.label}
            type="button"
            role="tab"
            aria-selected={n === i}
            onClick={() => setI(n)}
            className={`relative rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              n === i ? 'text-ink' : 'bg-white/[0.06] text-white/60 hover:text-white'
            }`}
          >
            {n === i && <motion.span layoutId="web-tab" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span className="relative">{w.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ───────── base ───────── */

function ProductCard({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.article
      className={`relative overflow-hidden rounded-[32px] bg-ink-2 p-5 ring-1 ring-white/[0.06] sm:p-7 ${className}`}
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.article>
  )
}

function Head({ kicker, title, text, repo }: { kicker: ReactNode; title: ReactNode; text: string; repo: string }) {
  return (
    <header>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-mono text-[12px] text-white/45">{kicker}</span>
        <a
          href={repo}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/70 transition-colors hover:bg-white/15 hover:text-white"
          aria-label="Código no GitHub"
        >
          <GithubIcon />
        </a>
      </div>
      <div className="mt-3">{title}</div>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/60">{text}</p>
    </header>
  )
}

const Title = ({ children }: { children: ReactNode }) => (
  <h3 className="font-display text-[1.7rem] font-bold tracking-tight sm:text-[2rem]">{children}</h3>
)

const PY = [
  ['k', 'from'], [' ', ' suapy '], ['k', 'import'], [' ', ' Suap\n\n'],
  ['k', 'with'], [' ', ' Suap() '], ['k', 'as'], [' ', ' suap:\n'],
  [' ', '    suap.login(matricula, senha)\n'],
  [' ', '    boletim = suap.ensino.obter_boletim('], ['n', '2026'], [' ', ', '], ['n', '1'], [' ', ')\n'],
  [' ', '    '], ['k', 'for'], [' ', ' d '], ['k', 'in'], [' ', ' suap.iterar_resultados(boletim):\n'],
  [' ', '        print(d['], ['s', '"disciplina"'], [' ', '], d['], ['s', '"numero_faltas"'], [' ', '])'],
] as const

function PythonCode() {
  const ref = useRef<HTMLPreElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  return (
    <pre ref={ref} className="no-scrollbar overflow-x-auto rounded-xl bg-[#0a0b0e] p-4 font-mono text-[11.5px] leading-[1.7] text-white/80 ring-1 ring-white/10 sm:text-[12.5px]">
      {PY.map(([kind, t], i) => (
        <motion.span
          key={i}
          className={kind === 'k' ? 'text-[#c4a7ff]' : kind === 's' ? 'text-go' : kind === 'n' ? 'text-warn' : ''}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.01, delay: i * 0.06 }}
        >
          {t}
        </motion.span>
      ))}
    </pre>
  )
}

export function Ecosystem() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const radius = useTransform(scrollYProgress, [0, 1], [120, 40])
  const inset = useTransform(scrollYProgress, [0, 1], ['4%', '0%'])

  return (
    <motion.section
      id="ecossistema"
      ref={ref}
      className="relative bg-ink py-20 text-white lg:py-32"
      style={{ borderRadius: radius, marginInline: inset }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-[clamp(2rem,8vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
            Também no terminal, no navegador e no Python.
          </h2>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-white/60">
            O mesmo SUAP, do jeito que cada um prefere. Todos são abertos e falam direto com a API do IFRN.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2 lg:gap-5">
          <ProductCard className="lg:col-span-2 lg:grid lg:grid-cols-[0.75fr_1fr] lg:items-center lg:gap-10">
            <div>
              <Head
                kicker="Go · Bubble Tea"
                title={<Title>Supaco CLI</Title>}
                text="Aulas de hoje, grade da semana, frequência, notas e notificações sem sair do terminal."
                repo="https://github.com/kellyson71/supaco-cli"
              />
              <div className="mt-6 space-y-2">
                <CopyChip text="yay -S supaco-cli" />
                <CopyChip text="go install github.com/kellyson71/supaco-cli@latest" />
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <Terminal />
            </div>
          </ProductCard>

          <ProductCard>
            <Head
              kicker="React · Electron"
              title={<Title>Supaco Web</Title>}
              text="Painel no navegador ou como app desktop, com um assistente Gemini que conhece suas notas e o Google Sala de Aula."
              repo="https://github.com/kellyson71/electron_supaco_IFRN-API"
            />
            <a
              href="https://supaco.vercel.app/"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Abrir supaco.vercel.app <ArrowUpRight className="size-4" />
            </a>
            <div className="relative mt-8">
              <Browser />
              <motion.img
                src="./assets/web/ia-chat.webp"
                alt="Assistente Gemini respondendo sobre faltas"
                loading="lazy"
                className="pointer-events-none absolute -right-2 top-[42%] w-[42%] rounded-xl shadow-[0_24px_40px_-10px_rgb(0_0_0/0.8)] ring-1 ring-white/10 sm:-right-4"
                initial={{ opacity: 0, x: 40, rotate: 8 }}
                whileInView={{ opacity: 1, x: 0, rotate: 2 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.4 }}
              />
            </div>
          </ProductCard>

          <ProductCard delay={0.1}>
            <Head
              kicker={
                <>
                  <img src="./assets/brand/python.svg" alt="" className="size-4" /> Python 3.10+
                </>
              }
              title={
                <h3 className="inline-flex rounded-2xl bg-white px-4 py-2.5">
                  <img src="./assets/suapy/suapy-wordmark.webp" alt="SuaPy" className="h-10 w-auto sm:h-12" />
                </h3>
              }
              text="Consulte boletim, faltas, horários e avaliações com métodos em português, ou exporte tudo para CSV, JSON e Pandas."
              repo="https://github.com/kellyson71/suapy"
            />
            <div className="mt-5 flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <CopyChip text="pip install suapy" />
              </div>
              <motion.img
                src="./assets/brand/python.svg"
                alt="Python"
                className="size-11 shrink-0 rounded-xl bg-white/[0.06] p-2"
                whileHover={{ rotate: 180 }}
                whileTap={{ rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              />
            </div>
            <div className="mt-4">
              <PythonCode />
            </div>
            <a href="https://kellyson71.github.io/suapy/" className="group relative mt-5 block overflow-hidden rounded-xl ring-1 ring-white/10">
              <img src="./assets/suapy/docs.webp" alt="Documentação do SuaPy" loading="lazy" className="aspect-[16/7] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white">
                Ler a documentação <ArrowUpRight className="size-3.5" />
              </span>
            </a>
          </ProductCard>
        </div>
      </div>
    </motion.section>
  )
}
