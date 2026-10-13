import { motion, type MotionValue } from 'framer-motion'

/** 해 (저녁이면 달). 은은한 빛무리와 천천히 도는 햇살 */
export function Sun({ evening, className = '' }: { evening?: boolean; className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`} style={{ width: 120, height: 120 }}>
      <div
        className="absolute inset-[-40px] rounded-full"
        style={{
          background: evening
            ? 'radial-gradient(circle, rgba(254,240,138,0.5) 0%, rgba(254,240,138,0) 70%)'
            : 'radial-gradient(circle, rgba(253,224,71,0.6) 0%, rgba(253,224,71,0) 70%)',
        }}
      />
      {!evening && (
        <svg viewBox="0 0 120 120" className="animate-spin-slow absolute inset-0">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x="57" y="2" width="6" height="22" rx="3" fill="#fde047" opacity="0.8" transform={`rotate(${i * 30} 60 60)`} />
          ))}
        </svg>
      )}
      <svg viewBox="0 0 120 120" className="absolute inset-0">
        <defs>
          <radialGradient id="sun-g" cx="40%" cy="40%" r="60%">
            <stop offset="0" stopColor={evening ? '#fef9c3' : '#fff7b3'} />
            <stop offset="1" stopColor={evening ? '#fde68a' : '#fbbf24'} />
          </radialGradient>
        </defs>
        {evening ? (
          <path d="M70 25 a35 35 0 1 0 25 60 a28 28 0 0 1 -25 -60 z" fill="url(#sun-g)" />
        ) : (
          <circle cx="60" cy="60" r="32" fill="url(#sun-g)" />
        )}
      </svg>
    </div>
  )
}

export function Cloud({ className = '', scale = 1 }: { className?: string; scale?: number }) {
  return (
    <svg viewBox="0 0 160 80" className={`pointer-events-none ${className}`} style={{ width: 160 * scale, height: 80 * scale }}>
      <g fill="#ffffff">
        <ellipse cx="50" cy="52" rx="40" ry="22" />
        <ellipse cx="90" cy="46" rx="42" ry="28" />
        <ellipse cx="125" cy="56" rx="30" ry="18" />
      </g>
      <ellipse cx="80" cy="66" rx="70" ry="10" fill="#dbeafe" opacity="0.6" />
    </svg>
  )
}

/** 천천히 흘러가는 구름 떼 */
export function Clouds({ x }: { x?: MotionValue<number> }) {
  const clouds = [
    { top: '6%', left: '4%', scale: 0.9, dur: 40 },
    { top: '14%', left: '30%', scale: 0.6, dur: 55 },
    { top: '4%', left: '58%', scale: 1.1, dur: 48 },
    { top: '18%', left: '80%', scale: 0.7, dur: 62 },
  ]
  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ x }}>
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: c.top, left: c.left }}
          animate={{ x: [0, 60, 0] }}
          transition={{ repeat: Infinity, duration: c.dur, ease: 'easeInOut', delay: i * 3 }}
        >
          <Cloud scale={c.scale} />
        </motion.div>
      ))}
    </motion.div>
  )
}

/** 멀리 보이는 언덕 두 겹 */
export function Hills({ x, evening }: { x?: MotionValue<number>; evening?: boolean }) {
  return (
    <motion.div className="pointer-events-none absolute right-0 bottom-[24%] left-0 h-[36%]" style={{ x }}>
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M0 220 C150 120 300 140 450 200 C600 260 750 110 900 170 C1000 210 1100 150 1200 190 L1200 300 L0 300 Z"
          fill={evening ? '#86a56a' : '#a7f3d0'}
        />
        <path
          d="M0 260 C200 200 350 240 520 230 C700 220 820 180 1000 240 C1080 265 1140 250 1200 255 L1200 300 L0 300 Z"
          fill={evening ? '#6f9a52' : '#6ee7b7'}
        />
      </svg>
    </motion.div>
  )
}

/** 나무 한 그루 */
export function Tree({ size = 90, dark }: { size?: number; dark?: boolean }) {
  return (
    <svg viewBox="0 0 100 120" style={{ width: size, height: size * 1.2 }} className="pointer-events-none">
      <rect x="44" y="80" width="12" height="36" rx="5" fill="#92400e" />
      <circle cx="50" cy="56" r="34" fill={dark ? '#15803d' : '#22c55e'} />
      <circle cx="30" cy="70" r="22" fill={dark ? '#166534' : '#16a34a'} />
      <circle cx="72" cy="68" r="24" fill={dark ? '#15803d' : '#22c55e'} />
      <circle cx="42" cy="40" r="8" fill="#86efac" opacity="0.7" />
    </svg>
  )
}

export function Flower({ color = '#f472b6', size = 26 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 40 50" style={{ width: size, height: size * 1.25 }} className="pointer-events-none animate-wiggle origin-bottom">
      <path d="M20 48 V26" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="20" cy="12" rx="6" ry="9" fill={color} transform={`rotate(${r} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="6" fill="#fde047" />
    </svg>
  )
}
