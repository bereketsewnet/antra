import { motion } from 'framer-motion'

export interface Segment { label: string; value: number; color: string }

// ── Animated donut / pie ──
export function Donut({ segments, size = 168, thickness = 24 }: { segments: Segment[]; size?: number; thickness?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const r = (size - thickness) / 2
  const C = 2 * Math.PI * r
  let acc = 0

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ flexShrink: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef1f6" strokeWidth={thickness} />
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {total > 0 && segments.map((seg, i) => {
            if (seg.value === 0) return null
            const dash = (seg.value / total) * C
            const rotation = (acc / total) * 360
            acc += seg.value
            return (
              <motion.circle
                key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={seg.color} strokeWidth={thickness}
                strokeDasharray={`${dash} ${C}`}
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                initial={{ strokeDashoffset: dash }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              />
            )
          })}
        </g>
        <text x="50%" y="47%" textAnchor="middle" fontSize={30} fontWeight={700} fill="#0b2135" fontFamily="Space Grotesk">{total}</text>
        <text x="50%" y="61%" textAnchor="middle" fontSize={11} fill="#64748b">total</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 130 }}>
        {segments.map((seg, i) => (
          <motion.div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}
            initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
            <span style={{ color: '#334155', textTransform: 'capitalize' }}>{seg.label}</span>
            <span style={{ marginLeft: 'auto', color: '#0b2135', fontWeight: 600 }}>{seg.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Animated horizontal bars ──
export function HBars({ items, color = '#d97911' }: { items: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(1, ...items.map(i => i.value))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
            <span style={{ color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{it.label}</span>
            <span style={{ color: '#0b2135', fontWeight: 600 }}>{it.value}</span>
          </div>
          <div style={{ height: 9, background: '#eef1f6', borderRadius: 100, overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: color, borderRadius: 100 }}
              initial={{ width: 0 }} animate={{ width: `${(it.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Animated area / line chart ──
export function AreaChart({ data, height = 160, color = '#d97911' }: { data: { date: string; count: number }[]; height?: number; color?: string }) {
  const w = 640
  const h = height
  const pad = 8
  const max = Math.max(1, ...data.map(d => d.count))
  const step = data.length > 1 ? (w - pad * 2) / (data.length - 1) : 0
  const y = (v: number) => pad + (h - pad * 2) * (1 - v / max)
  const pts = data.map((d, i) => [pad + i * step, y(d.count)] as const)
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${(pad + (data.length - 1) * step).toFixed(1)},${h - pad} L${pad},${h - pad} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#areaFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
      <motion.path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeInOut' }} />
      {pts.map((p, i) => (
        <motion.circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={color} strokeWidth={2}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.03 }} />
      ))}
    </svg>
  )
}
