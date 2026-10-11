import type { Item } from '../shared/types'

/** 동물 농장 동물들. 그림·소리는 콕콕 단어 학교와 공유한다. */
export const animals: Item[] = [
  { id: 'cow', icon: '🐄', name: '소', voiceKey: 'farm.cow', questionKey: 'farm.cow.sound' },
  { id: 'pig', icon: '🐷', name: '돼지', voiceKey: 'farm.pig', questionKey: 'farm.pig.sound' },
  { id: 'chick', icon: '🐥', name: '병아리', voiceKey: 'farm.chick', questionKey: 'farm.chick.sound' },
  { id: 'sheep', icon: '🐑', name: '양', voiceKey: 'farm.sheep', questionKey: 'farm.sheep.sound' },
  { id: 'duck', icon: '🦆', name: '오리', voiceKey: 'farm.duck', questionKey: 'farm.duck.sound' },
  { id: 'horse', icon: '🐴', name: '말', voiceKey: 'farm.horse', questionKey: 'farm.horse.sound' },
  { id: 'dog', icon: '🐶', name: '강아지', voiceKey: 'farm.dog', questionKey: 'farm.dog.sound' },
  { id: 'cat', icon: '🐱', name: '고양이', voiceKey: 'farm.cat', questionKey: 'farm.cat.sound' },
]
