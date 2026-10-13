import list from './picList.json'

/**
 * 이모지 문자 → 일러스트(Fluent Emoji Color, MIT, public/assets/pics/<코드포인트>.svg).
 * 데이터는 그대로 이모지 문자로 두고, 화면에 그릴 때만 그림으로 바꾼다.
 * 그림이 없는 이모지는 글자로 그대로 보인다. 출시 전 자체 일러스트로 바꿀 때도 파일만 교체하면 된다.
 */
const available = new Set<string>(list)

export function picKey(emoji: string) {
  return [...emoji]
    .filter((c) => c !== '️')
    .map((c) => c.codePointAt(0)!.toString(16))
    .join('-')
}

export function picUrl(emoji: string): string | null {
  const key = picKey(emoji)
  return available.has(key) ? `${import.meta.env.BASE_URL}assets/pics/${key}.svg` : null
}

interface Props {
  emoji: string
  className?: string
  alt?: string
  style?: React.CSSProperties
}

export function Pic({ emoji, className = '', alt = '', style }: Props) {
  const url = picUrl(emoji)
  if (!url) {
    return (
      <span className={`inline-flex items-center justify-center leading-none ${className}`} style={style} aria-hidden={alt === ''}>
        {emoji}
      </span>
    )
  }
  return (
    <img
      src={url}
      alt={alt}
      draggable={false}
      className={`inline-block select-none object-contain ${className}`}
      style={style}
      aria-hidden={alt === ''}
    />
  )
}

/** SVG 안에서 쓰는 그림 (<image>). 없으면 글자 */
export function SvgPic({ emoji, x, y, size }: { emoji: string; x: number; y: number; size: number }) {
  const url = picUrl(emoji)
  if (!url) {
    return (
      <text x={x + size / 2} y={y + size * 0.8} fontSize={size * 0.9} textAnchor="middle">
        {emoji}
      </text>
    )
  }
  return <image href={url} x={x} y={y} width={size} height={size} />
}
