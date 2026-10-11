import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings, type PlayTimeMinutes } from '@/core/settings'
import { useStickers } from '@/core/stickers'
import { playSfx } from '@/core/sound'
import { HomeButton } from '@/ui/HomeButton'

/** 부모 설정. 부모 잠금을 통과해야 들어온다. 어른용이라 글자를 써도 된다. */
export function SettingsRoute() {
  const navigate = useNavigate()
  const s = useSettings()
  const resetStickers = useStickers((st) => st.reset)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <motion.div
      className="relative h-full w-full overflow-y-auto bg-gray-50 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HomeButton onClick={() => navigate('/')} />
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 pt-20 pb-10">
        <h1 className="text-3xl">부모 설정</h1>

        <Row label="소리 크기">
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={s.volume}
            aria-label="소리 크기"
            onChange={(e) => s.set({ volume: Number(e.target.value) })}
            onPointerUp={() => playSfx('correct')}
            className="h-touch w-56 accent-amber-500"
          />
        </Row>

        <Row label="배경음">
          <Toggle on={s.bgm} onChange={(v) => s.set({ bgm: v })} label="배경음" />
        </Row>

        <Row label="난이도 쉬움 고정">
          <Toggle on={s.easyMode} onChange={(v) => s.set({ easyMode: v })} label="난이도 쉬움 고정" />
        </Row>

        <Row label="정답 진동">
          <Toggle on={s.haptics} onChange={(v) => s.set({ haptics: v })} label="정답 진동" />
        </Row>

        <Row label="놀이 시간 알림">
          <div className="flex gap-2">
            {([0, 15, 30] as PlayTimeMinutes[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => s.set({ playTimeMinutes: m })}
                className={`min-h-touch rounded-2xl px-5 text-xl ${
                  s.playTimeMinutes === m ? 'bg-amber-400 text-white' : 'bg-gray-200'
                }`}
              >
                {m === 0 ? '끔' : `${m}분`}
              </button>
            ))}
          </div>
        </Row>

        <Row label="스티커 초기화">
          {confirmReset ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  resetStickers()
                  setConfirmReset(false)
                }}
                className="min-h-touch rounded-2xl bg-red-500 px-5 text-xl text-white"
              >
                정말 지우기
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-touch rounded-2xl bg-gray-200 px-5 text-xl"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-touch rounded-2xl bg-gray-200 px-5 text-xl"
            >
              지우기
            </button>
          )}
        </Row>

        <section className="rounded-2xl bg-white p-5 text-base leading-relaxed text-gray-600 shadow-sm">
          <h2 className="mb-2 text-xl text-gray-800">개인정보처리방침</h2>
          <p>
            이 앱은 어떤 개인정보도 수집하지 않아요. 계정이 없고, 서버로 보내는 정보도 없고, 광고나 분석
            도구도 들어 있지 않아요. 모은 스티커와 설정은 이 기기 안에만 저장되며, 위의 "스티커 초기화"나
            앱 삭제로 모두 지울 수 있어요.
          </p>
        </section>
      </div>
    </motion.div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-touch items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3 shadow-sm">
      <span className="text-xl">{label}</span>
      {children}
    </div>
  )
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-12 w-24 rounded-full transition ${on ? 'bg-green-400' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-1 h-10 w-10 rounded-full bg-white shadow transition-all ${
          on ? 'left-13' : 'left-1'
        }`}
      />
    </button>
  )
}
