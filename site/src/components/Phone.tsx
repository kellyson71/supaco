import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { LIMITE, VERDICTS, type Status } from '../lib/verdicts'

export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[13%/6%] bg-[#0b0c10] p-[3.2%] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6),inset_0_0_0_1.5px_rgb(255_255_255/0.12)] ${className}`}
    >
      <div className="screen relative aspect-[9/20] overflow-hidden rounded-[10.5%/4.8%] bg-ink">{children}</div>
      <div className="absolute left-1/2 top-[2.4%] size-[3.4%] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
    </div>
  )
}

// Recria o card "Próxima aula" da tela Início por cima do screenshot,
// para o veredito mudar junto com o céu.
export function LiveHomeScreen({ status, faltas }: { status: Status; faltas: number }) {
  const v = VERDICTS[status]
  const livres = Math.max(0, LIMITE - faltas)
  const sub = status === 'REPROVADO' ? `${faltas - LIMITE} acima do limite` : `${livres} ${livres === 1 ? 'falta livre' : 'faltas livres'}`

  return (
    <>
      <img src="./assets/mobile/home.webp" alt="Tela inicial do Supaco" className="absolute inset-0 size-full object-cover" />
      <motion.div
        className="absolute left-[4.45%] top-[14.25%] flex h-[21.1%] w-[91.1%] flex-col justify-between rounded-[4.4cqw] p-[5.4cqw]"
        initial={false}
        animate={{ backgroundColor: v.container, color: v.onContainer }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-start gap-[4cqw]">
          <motion.div
            className="grid size-[13cqw] shrink-0 place-items-center"
            initial={false}
            animate={{ backgroundColor: v.solid, rotate: faltas * 36 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            style={{ clipPath: 'polygon(50% 0,61% 13%,78% 8%,80% 25%,96% 32%,88% 48%,98% 63%,82% 71%,80% 89%,63% 86%,50% 100%,37% 86%,20% 89%,18% 71%,2% 63%,12% 48%,4% 32%,20% 25%,22% 8%,39% 13%)', opacity: 0.55 }}
          />
          <div className="min-w-0 leading-[1.25]">
            <div className="text-[3.1cqw] opacity-75">Próxima aula</div>
            <div className="text-[3.8cqw] font-semibold">Metodologia do Trabalho Científico</div>
            <div className="text-[3.1cqw] opacity-75">Qua · 14:50–16:20</div>
          </div>
        </div>
        <div className="flex items-end justify-between gap-[2cqw]">
          <div className="min-w-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={v.word}
                className="whitespace-nowrap text-[6.6cqw] font-extrabold leading-none tracking-tight"
                style={{ color: v.solid }}
                initial={{ y: '60%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-60%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                {v.word}
              </motion.div>
            </AnimatePresence>
            <div className="mt-[1cqw] text-[3.1cqw] opacity-80">{sub}</div>
          </div>
          <motion.div
            className="flex shrink-0 items-center gap-[1.6cqw] rounded-full px-[4cqw] py-[3cqw] text-[3.4cqw] font-semibold"
            initial={false}
            animate={{ backgroundColor: v.solid, color: v.container }}
          >
            <svg viewBox="0 0 24 24" className="size-[4cqw]" fill="currentColor" aria-hidden>
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M7.5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
            </svg>
            Posso faltar?
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
