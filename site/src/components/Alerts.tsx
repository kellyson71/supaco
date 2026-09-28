import { m } from 'framer-motion'
import { Bell, Fingerprint, LayoutGrid, ToggleRight, Trophy, WifiOff } from 'lucide-react'
import { useRef } from 'react'
import { Logo } from './ui'

// Textos reais do FaltasNotifier.kt
const NOTIFICATIONS = [
  { title: 'Olho em Metodologia 👀', text: 'Você tem só 2 faltas livres. Administra direito.', time: 'agora' },
  { title: 'Última falta em Computador e Sociedade ⚠️', text: 'Sobrou exatamente 1 falta. Use com sabedoria.', time: '2 min' },
  { title: 'NEM PENSE em faltar Arquitetura 🚨', text: 'Zero faltas livres. Mais uma e já era.', time: '1 h' },
]

const FEATURES = [
  { icon: Bell, title: 'Avisos antes do limite', text: 'Notificação quando uma matéria entra no fio, na última falta ou no zero.' },
  { icon: LayoutGrid, title: 'Três widgets', text: 'Veredito do dia, faltas livres por matéria e a aula de agora na tela inicial.' },
  { icon: ToggleRight, title: 'Atalho no painel rápido', text: '“Posso faltar?” ao lado do Wi-Fi, sem abrir o app.' },
  { icon: WifiOff, title: 'Abre sem internet', text: 'Horários e faltas ficam salvos no celular depois da primeira sincronização.' },
  { icon: Fingerprint, title: 'Entra com a digital', text: 'A senha do SUAP fica criptografada só no seu aparelho.' },
  { icon: Trophy, title: 'Conquistas e ranking', text: 'De “CDF em Negação” a “Lenda da Vagabundagem”.' },
]

const STICKERS = [
  { src: './assets/mascots/tranquilo.webp', label: 'PODE FALTAR', color: '#6FE39B', rotate: -7, pos: 'left-0 top-4 lg:-left-[4%] lg:top-[2%]' },
  { src: './assets/mascots/mais_ou_menos.webp', label: 'ÚLTIMA BALA', color: '#FFA968', rotate: 6, pos: 'right-0 top-16 lg:-right-[6%] lg:top-[40%]' },
  { src: './assets/mascots/perigo.webp', label: 'NEM PENSE', color: '#FFB4AB', rotate: -4, pos: 'right-[8%] bottom-2 lg:right-auto lg:left-[2%] lg:bottom-0' },
]

export function Alerts() {
  const area = useRef<HTMLDivElement>(null)

  return (
    <section id="avisos" className="relative overflow-hidden pb-24 lg:pb-36">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        {/* painel de notificações + figurinhas arrastáveis */}
        <div ref={area} className="relative order-2 pb-44 pt-48 lg:order-1 lg:py-28">
          <m.div
            className="relative z-10 mx-auto max-w-[360px] rounded-[32px] bg-ink p-3 shadow-[0_40px_80px_-30px_rgb(18_19_24/0.6)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-3 pb-3 pt-2 text-white">
              <span className="font-display text-2xl font-medium tracking-tight">14:12</span>
              <span className="text-xs text-white/50">qua, 17 de set.</span>
            </div>
            <ul className="space-y-2">
              {NOTIFICATIONS.map((n, i) => (
                <m.li
                  key={n.title}
                  className="rounded-[22px] bg-ink-3 p-3.5 text-white"
                  initial={{ opacity: 0, y: -24, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.4 + i * 0.55 }}
                >
                  <div className="flex items-center gap-2 text-[11px] text-white/55">
                    <Logo className="size-4" />
                    Supaco · {n.time}
                  </div>
                  <div className="mt-1.5 text-[14px] font-semibold leading-snug">{n.title}</div>
                  <div className="text-[13px] leading-snug text-white/70">{n.text}</div>
                </m.li>
              ))}
            </ul>
          </m.div>

          {STICKERS.map((s, i) => (
            <m.figure
              key={s.label}
              drag
              dragConstraints={area}
              dragElastic={0.2}
              whileDrag={{ scale: 1.08, rotate: 0, zIndex: 30 }}
              whileHover={{ scale: 1.04 }}
              className={`absolute z-20 w-[150px] cursor-grab touch-none rounded-2xl bg-white p-2 pb-2.5 shadow-[0_18px_40px_-14px_rgb(18_19_24/0.45)] active:cursor-grabbing sm:w-[170px] ${s.pos}`}
              initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
              whileInView={{ opacity: 1, scale: 1, rotate: s.rotate }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 + i * 0.25 }}
            >
              <img src={s.src} alt="" loading="lazy" decoding="async" draggable={false} className="aspect-[4/3] w-full rounded-xl object-cover" />
              <figcaption className="mt-2 flex items-center gap-1.5 px-1 font-display text-[11px] font-bold tracking-tight">
                <span className="size-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </figcaption>
            </m.figure>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <m.h2
            className="font-display text-[clamp(2rem,8vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Ele avisa antes. Do jeito dele.
          </m.h2>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-slate">
            Você não precisa lembrar de abrir o app. Quando a conta aperta, o Supaco manda notificação.
          </p>
          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <m.li
                key={f.title}
                className="flex gap-3.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-ink shadow-sm">
                  <f.icon className="size-[18px]" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold">{f.title}</h3>
                  <p className="mt-0.5 text-[14px] leading-snug text-slate">{f.text}</p>
                </div>
              </m.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
