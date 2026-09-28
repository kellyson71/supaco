import { AnimatePresence, m, useReducedMotion, type MotionValue } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { Status } from '../lib/verdicts'
import { VERDICTS } from '../lib/verdicts'

const SKY_EASE = { duration: 1.4, ease: [0.4, 0, 0.2, 1] } as const

// As nuvens são texturas pré-renderizadas e já coloridas (public/assets/sky),
// uma por cor e por faixa de tela. Trocar de cor = crossfade de duas imagens
// comuns, o caso mais barato para a GPU em qualquer navegador.
type Variant = 'front' | 'far' | 'floor'

const hex = (c: string) => c.replace('#', '').toLowerCase()
const src = (variant: Variant, bp: 'sm' | 'md' | 'lg', color: string) => `./assets/sky/${variant}-${bp}-${hex(color)}.webp`

function CloudImage({ variant, color, className = '' }: { variant: Variant; color: string; className?: string }) {
  return (
    <picture className={className}>
      <source media="(min-width: 1024px)" srcSet={src(variant, 'lg', color)} />
      <source media="(min-width: 640px)" srcSet={src(variant, 'md', color)} />
      <img src={src(variant, 'sm', color)} alt="" decoding="async" draggable={false} className="size-full select-none" />
    </picture>
  )
}

// baixa as outras cores no tempo ocioso, para a troca não piscar
export function preloadClouds(colors: string[]) {
  const bp = matchMedia('(min-width: 1024px)').matches ? 'lg' : matchMedia('(min-width: 640px)').matches ? 'md' : 'sm'
  const run = () => colors.forEach((c) => (['front', 'far'] as const).forEach((v) => (new Image().src = src(v, bp, c))))
  'requestIdleCallback' in window ? requestIdleCallback(run) : setTimeout(run, 1500)
}

type CloudProps = { variant: Variant; color: string; className?: string; style?: CSSProperties; animated?: boolean }

export function CloudBank({ variant, color, className = '', style, animated = false }: CloudProps) {
  if (!animated)
    return (
      <div className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
        <CloudImage variant={variant} color={color} className="absolute inset-0 block" />
      </div>
    )
  return (
    <div className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      <AnimatePresence initial={false}>
        <m.div
          key={color}
          className="absolute inset-0 will-change-[opacity]"
          initial={{ opacity: 0, zIndex: 1 }}
          animate={{ opacity: 1, zIndex: 1, transition: SKY_EASE }}
          exit={{ opacity: 1, zIndex: 0, transition: { duration: SKY_EASE.duration } }}
        >
          <CloudImage variant={variant} color={color} className="absolute inset-0 block" />
        </m.div>
      </AnimatePresence>
    </div>
  )
}

const STARS =
  'radial-gradient(1.2px 1.2px at 12% 18%, #fff 50%, transparent), radial-gradient(1px 1px at 34% 8%, #fff 50%, transparent), radial-gradient(1.4px 1.4px at 58% 22%, #fff 50%, transparent), radial-gradient(1px 1px at 76% 12%, #fff 50%, transparent), radial-gradient(1.2px 1.2px at 88% 30%, #fff 50%, transparent), radial-gradient(1px 1px at 22% 36%, #fff 50%, transparent), radial-gradient(1px 1px at 66% 40%, #fff 50%, transparent)'

function skyBackground(status: Status) {
  const { top, mid, low, sun } = VERDICTS[status].sky
  // o "sol" é um gradiente radial na mesma camada: nada de blur ao vivo
  return `radial-gradient(60% 45% at 88% 0%, ${sun}, transparent 70%), linear-gradient(180deg, ${top} 0%, ${mid} 58%, ${low} 100%)`
}

export function Sky({ status, shift, paused = false }: { status: Status; shift?: MotionValue<number>; paused?: boolean }) {
  const reduce = useReducedMotion()
  const dark = status === 'NO' || status === 'REPROVADO'
  const t = reduce ? { duration: 0 } : SKY_EASE

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* crossfade só com opacity: o céu novo aparece por cima do anterior */}
      <AnimatePresence initial={false}>
        <m.div
          key={status}
          className="absolute inset-0 will-change-[opacity]"
          style={{ background: skyBackground(status) }}
          initial={{ opacity: 0, zIndex: 1 }}
          animate={{ opacity: 1, zIndex: 1, transition: t }}
          exit={{ opacity: 1, zIndex: 0, transition: { duration: t.duration } }}
        />
      </AnimatePresence>

      <m.div
        className="absolute inset-0 z-[2] will-change-[opacity]"
        initial={false}
        animate={{ opacity: dark ? 1 : 0 }}
        transition={t}
        style={{ backgroundImage: STARS }}
      />

      <m.div className="absolute inset-x-0 top-[12%] z-[2] h-[40%] will-change-transform" style={{ x: shift }}>
        <div className="drift absolute inset-0" style={{ '--dur': '60s' } as CSSProperties}>
          <CloudBank variant="far" className="inset-0" color={VERDICTS[status].sky.cloud} animated />
        </div>
      </m.div>

      {status === 'REPROVADO' && !reduce && !paused && (
        <m.div
          className="absolute inset-0 z-[3] bg-white will-change-[opacity]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.55, 0, 0.3, 0] }}
          transition={{ duration: 2.4, times: [0, 0.5, 0.53, 0.58, 0.62, 0.7], repeat: Infinity, repeatDelay: 1.6 }}
        />
      )}
    </div>
  )
}
