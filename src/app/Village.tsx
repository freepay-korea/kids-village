import { Link } from 'react-router-dom'
import { games } from '@/games/registry'

/**
 * 마을 허브 자리.
 * 1단계(뼈대)에서는 건물 목록만 보여 주고, 2단계에서 "탭해서 시작"·지도·전환 효과를 붙인다.
 */
export function Village() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-4xl text-amber-900" aria-label="아이 게임 마을">
        🏘️ 아이 게임 마을
      </h1>
      <nav className="flex flex-wrap justify-center gap-4">
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/${game.id}`}
            aria-label={game.name}
            className="flex min-h-touch min-w-touch flex-col items-center justify-center gap-1 rounded-3xl px-6 py-4 text-5xl shadow-md transition active:scale-95"
            style={{ backgroundColor: game.color }}
          >
            <span>{game.icon}</span>
            <span className="text-base text-white drop-shadow">{game.name}</span>
          </Link>
        ))}
      </nav>
    </main>
  )
}
