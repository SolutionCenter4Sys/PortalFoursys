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

    function handleStart(x: number, y: number) {
      startX.current = x
      startY.current = y
    }

    function handleEnd(x: number, y: number) {
      if (startX.current === null || startY.current === null) return
      const dx = x - startX.current
      const dy = Math.abs(y - startY.current)
      startX.current = null
      startY.current = null
      if (dy > maxVertical) return
      if (Math.abs(dx) < minDistance) return
      if (dx < 0 && onSwipeLeft) onSwipeLeft()
      if (dx > 0 && onSwipeRight) onSwipeRight()
    }

    function onTouchStart(e: TouchEvent) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY)
    }

    function onTouchEnd(e: TouchEvent) {
      handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [elementRef, onSwipeLeft, onSwipeRight, minDistance, maxVertical])
}
