import { motion, useReducedMotion, type MotionValue } from 'framer-motion'
import type { CSSProperties } from 'react'
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

export function CloudBank({ puffs = FRONT, className = '', style }: { puffs?: Puff[]; className?: string; style?: CSSProperties }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      {puffs.map((p, i) => (
        <div
          key={i}
          className="puff"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%`, opacity: p.o ?? 1 }}
        />
      ))}
    </div>
  )
}

export function Sky({ status, shift }: { status: Status; shift?: MotionValue<number> }) {
  const v = VERDICTS[status]
  const reduce = useReducedMotion()
  const dark = status === 'NO' || status === 'REPROVADO'
  const t = reduce ? { duration: 0 } : SKY_EASE

  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ '--top': v.sky.top, '--mid': v.sky.mid, '--low': v.sky.low } as never}
      transition={t}
      style={{ background: 'linear-gradient(180deg, var(--top) 0%, var(--mid) 58%, var(--low) 100%)' }}
      aria-hidden
    >
      {/* sol / brilho */}
      <motion.div
        className="absolute -right-[20%] -top-[18%] aspect-square w-[90%] rounded-full mix-blend-screen blur-3xl lg:w-[55%] lg:-right-[5%]"
        initial={false}
        animate={{ backgroundColor: v.sky.sun }}
        transition={t}
      />

      {/* estrelas quando escurece */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: dark ? 1 : 0 }}
        transition={t}
        style={{
          backgroundImage:
            'radial-gradient(1.2px 1.2px at 12% 18%, #fff 50%, transparent), radial-gradient(1px 1px at 34% 8%, #fff 50%, transparent), radial-gradient(1.4px 1.4px at 58% 22%, #fff 50%, transparent), radial-gradient(1px 1px at 76% 12%, #fff 50%, transparent), radial-gradient(1.2px 1.2px at 88% 30%, #fff 50%, transparent), radial-gradient(1px 1px at 22% 36%, #fff 50%, transparent), radial-gradient(1px 1px at 66% 40%, #fff 50%, transparent)',
        }}
      />

      {/* nuvens distantes */}
      <motion.div
        className="absolute inset-x-0 top-[12%] h-[40%]"
        style={{ x: shift }}
        initial={false}
        animate={{ '--cloud': v.sky.cloud } as never}
        transition={t}
      >
        <div className="drift absolute inset-0" style={{ '--dur': '60s' } as CSSProperties}>
          <CloudBank puffs={FAR} className="inset-0" />
        </div>
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
    </motion.div>
  )
}
