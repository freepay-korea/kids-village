import { useEffect } from 'react'
import { useSession } from './session'
import { useSettings } from './settings'
import { say } from './voice'

/**
 * 놀이 시간 알림. 설정한 시간이 지나면 마스코트가 "이제 쉬어볼까?" 하고 마을이 저녁이 된다.
 * 강제 종료는 하지 않는다. 설정이 0이면 아무것도 안 한다.
 */
export function usePlayTimer() {
  const startedAt = useSession((s) => s.startedAt)
  const evening = useSession((s) => s.evening)
  const limit = useSettings((s) => s.playTimeMinutes)

  useEffect(() => {
    if (!startedAt || evening || limit === 0) return
    const check = () => {
      if (Date.now() - startedAt >= limit * 60_000) {
        useSession.getState().setEvening(true)
        void say('rest')
      }
    }
    check()
    const id = window.setInterval(check, 10_000)
    return () => window.clearInterval(id)
  }, [startedAt, evening, limit])
}
