import { useEffect, useState } from 'react'

export const REPO = 'https://github.com/kellyson71/supaco-mobile'
export const RELEASES_URL = `${REPO}/releases/latest`

export type Release = { version: string; apkUrl: string; sizeMb: number }

const FALLBACK: Release = {
  version: '1.8',
  apkUrl: `${REPO}/releases/download/v1.8/supaco-1.8.apk`,
  sizeMb: 17,
}

let cache: Promise<Release> | null = null

function fetchRelease(): Promise<Release> {
  cache ??= fetch('https://api.github.com/repos/kellyson71/supaco-mobile/releases/latest')
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data) => {
      const apk = data.assets?.find((a: { name: string }) => a.name.endsWith('.apk'))
      if (!apk) return FALLBACK
      return {
        version: String(data.tag_name).replace(/^v/, ''),
        apkUrl: apk.browser_download_url,
        sizeMb: Math.round(apk.size / 1_000_000),
      }
    })
    .catch(() => FALLBACK)
  return cache
}

// Link direto para o .apk da release mais recente (com fallback se a API falhar)
export function useRelease(): Release {
  const [release, setRelease] = useState(FALLBACK)
  useEffect(() => {
    fetchRelease().then(setRelease)
  }, [])
  return release
}
