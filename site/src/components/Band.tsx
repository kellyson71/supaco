import { m, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from 'framer-motion'
import { useRef } from 'react'
import { VERDICTS, type Status } from '../lib/verdicts'

const ORDER: Status[] = ['GO', 'WARN', 'LAST', 'NO', 'REPROVADO']

function Row({ base, dark = false, active }: { base: number; dark?: boolean; active: boolean }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false })
  const skew = useTransform(velocity, [-2000, 2000], [8, -8])
  const dirRef = useRef(1)

  useAnimationFrame((_, delta) => {
    // fora da tela não gasta frame nenhum
    if (reduce || !active) return
    const b = boost.get()
    if (b < 0) dirRef.current = -1
    else if (b > 0) dirRef.current = 1
    x.set(x.get() + base * dirRef.current * (1 + Math.abs(b)) * (delta / 1000))
  })
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`)

  const items = [...ORDER, ...ORDER, ...ORDER, ...ORDER]
  return (
    <m.div className="flex w-max will-change-transform" style={{ x: tx, skewX: active ? skew : 0 }}>
      {items.map((s, i) => {
        const v = VERDICTS[s]
        return (
          <span key={i} className="flex items-center gap-4 px-4 font-display text-[clamp(2rem,7vw,4.5rem)] font-extrabold tracking-tight sm:gap-6 sm:px-6">
            <span style={{ color: dark ? v.solid : v.container }}>{v.word}</span>
            <span className="inline-block size-[0.35em] rounded-full" style={{ background: v.solid }} />
          </span>
        )
      })}
    </m.div>
  )
}

// Faixa com os cinco vereditos, que acelera com a rolagem
export function Band() {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref, { margin: '100px 0px' })
  return (
    <section ref={ref} aria-label="Os cinco vereditos do Supaco" className="relative overflow-hidden py-10 lg:py-14">
      <div className="-mx-10 -rotate-2 bg-ink py-3 sm:py-4">
        <Row base={-3} dark active={active} />
      </div>
      <div className="-mx-10 mt-2 rotate-1 py-1 opacity-80">
        <Row base={2} active={active} />
      </div>
    </section>
  )
}
