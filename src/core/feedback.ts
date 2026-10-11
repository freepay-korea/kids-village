import { haptic } from './haptics'
import { playSfx } from './sound'
import { say } from './voice'

/** 게임이 정답·오답 때 부르는 공통 반응. 벌점·게임오버는 없다. */
export const feedback = {
  tap: () => playSfx('tap'),
  correct: () => {
    playSfx('correct')
    haptic(40)
    void say('great')
  },
  /** 살짝 흔들리는 연출은 게임이, 소리는 여기서 */
  wrong: () => {
    playSfx('wrong')
    void say('again')
  },
  hint: () => {
    playSfx('sparkle')
    void say('hint')
  },
}
