import { m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { RELEASES_URL, REPO, useRelease } from '../lib/release'
import { VERDICTS } from '../lib/verdicts'
import { CloudBank } from './Sky'
import { ApkButton, GithubIcon, Logo } from './ui'

const STEPS = [
  { title: 'Baixe o APK', text: 'Toque no botão acima pelo celular. São uns 17 MB.' },
  { title: 'Permita a instalação', text: 'O Android pede para liberar “fontes desconhecidas” para o navegador. É o aviso padrão fora da Play Store.' },
  { title: 'Entre com o SUAP', text: 'Use sua matrícula e senha do IFRN. O app sincroniza e já mostra o veredito.' },
]

const TRUST = [
  'Código aberto no GitHub',
  'APK assinado com a mesma chave em toda versão',
  'Fala só com suap.ifrn.edu.br, por HTTPS',
  'Sem anúncios, rastreadores ou analytics',
]

function Qr() {
  const { apkUrl } = useRelease()
  const [svg, setSvg] = useState('')
  useEffect(() => {
    // a lib de QR só é baixada no desktop, onde o card aparece
    if (!matchMedia('(min-width: 1024px)').matches) return
    import('qrcode')
      .then((QRCode) => QRCode.toString(apkUrl, { type: 'svg', margin: 0, color: { dark: '#121318', light: '#0000' } }))
      .then(setSvg)
  }, [apkUrl])
  return <div className="size-full [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
}

export function Download() {
  const go = VERDICTS.GO.sky
  const { version, sizeMb } = useRelease()
  return (
    <section
      id="instalar"
      className="relative mt-4 overflow-hidden pb-16 pt-28 text-white lg:pt-36"
      style={{ background: `linear-gradient(180deg, #eef2f8 0%, ${go.low} 12%, ${go.mid} 45%, ${go.top} 100%)` }}
    >
      <CloudBank variant="floor" color="#eef2f8" className="-inset-x-[10%] -top-6 h-40 rotate-180" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8 flex items-center gap-4">
              <m.img
                src="./assets/brand/app-icon.svg"
                alt="Ícone do Supaco"
                className="size-20 rounded-[26%] shadow-[0_20px_40px_-12px_rgb(30_122_71/0.7)] sm:size-24"
                initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
                whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                whileHover={{ rotate: -6, scale: 1.06 }}
              />
              <div className="text-ink">
                <div className="font-display text-xl font-bold tracking-tight">Supaco</div>
                <div className="text-sm text-ink/60">Android · v{version} · {sizeMb} MB</div>
              </div>
            </div>
            <h2 className="font-display text-[clamp(2.3rem,10vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
              Pergunta pro
              <br />
              Supaco.
            </h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink/75">
              Grátis, sem cadastro extra e sem Play Store. Baixe o APK direto no celular.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ApkButton />
              <a href={RELEASES_URL} className="text-[15px] font-medium text-ink/80 underline decoration-ink/30 underline-offset-4 hover:text-ink">
                Todas as versões
              </a>
            </div>
          </m.div>

          <m.div
            className="hidden items-center gap-4 rounded-[28px] bg-white/90 p-4 pr-6 text-ink lg:flex"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            <div className="size-28 rounded-2xl bg-white p-2.5">
              <Qr />
            </div>
            <p className="max-w-[150px] text-sm leading-snug">
              <strong className="block font-semibold">Tá no computador?</strong>
              Aponte a câmera do celular e o download começa lá.
            </p>
          </m.div>
        </div>

        <ol className="mt-16 grid gap-3 lg:mt-24 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <m.li
              key={s.title}
              className="glass rounded-[26px] p-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <span className="grid size-8 place-items-center rounded-full bg-white font-display text-sm font-bold text-ink">{i + 1}</span>
              <h3 className="mt-4 text-[17px] font-semibold">{s.title}</h3>
              <p className="mt-1 text-[14px] leading-snug text-white/80">{s.text}</p>
            </m.li>
          ))}
        </ol>

        <ul className="mt-8 flex flex-wrap gap-2">
          {TRUST.map((t) => (
            <li key={t} className="rounded-full bg-white/12 px-3.5 py-2 text-[13px] text-white/90 ring-1 ring-white/20">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-white/70">
          Requer Android 7.0 ou mais novo. No iPhone, use o <a href="https://supaco.vercel.app/" className="underline underline-offset-2">Supaco Web</a> pelo Safari.
        </p>
      </div>

      <footer className="relative mx-auto mt-24 flex max-w-6xl flex-col gap-6 border-t border-white/20 px-4 pt-8 text-[13px] text-white/75 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="size-7" />
          <p>Projeto não oficial, feito por estudante, sem vínculo com o IFRN.</p>
        </div>
        <div className="flex items-center gap-4">
          <a href={REPO} className="inline-flex items-center gap-1.5 hover:text-white">
            <GithubIcon /> kellyson71
          </a>
          <a href="https://supaco.vercel.app/" className="hover:text-white">
            supaco.vercel.app
          </a>
        </div>
      </footer>
    </section>
  )
}
