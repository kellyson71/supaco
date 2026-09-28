import { m, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { memo, useEffect, useRef, useState, type CSSProperties } from 'react'
import { LIMITE, TOUR, VERDICTS, calcStatus } from '../lib/verdicts'
import { CloudBank, Sky, preloadClouds } from './Sky'
import { LiveHomeScreen, PhoneFrame } from './Phone'
import { ApkButton } from './ui'
import { useTilt } from '../lib/tilt'
import { isGecko } from '../lib/engine'

const ease = [0.22, 1, 0.36, 1] as const

function VerdictWord({ word }: { word: string }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <m.span key={word} className="flex whitespace-nowrap" aria-live="polite">
        {word.split('').map((ch, i) => (
          <m.span
            key={i}
            className="inline-block"
            initial={{ y: '0.9em', opacity: 0, rotateX: -80 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: '-0.7em', opacity: 0, transition: { duration: 0.18, delay: i * 0.012 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 26, delay: i * 0.028 }}
          >
            {ch === ' ' ? ' ' : ch}
          </m.span>
        ))}
      </m.span>
    </AnimatePresence>
  )
}

function VerdictPanel({ faltas, onPick }: { faltas: number; onPick: (n: number) => void }) {
  const status = calcStatus(faltas)
  const v = VERDICTS[status]
  return (
    <div className="rounded-[28px] frost border border-white/15 p-5 text-white shadow-[0_30px_60px_-25px_rgb(0_0_0/0.5)] sm:p-6">
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="font-medium text-white/85">Metodologia do Trabalho Científico</span>
        <span className="shrink-0 text-white/60">40h</span>
      </div>

      <div className="mt-4 font-display text-[clamp(1.6rem,7.4vw,2.2rem)] lg:text-[1.8rem] font-extrabold leading-none tracking-tight [perspective:600px]">
        <VerdictWord word={v.word} />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <m.p
          key={v.line}
          className="mt-3 min-h-[2.8em] text-[15px] leading-snug text-white/80"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {v.line}
        </m.p>
      </AnimatePresence>

      <div className="mt-5">
        <div className="mb-2.5 flex justify-between text-xs text-white/70">
          <span>Toque para simular suas faltas</span>
          <span className="font-mono tabular-nums text-white">
            {faltas}/{LIMITE}
          </span>
        </div>
        <div className="flex gap-1" role="group" aria-label="Número de faltas">
          {Array.from({ length: LIMITE + 2 }, (_, i) => {
            const on = i < faltas
            const over = i >= LIMITE
            return (
              <button
                key={i}
                type="button"
                onClick={() => onPick(i + 1 === faltas ? i : i + 1)}
                aria-label={`${i + 1} ${i === 0 ? 'falta' : 'faltas'}`}
                aria-pressed={on}
                className={`relative h-9 flex-1 rounded-[7px] transition-colors ${over ? 'border border-dashed border-white/35' : 'bg-white/15'}`}
              >
                <m.span
                  className="absolute inset-0 rounded-[6px]"
                  initial={false}
                  animate={{ scaleY: on ? 1 : 0.2, opacity: on ? 1 : 0, backgroundColor: v.solid }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30, delay: on ? i * 0.015 : 0 }}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Texto e botão não mudam com o veredito: memo evita re-render a cada troca
const HeroCopy = memo(function HeroCopy() {
  return (
    <div className="relative z-10 text-white">
      <m.p
        className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="size-1.5 rounded-full bg-go" />
        App Android para o SUAP do IFRN
      </m.p>

      <h1 className="mt-5 font-display text-[clamp(2.6rem,12.5vw,5.8rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
        {['Posso', 'faltar', 'hoje?'].map((w, i) => (
          <span key={w} className="block overflow-hidden pb-[0.06em]">
            <m.span
              className="block"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.09 }}
            >
              {w}
            </m.span>
          </span>
        ))}
      </h1>

      <m.p
        className="mt-5 max-w-md text-[17px] leading-relaxed text-white/85"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.45 }}
      >
        O Supaco lê suas faltas no SUAP e responde matéria por matéria, antes de você desligar o despertador.
      </m.p>

      <m.div
        className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.55 }}
      >
        <ApkButton />
        <a href="#telas" className="text-[15px] font-medium text-white/90 underline decoration-white/40 underline-offset-4 hover:decoration-white">
          Ver as telas
        </a>
      </m.div>
    </div>
  )
})

export function Hero() {
  // ?f=9 abre o hero num veredito específico
  const initial = Number(new URLSearchParams(location.search).get('f'))
  const [faltas, setFaltas] = useState(Number.isInteger(initial) && initial > 0 ? Math.min(initial, LIMITE + 2) : TOUR[0])
  const [touched, setTouched] = useState(initial > 0)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const status = calcStatus(faltas)

  // Percorre os vereditos sozinho até a pessoa interagir
  useEffect(() => {
    if (touched || reduce || !inView) return
    const id = setInterval(() => {
      setFaltas((f) => TOUR[(TOUR.indexOf(f) + 1) % TOUR.length])
    }, 3000)
    return () => clearInterval(id)
  }, [touched, reduce, inView])

  useEffect(() => {
    preloadClouds(Object.values(VERDICTS).map((v) => v.sky.cloud))
  }, [])

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', VERDICTS[status].theme)
  }, [status])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-12%'])
  const cloudsY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%'])
  const tilt = useTilt(ref, inView)
  const rotY = useTransform(tilt.x, [-1, 1], [-14, 14])
  const rotX = useTransform(tilt.y, [-1, 1], [10, -10])
  const rotZ = useTransform(tilt.x, [-1, 1], [-3, 3])
  const shiftX = useTransform(tilt.x, [-1, 1], [-10, 10])
  const cloudsX = useTransform(tilt.x, [-1, 1], [40, -40])
  const panelX = useTransform(tilt.x, [-1, 1], [-14, 14])
  const panelY = useTransform(tilt.y, [-1, 1], [-10, 10])
  const skyX = useTransform(tilt.x, [-1, 1], [-24, 24])

  const pick = (n: number) => {
    setTouched(true)
    setFaltas(n)
  }

  return (
    <section ref={ref} data-paused={!inView} className="relative overflow-hidden rounded-b-[40px] pb-40 pt-28 sm:pb-52 lg:pb-64 lg:pt-36">
      <Sky status={status} shift={skyX} paused={!inView} />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-6">
        <HeroCopy />

        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <m.div
            style={{ y: phoneY }}
            className="relative z-10 mx-auto w-[68%] max-w-[300px] will-change-transform [perspective:1200px] lg:ml-auto lg:mr-4 lg:max-w-[320px]"
            initial={{ opacity: 0, y: 260, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.6, ease, delay: 0.2 }}
          >
            <m.div style={isGecko ? { rotate: rotZ, x: shiftX } : { rotateY: rotY, rotateX: rotX, transformStyle: 'preserve-3d' }}>
              <PhoneFrame>
                <LiveHomeScreen status={status} faltas={faltas} />
              </PhoneFrame>
            </m.div>
          </m.div>

          <m.div
            className="relative z-30 -mt-[34%] w-full sm:mx-auto sm:w-[88%] lg:absolute lg:bottom-[2%] lg:-left-[6%] lg:mt-0 lg:w-[340px]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.7 }}
          >
            <m.div className="will-change-transform" style={{ x: panelX, y: panelY }}>
              <VerdictPanel faltas={faltas} onPick={pick} />
            </m.div>
          </m.div>
        </div>
      </div>

      {/* nuvens na frente do celular: tingidas pelo céu, e uma última camada da cor da página */}
      <m.div
        style={{ y: cloudsY, x: cloudsX }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-56 will-change-transform sm:h-72 lg:h-80"
      >
        <div className="drift absolute -inset-x-[10%] top-0 h-full" style={{ '--dur': '36s' } as CSSProperties}>
          <CloudBank variant="front" className="inset-0" color={VERDICTS[status].sky.cloud} animated />
        </div>
      </m.div>
      <CloudBank variant="floor" color="#eef2f8" className="-inset-x-[10%] -bottom-10 z-20 h-32 sm:h-40" />
    </section>
  )
}
