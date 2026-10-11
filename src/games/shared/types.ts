/** 탭 도감·찾기 미션이 공통으로 쓰는 항목 */
export interface Item {
  id: string
  /** MVP는 이모지. 출시 전 일러스트로 교체 */
  icon: string
  /** 장식용 글자 */
  name: string
  /** 놀이 모드에서 탭하면 말하는 대사 키 (예: "음메~ 소!") */
  voiceKey: string
  /** 미션에서 문제로 들려주는 대사 키 (예: "음메~" 또는 "사과") */
  questionKey: string
}
