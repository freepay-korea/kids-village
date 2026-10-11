/** 모든 게임 화면 왼쪽 위에 항상 있는 집 버튼. 누르면 마을로 돌아간다. */
export function HomeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="마을로 돌아가기"
      className="absolute top-3 left-3 z-50 flex h-touch w-touch items-center justify-center rounded-full bg-white/90 text-4xl shadow-lg transition active:scale-90"
    >
      🏠
    </button>
  )
}
