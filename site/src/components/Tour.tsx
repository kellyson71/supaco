import { m, AnimatePresence, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { PhoneFrame } from './Phone'
import { isGecko } from '../lib/engine'

// Coordenadas em px dos screenshots originais (720 × 1600)
type Box = [number, number, number, number]
type Step = {
  tab: string
  title: string
  text: string
  src: string
  glow: string
  tilt: number
  callouts: { box: Box; label: string; side?: 'top' | 'bottom' }[]
  widgets?: boolean
}

const STEPS: Step[] = [
  {
    tab: 'Início',
    title: 'O veredito vem primeiro.',
    text: 'Abriu o app, a próxima aula e o “posso faltar?” já estão na tela. Sem menu, sem procurar.',
    src: './assets/mobile/home.webp',
    glow: '#F2C84B',
    tilt: -8,
    callouts: [
      { box: [32, 228, 688, 565], label: 'Veredito do dia' },
      { box: [32, 650, 688, 762], label: 'Sua semana', side: 'bottom' },
    ],
  },
  {
    tab: 'Matérias',
    title: 'Cada matéria com seu saldo.',
    text: 'Frequência, faltas usadas e quantas ainda sobram. Um toque filtra só as que estão no fio.',
    src: './assets/mobile/materias.webp',
    glow: '#6FE39B',
    tilt: 7,
    callouts: [
      { box: [32, 220, 688, 300], label: 'No fio · Folgadas', side: 'bottom' },
      { box: [566, 376, 660, 462], label: '12 livres' },
    ],
  },
  {
    tab: 'Widgets',
    title: 'Nem precisa abrir.',
    text: 'Três widgets na tela inicial: a aula de agora, o saldo de cada matéria e o veredito em uma palavra.',
    src: './assets/mobile/widgets-base.webp',
    glow: '#8FB0FF',
    tilt: -6,
    callouts: [],
    widgets: true,
  },
  {
    tab: 'Eu, o réu',
    title: 'Suas faltas viram estatística.',
    text: 'Total de faltas, faltas no cofre, streaks e um ranking que vai de CDF em Negação a Lenda da Vagabundagem.',
    src: './assets/mobile/perfil.webp',
    glow: '#E7A6FF',
    tilt: 8,
    callouts: [
      { box: [232, 314, 482, 360], label: 'Seu ranking' },
      { box: [372, 636, 688, 874], label: 'Faltas no cofre', side: 'bottom' },
    ],
  },
  {
    tab: 'Ajustes',
    title: 'Do seu jeito, e trancado.',
    text: 'Material You, tema claro ou escuro, bloqueio por biometria e alertas quando uma matéria fica perigosa.',
    src: './assets/mobile/configuracoes.webp',
    glow: '#6FE39B',
    tilt: -5,
    callouts: [
      { box: [32, 976, 688, 1132], label: 'Biometria' },
      { box: [32, 1240, 688, 1400], label: 'Alertas de perigo', side: 'bottom' },
    ],
  },
]

const WIDGETS: { src: string; box: Box }[] = [
  { src: './assets/mobile/widget-1.webp', box: [16, 84, 704, 420] },
  { src: './assets/mobile/widget-2.webp', box: [16, 452, 704, 790] },
  { src: './assets/mobile/widget-3.webp', box: [16, 822, 344, 1158] },
]

const pct = ([x1, y1, x2, y2]: Box) => ({
  left: `${(x1 / 720) * 100}%`,
  top: `${(y1 / 1600) * 100}%`,
  width: `${((x2 - x1) / 720) * 100}%`,
  height: `${((y2 - y1) / 1600) * 100}%`,
})

function Screen({ step, dir }: { step: Step; dir: number }) {
  return (
    <m.div
      className="absolute inset-0 will-change-transform"
      custom={dir}
      variants={{
        enter: (d: number) => ({ y: d > 0 ? '100%' : '-30%', scale: d > 0 ? 1 : 0.94 }),
        show: { y: 0, scale: 1, zIndex: 2 },
        exit: (d: number) => ({ y: d > 0 ? '-30%' : '100%', scale: d > 0 ? 0.94 : 1, zIndex: d > 0 ? 1 : 3 }),
      }}
      initial="enter"
      animate="show"
      exit="exit"
      transition={{ type: 'spring', stiffness: 170, damping: 26 }}
    >
      <img src={step.src} alt={`Tela ${step.tab} do Supaco`} className="absolute inset-0 size-full object-cover" decoding="async" />
      {/* escurece a tela que sai/entra só com opacity (filter animado custa caro no celular) */}
      <m.div
        className="pointer-events-none absolute inset-0 z-10 bg-black will-change-[opacity]"
        variants={{ enter: { opacity: 0.5 }, show: { opacity: 0 }, exit: { opacity: 0.5 } }}
      />

      {step.widgets &&
        WIDGETS.map((w, i) => (
          <m.img
            key={w.src}
            src={w.src}
            alt=""
            className="absolute rounded-[5cqw] shadow-[0_12px_30px_-8px_rgb(0_0_0/0.6)]"
            style={pct(w.box)}
            initial={{ opacity: 0, scale: 0.6, y: 60, rotate: i % 2 ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.35 + i * 0.22 }}
          />
        ))}

      {step.callouts.map((c, i) => (
        <m.div
          key={c.label}
          className="absolute rounded-[3.5cqw] ring-[0.7cqw] ring-warn"
          style={pct(c.box)}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.45 + i * 0.25 }}
        >
          <span
            className={`absolute right-[2cqw] whitespace-nowrap rounded-full bg-warn px-[2.8cqw] py-[1.2cqw] text-[3.4cqw] font-bold text-ink ${
              c.side === 'bottom' ? 'top-full mt-[1.6cqw]' : 'bottom-full mb-[1.6cqw]'
            }`}
          >
            {c.label}
          </span>
        </m.div>
      ))}
    </m.div>
  )
}

function Progress({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const n = STEPS.length
  const scaleX = useTransform(progress, [i / n, (i + 1) / n], [0, 1])
  return (
    <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
      <m.span className="absolute inset-0 origin-left rounded-full bg-ink will-change-transform" style={{ scaleX }} />
    </span>
  )
}

export function Tour() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [[index, dir], setIndex] = useState<[number, number]>([0, 1])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const near = useInView(ref, { once: true, margin: '800px 0px' })

  // decodifica as telas antes: a troca não engasga no celular
  useEffect(() => {
    if (!near) return
    for (const src of [...STEPS.map((s) => s.src), ...WIDGETS.map((w) => w.src)]) {
      const img = new Image()
      img.src = src
      img.decode?.().catch(() => {})
    }
  }, [near])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length)))
    if (next !== index) setIndex([next, next > index ? 1 : -1])
  })

  const step = STEPS[index]
  const goTo = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.offsetTop + (el.offsetHeight - innerHeight) * ((i + 0.5) / STEPS.length)
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="telas" ref={ref} className="relative" style={{ height: `${STEPS.length * 90}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-20 lg:pt-0">
        <div className="mx-auto grid w-full max-w-6xl flex-1 grid-rows-[1fr_auto] gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:grid-rows-1 lg:items-center lg:gap-10">
          {/* celular */}
          <div className="relative flex min-h-0 items-center justify-center lg:order-2 lg:h-[min(660px,82svh)]">
            <AnimatePresence initial={false}>
              <m.div
                key={step.tab}
                className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden font-display text-[26vw] font-extrabold leading-none tracking-tighter text-ink/[0.045] lg:text-[11vw]"
                initial={{ opacity: 0, y: dir * 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir * -60 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden
              >
                <span className="whitespace-nowrap">{step.tab}</span>
              </m.div>
            </AnimatePresence>
            <AnimatePresence initial={false}>
              <m.div
                key={step.glow + step.tab}
                className="absolute aspect-square w-[90%] max-w-[560px] rounded-full will-change-[opacity]"
                style={{ background: `radial-gradient(closest-side, ${step.glow}80, ${step.glow}00)` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
            <m.div
              className="relative h-full max-h-[640px] max-w-full [perspective:1400px]"
              style={{ aspectRatio: '125 / 268' }}
              animate={reduce ? {} : isGecko ? { rotate: step.tilt / 4 } : { rotateY: step.tilt, rotateZ: step.tilt / 6 }}
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            >
              <PhoneFrame className="h-full">
                <AnimatePresence initial={false} custom={dir}>
                  <Screen key={step.tab} step={step} dir={dir} />
                </AnimatePresence>
              </PhoneFrame>
            </m.div>
          </div>

          {/* texto */}
          <div className="pb-6 lg:order-1 lg:pb-0">
            <p className="hidden text-sm font-medium text-slate lg:block">Um passeio pelas telas reais do app</p>
            <div className="flex gap-1.5 lg:mt-5">
              {STEPS.map((s, i) => (
                <Progress key={s.tab} progress={scrollYProgress} i={i} />
              ))}
            </div>
            <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto lg:mt-4 lg:flex-wrap">
              {STEPS.map((s, i) => (
                <button
                  key={s.tab}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    i === index ? 'bg-ink text-white' : 'text-slate hover:bg-ink/5'
                  }`}
                >
                  {s.tab}
                </button>
              ))}
            </div>
            <div className="relative mt-4 min-h-[8.5rem] lg:mt-8 lg:min-h-[16rem]">
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <m.div
                  key={step.tab}
                  initial={{ opacity: 0, y: dir * 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: dir * -24 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-display text-[clamp(1.5rem,6.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.03em]">{step.title}</h2>
                  <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-slate lg:mt-5 lg:text-[17px]">{step.text}</p>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
