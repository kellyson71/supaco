import { AnimatePresence, motion, useReducedMotion, type MotionValue, type Transition } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Status } from '../lib/verdicts'
import { VERDICTS } from '../lib/verdicts'

const SKY_EASE = { duration: 1.4, ease: [0.4, 0, 0.2, 1] } as const

// Filtro SVG que dá borda orgânica às "nuvens" (círculos borrados)
export function CloudFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <filter id="cloud-edge" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="80" />
        <feGaussianBlur stdDeviation="10" />
      </filter>
    </svg>
  )
}

type Puff = { x: number; y: number; w: number; h: number; o?: number }

// Coordenadas em % da largura do banco de nuvens
const FRONT: Puff[] = [
  { x: -8, y: 38, w: 34, h: 70 },
  { x: 14, y: 50, w: 30, h: 60 },
  { x: 32, y: 30, w: 34, h: 80 },
  { x: 55, y: 46, w: 30, h: 64 },
  { x: 72, y: 26, w: 38, h: 84 },
  { x: -4, y: 70, w: 110, h: 60 },
]

const FAR: Puff[] = [
  { x: 4, y: 10, w: 22, h: 26, o: 0.7 },
  { x: 62, y: 22, w: 26, h: 22, o: 0.55 },
  { x: 30, y: 36, w: 16, h: 14, o: 0.45 },
]

// Borda de nuvens na cor da página, que funde uma seção com a seguinte
const EDGE: Puff[] = [
  { x: 0, y: 30, w: 30, h: 90 },
  { x: 24, y: 45, w: 34, h: 80 },
  { x: 52, y: 25, w: 30, h: 100 },
  { x: 76, y: 40, w: 30, h: 90 },
  { x: -5, y: 70, w: 110, h: 80 },
]

function CloudBank({ puffs, color, className }: { puffs: Puff[]; color: string; className: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      {puffs.map((p, i) => (
        <div
          key={i}
          className="puff"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%`, opacity: p.o ?? 1, background: color }}
        />
      ))}
    </div>
  )
}

export function EdgeClouds({ className }: { className: string }) {
  return <CloudBank puffs={EDGE} color="var(--color-cloud)" className={className} />
}

// Troca de cor sem repintar a cada frame: cada cor vira uma camada própria,
// rasterizada uma vez só, e a transição anima apenas a opacidade (compositor).
// Com plus-lighter as camadas somam exatamente 100%, sem clarão nem buraco no meio,
// mas só porque todas têm a mesma forma: aqui muda a cor, nunca a geometria.
function ColorCrossfade({ id, transition, className, children }: { id: string; transition: Transition; className: string; children: ReactNode }) {
  return (
    <div className={`isolate ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={id}
          className="absolute inset-0"
          style={{ mixBlendMode: 'plus-lighter', willChange: 'opacity' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function useSkyTransition(): Transition {
  return useReducedMotion() ? { duration: 0 } : SKY_EASE
}

// Banco de nuvens à deriva, tingido pela cor do céu do veredito
export function SkyClouds({ status, puffs = FRONT, duration, className }: { status: Status; puffs?: Puff[]; duration: number; className: string }) {
  return (
    <div className={`drift absolute ${className}`} style={{ animationDuration: `${duration}s` }}>
      <ColorCrossfade id={status} transition={useSkyTransition()} className="absolute inset-0">
        <CloudBank puffs={puffs} color={VERDICTS[status].sky.cloud} className="inset-0" />
      </ColorCrossfade>
    </div>
  )
}

export function Sky({ status, shift }: { status: Status; shift?: MotionValue<number> }) {
  const v = VERDICTS[status]
  const reduce = useReducedMotion()
  const dark = status === 'NO' || status === 'REPROVADO'
  const t = useSkyTransition()

  return (
    <div className="absolute inset-0" aria-hidden>
      <ColorCrossfade id={status} transition={t} className="absolute inset-0">
        <div className="size-full" style={{ background: `linear-gradient(180deg, ${v.sky.top} 0%, ${v.sky.mid} 58%, ${v.sky.low} 100%)` }} />
      </ColorCrossfade>

      {/* sol / brilho */}
      <ColorCrossfade
        id={status}
        transition={t}
        className="absolute -right-[20%] -top-[18%] aspect-square w-[90%] mix-blend-screen lg:w-[55%] lg:-right-[5%]"
      >
        <div className="size-full rounded-full blur-3xl" style={{ backgroundColor: v.sky.sun }} />
      </ColorCrossfade>

      {/* estrelas quando escurece */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: dark ? 1 : 0 }}
        transition={t}
        style={{
          willChange: 'opacity',
          backgroundImage:
            'radial-gradient(1.2px 1.2px at 12% 18%, #fff 50%, transparent), radial-gradient(1px 1px at 34% 8%, #fff 50%, transparent), radial-gradient(1.4px 1.4px at 58% 22%, #fff 50%, transparent), radial-gradient(1px 1px at 76% 12%, #fff 50%, transparent), radial-gradient(1.2px 1.2px at 88% 30%, #fff 50%, transparent), radial-gradient(1px 1px at 22% 36%, #fff 50%, transparent), radial-gradient(1px 1px at 66% 40%, #fff 50%, transparent)',
        }}
      />

      {/* nuvens distantes */}
      <motion.div className="absolute inset-x-0 top-[12%] h-[40%]" style={{ x: shift }}>
        <SkyClouds status={status} puffs={FAR} duration={60} className="inset-0" />
      </motion.div>

      {/* relâmpago */}
      {status === 'REPROVADO' && !reduce && (
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.55, 0, 0.3, 0] }}
          transition={{ duration: 2.4, times: [0, 0.5, 0.53, 0.58, 0.62, 0.7], repeat: Infinity, repeatDelay: 1.6 }}
        />
      )}

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence baseFrequency=%22.9%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%22.06%22/></svg>')]" />
    </div>
  )
}
