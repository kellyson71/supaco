// Mesmas regras e textos do app (supaco-mobile/.../AbsenceLogic.kt)

export type Status = 'GO' | 'WARN' | 'LAST' | 'NO' | 'REPROVADO'

export const LIMITE = 10 // 40h de carga horária × 25%

export function calcStatus(faltas: number): Status {
  const restantes = LIMITE - faltas
  if (restantes <= -1) return 'REPROVADO'
  if (restantes === 0) return 'NO'
  if (restantes === 1) return 'LAST'
  if (restantes <= 3) return 'WARN'
  return 'GO'
}

type Sky = { top: string; mid: string; low: string; cloud: string; sun: string }

export type Verdict = {
  word: string
  line: string
  container: string
  onContainer: string
  solid: string
  sky: Sky
  theme: string
}

export const VERDICTS: Record<Status, Verdict> = {
  GO: {
    word: 'PODE FALTAR',
    line: 'Falta tranquilo, ninguém vai sentir sua ausência.',
    container: '#0F4427',
    onContainer: '#9EF4BE',
    solid: '#6FE39B',
    sky: { top: '#2F6FD0', mid: '#79A9EC', low: '#D6E6F8', cloud: '#FFFFFF', sun: 'rgba(255,244,214,.85)' },
    theme: '#2F6FD0',
  },
  WARN: {
    word: 'CALMA AÍ',
    line: 'Maneira na empolgação, o limite tá te observando.',
    container: '#473400',
    onContainer: '#FFE08A',
    solid: '#F2C84B',
    sky: { top: '#34508F', mid: '#D9A15E', low: '#F7D896', cloud: '#FFEBCB', sun: 'rgba(255,214,120,.9)' },
    theme: '#34508F',
  },
  LAST: {
    word: 'ÚLTIMA BALA',
    line: 'Respira: você tem exatamente UMA chance de vacilar.',
    container: '#572400',
    onContainer: '#FFD9BF',
    solid: '#FFA968',
    sky: { top: '#262A5C', mid: '#C85C48', low: '#F29A68', cloud: '#F7BC9E', sun: 'rgba(255,150,90,.8)' },
    theme: '#262A5C',
  },
  NO: {
    word: 'NEM PENSE',
    line: 'Senta, respira e vai pra aula. Sério.',
    container: '#5C1413',
    onContainer: '#FFDAD6',
    solid: '#FFB4AB',
    sky: { top: '#16181F', mid: '#3D3140', low: '#6B4447', cloud: '#5E5866', sun: 'rgba(255,120,110,.25)' },
    theme: '#16181F',
  },
  REPROVADO: {
    word: 'JÁ ERA',
    line: 'Reprovado por falta. Um clássico atemporal.',
    container: '#3A0D0D',
    onContainer: '#FFDAD6',
    solid: '#FF6B5E',
    sky: { top: '#07080C', mid: '#171220', low: '#2E1516', cloud: '#2A2731', sun: 'rgba(255,60,60,.12)' },
    theme: '#07080C',
  },
}

// Sequência que o hero percorre sozinho até alguém mexer no controle
export const TOUR = [4, 8, 9, 10, 11]
