import type { GameProps } from '@/games/types'

/** 아직 만들지 않은 건물의 임시 화면. 각 게임 단계에서 실제 게임으로 교체한다. */
export function UnderConstruction({ icon, name }: { icon: string; name: string }) {
  return function Placeholder(_props: GameProps) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white">
        <div className="text-9xl">{icon}</div>
        <div className="text-3xl drop-shadow">{name}</div>
        <div className="text-6xl">🚧</div>
      </div>
    )
  }
}
