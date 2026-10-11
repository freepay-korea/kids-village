/**
 * 부모 잠금 문제. 글자로 된 덧셈 문제라 글을 못 읽는 아이는 풀 수 없다.
 * 길게 누르기만으로는 열리지 않는다.
 */
const words = ['영', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉']

export interface GateQuestion {
  prompt: string
  answer: number
  choices: number[]
}

export function makeGateQuestion(): GateQuestion {
  const a = 2 + Math.floor(Math.random() * 8)
  const b = 2 + Math.floor(Math.random() * 8)
  const answer = a + b
  const choices = new Set<number>([answer])
  while (choices.size < 4) {
    const d = answer + (Math.floor(Math.random() * 7) - 3)
    if (d > 0 && d !== answer) choices.add(d)
  }
  return {
    prompt: `${words[a]} 더하기 ${words[b]}은?`,
    answer,
    choices: [...choices].sort(() => Math.random() - 0.5),
  }
}
