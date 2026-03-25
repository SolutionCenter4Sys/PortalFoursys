import { useEffect, useRef } from 'react'

interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  minDistance?: number
  maxVertical?: number
}

export function useSwipe(
  elementRef: React.RefObject<HTMLElement | null>,
  { onSwipeLeft, onSwipeRight, minDistance = 50, maxVertical = 80 }: SwipeOptions
) {
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    function onTouchStart(e: TouchEvent) {
      startX.current = e.touches[0].clientX
      startY.current = e.touches[0].clientY
    }

    function onTouchEnd(e: TouchEvent) {
      if (startX.current === null || startY.current === null) return
      const dx = e.changedTouches[0].clientX - startX.current
      const dy = Math.abs(e.changedTouches[0].clientY - startY.current)
      if (dy > maxVertical) return
      if (Math.abs(dx) < minDistance) return
      if (dx < 0 && onSwipeLeft) onSwipeLeft()
      if (dx > 0 && onSwipeRight) onSwipeRight()
      startX.current = null
      startY.current = null
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [elementRef, onSwipeLeft, onSwipeRight, minDistance, maxVertical])
}
