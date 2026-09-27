import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from 'framer-motion'
import { useEffect, type RefObject } from 'react'

// Posição do ponteiro (ou inclinação do celular) normalizada em -1..1
export function useTilt(ref: RefObject<HTMLElement | null>): { x: MotionValue<number>; y: MotionValue<number> } {
  const reduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 18 })
  const y = useSpring(rawY, { stiffness: 60, damping: 18 })

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      rawX.set(((e.clientX - r.left) / r.width) * 2 - 1)
      rawY.set(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }
    // No Android o giroscópio chega sem pedir permissão
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      rawX.set(Math.max(-1, Math.min(1, e.gamma / 25)))
      rawY.set(Math.max(-1, Math.min(1, (e.beta - 45) / 25)))
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    window.addEventListener('deviceorientation', onOrient)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('deviceorientation', onOrient)
    }
  }, [ref, reduce, rawX, rawY])

  return { x, y }
}
