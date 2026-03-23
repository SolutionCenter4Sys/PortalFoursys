import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 2000, startOnMount = true) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const frameRef = useRef<number>()

  const start = () => {
    if (started) return
    setStarted(true)
    const startTime = performance.now()
    const startValue = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(startValue + (target - startValue) * eased))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (startOnMount) start()
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return { count, start }
}
