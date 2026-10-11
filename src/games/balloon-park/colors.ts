/** 풍선 색. 이름은 장식용, 실제로는 음성으로 말한다. */
export interface BalloonColor {
  id: string
  hex: number
  css: string
  name: string
  /** "빨간 풍선" 같은 수식형 */
  adj: string
}

export const colors: BalloonColor[] = [
  { id: 'red', hex: 0xef4444, css: '#ef4444', name: '빨강', adj: '빨간' },
  { id: 'blue', hex: 0x3b82f6, css: '#3b82f6', name: '파랑', adj: '파란' },
  { id: 'yellow', hex: 0xfacc15, css: '#facc15', name: '노랑', adj: '노란' },
  { id: 'green', hex: 0x22c55e, css: '#22c55e', name: '초록', adj: '초록' },
  { id: 'purple', hex: 0xa855f7, css: '#a855f7', name: '보라', adj: '보라' },
  { id: 'orange', hex: 0xf97316, css: '#f97316', name: '주황', adj: '주황' },
  { id: 'pink', hex: 0xf472b6, css: '#f472b6', name: '분홍', adj: '분홍' },
]

export const countWords = ['', '한 개', '두 개', '세 개']
