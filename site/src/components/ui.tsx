import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { useRelease } from '../lib/release'

export function GithubIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  )
}

export function Logo({ className = 'size-8' }: { className?: string }) {
  return <img src="./assets/brand/app-icon.svg" alt="" className={`${className} rounded-[28%] shadow-sm`} />
}

type ApkButtonProps = { size?: 'sm' | 'lg'; className?: string }

export function ApkButton({ size = 'lg', className = '' }: ApkButtonProps) {
  const { apkUrl, version, sizeMb } = useRelease()
  if (size === 'sm') {
    return (
      <a
        href={apkUrl}
        className={`inline-flex items-center gap-1.5 rounded-full bg-warn px-3.5 py-2 text-sm font-semibold text-ink transition-transform active:scale-95 ${className}`}
      >
        <Download className="size-4" strokeWidth={2.5} />
        Baixar APK
      </a>
    )
  }
  return (
    <a
      href={apkUrl}
      className={`group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-6 text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] transition-transform hover:-translate-y-0.5 active:scale-[0.97] ${className}`}
    >
      <span className="grid size-11 place-items-center rounded-full bg-warn text-ink transition-transform group-hover:rotate-[-8deg]">
        <Download className="size-5" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-semibold">Baixar APK</span>
        <span className="text-xs text-white/60">
          v{version} · {sizeMb} MB · Android 7+
        </span>
      </span>
    </a>
  )
}

export function CopyChip({ text, dark = true }: { text: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      }}
      className={`group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left font-mono text-[13px] transition-colors ${
        dark ? 'bg-white/[0.06] text-white/85 hover:bg-white/10' : 'bg-ink/[0.05] text-ink hover:bg-ink/10'
      }`}
      aria-label={`Copiar comando: ${text}`}
    >
      <span className="truncate">
        <span className="select-none opacity-40">$ </span>
        {text}
      </span>
      {copied ? <Check className="size-4 shrink-0 text-go" /> : <Copy className="size-4 shrink-0 opacity-50 group-hover:opacity-90" />}
    </button>
  )
}
