import type { ComponentType } from 'react'

/** 게임이 받는 두 가지 신호. 이 외에 core를 직접 건드리지 않는다. */
export interface GameProps {
  /** 미션 완료. 해당 건물의 스티커 id를 넘기면 core가 지급·저장한다. */
  onComplete: (stickerId: string) => void
  /** 집 버튼 등으로 마을로 돌아갈 때 */
  onExit: () => void
}

export type GameComponent = ComponentType<GameProps>

/** registry에 등록하는 건물 한 채의 정보 */
export interface GameMeta {
  id: string
  /** 건물 이름(장식용 글자. 실제 안내는 그림+음성) */
  name: string
  /** 마을 지도에 보일 그림. MVP는 이모지, 출시 전 일러스트로 교체 */
  icon: string
  /** 건물 대표색 */
  color: string
  /** 권장 최소 연령 */
  minAge: number
  /** 유료화 대비 자리. 지금은 모두 false */
  locked: boolean
  /** 건물에 들어갈 때만 동적 import */
  load: () => Promise<{ default: GameComponent }>
}
