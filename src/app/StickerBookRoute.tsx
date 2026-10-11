import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { HomeButton } from '@/ui/HomeButton'

/** 스티커북 자리. 4단계에서 모은 스티커·빈 칸 실루엣을 보여 준다. */
export function StickerBookRoute() {
  const navigate = useNavigate()
  return (
    <motion.div
      className="relative flex h-full w-full items-center justify-center bg-pink-200 text-9xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <HomeButton onClick={() => navigate('/')} />
      📖
    </motion.div>
  )
}
