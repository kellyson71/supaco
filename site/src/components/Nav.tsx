import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { ApkButton, Logo } from './ui'

const LINKS = [
  { href: '#telas', label: 'Telas' },
  { href: '#avisos', label: 'Avisos' },
  { href: '#ecossistema', label: 'CLI, Web e Python' },
  { href: '#instalar', label: 'Instalar' },
]

export function Nav() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 40))

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-2 pr-2 text-white transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          solid ? 'bg-ink/80 shadow-lg shadow-black/10 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <a href="#" className="flex items-center gap-2.5 pl-1 font-display text-[15px] font-bold tracking-tight">
          <Logo className="size-8" />
          supaco
        </a>
        <ul className="hidden items-center gap-1 text-sm text-white/80 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 transition-colors hover:bg-white/10 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ApkButton size="sm" />
      </nav>
    </motion.header>
  )
}
