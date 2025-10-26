import { ref, onUnmounted } from 'vue'

export function useCountdown(
  durationSeconds: number,
  onFinish?: () => void,
  intervalTriggerSeconds: number = 0,
  onInterval?: (remainingSeconds: number) => void,
) {
  const minutes = ref<number>(Math.floor(durationSeconds / 60))
  const seconds = ref<number>(durationSeconds % 60)
  const isRunning = ref<boolean>(false)

  let timer: ReturnType<typeof setInterval> | null = null
  let totalSeconds: number = durationSeconds

  const updateTime = (): void => {
    minutes.value = Math.floor(totalSeconds / 60)
    seconds.value = totalSeconds % 60
  }

  const start = (): void => {
    if (isRunning.value) return
    isRunning.value = true

    timer = setInterval(() => {
      totalSeconds--

      updateTime()

      if (
        intervalTriggerSeconds > 0 &&
        totalSeconds > 0 &&
        totalSeconds % intervalTriggerSeconds === 0
      ) {
        onInterval?.(totalSeconds)
      }

      if (totalSeconds <= 0) {
        stop()
        onFinish?.()
      }
    }, 1000)
  }

  const stop = (): void => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isRunning.value = false
  }

  const reset = (): void => {
    stop()
    totalSeconds = durationSeconds
    updateTime()
  }

  onUnmounted(() => {
    stop()
  })

  // initialize
  updateTime()

  return {
    minutes,
    seconds,
    isRunning,
    start,
    stop,
    reset,
  }
}
