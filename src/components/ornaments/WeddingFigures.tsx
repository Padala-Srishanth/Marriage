// Stylised, faceless figures in the manner of Indian wedding illustration.
// They stand for the couple without pretending to be portraits of them.
// Each figure is drawn with its feet at (0, 0), facing the viewer.

const GOLD = '#C6A15B'
const SKIN = '#B9785A'
const HAIR = '#2A1410'

function Bashikam() {
  // The forehead ornament worn by both bride and groom at a Telugu wedding
  return (
    <g>
      <path d="M -16 -283 L -10 -301 L -4 -287 L 0 -307 L 4 -287 L 10 -301 L 16 -283 Z" fill={GOLD} stroke="#70500F" strokeWidth="0.8" />
      {[-1, 1].map((side) => (
        <g key={side}>
          <path d={`M ${16 * side} -283 Q ${23 * side} -268 ${21 * side} -252`} stroke={GOLD} strokeWidth="1.4" fill="none" />
          {[-276, -266, -256].map((y) => (
            <circle key={y} cx={(y === -276 ? 20 : y === -266 ? 22 : 21) * side} cy={y} r="1.8" fill="#FFF8EB" />
          ))}
        </g>
      ))}
    </g>
  )
}

export function Groom() {
  return (
    <g strokeLinejoin="round">
      {/* Pancha */}
      <path d="M -46 -110 L -40 0 H 40 L 46 -110 Z" fill="#FFF3DC" stroke={GOLD} strokeWidth="1.4" />
      <path d="M -40 -7 H 40" stroke={GOLD} strokeWidth="5" />
      <path d="M -6 -106 L -4 -4 M 6 -106 L 4 -4 M 0 -106 V -4" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1" />
      <ellipse cx="-16" cy="1" rx="13" ry="4" fill="#5B1025" />
      <ellipse cx="16" cy="1" rx="13" ry="4" fill="#5B1025" />

      {/* Sleeves and hands */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <path d="M -36 -228 C -56 -202 -60 -162 -58 -122 L -46 -122 C -46 -160 -44 -194 -32 -214 Z" fill="#FFF3DC" stroke={GOLD} strokeWidth="1.2" />
          <circle cx="-52" cy="-115" r="7" fill={SKIN} />
        </g>
      ))}

      {/* Kurta */}
      <path
        d="M -32 -232 Q 0 -242 32 -232 C 46 -222 50 -196 48 -166 L 54 -100 Q 0 -90 -54 -100 L -48 -166 C -50 -196 -46 -222 -32 -232 Z"
        fill="#FFF3DC"
        stroke={GOLD}
        strokeWidth="1.4"
      />
      {[-222, -206, -190, -174, -158].map((y) => (
        <circle key={y} cx="0" cy={y} r="1.8" fill={GOLD} />
      ))}

      {/* Kanduva over the shoulder */}
      <path d="M 30 -232 C 10 -200 -20 -170 -42 -140 L -31 -131 C -12 -160 16 -192 38 -220 Z" fill="#781E32" stroke={GOLD} strokeWidth="1.2" />
      <path d="M 34 -228 C 46 -200 48 -160 44 -126 L 35 -126 C 37 -160 35 -196 27 -222 Z" fill="#781E32" stroke={GOLD} strokeWidth="1.2" />

      {/* Head */}
      <rect x="-7" y="-250" width="14" height="18" fill={SKIN} />
      <ellipse cx="0" cy="-268" rx="20" ry="23" fill={SKIN} />
      <path d="M -20 -268 C -23 -296 23 -296 20 -268 C 14 -283 -14 -283 -20 -268 Z" fill={HAIR} />
      <circle cx="0" cy="-275" r="2.4" fill="#B3122E" />
      <Bashikam />
    </g>
  )
}

export function Bride() {
  return (
    <g strokeLinejoin="round">
      {/* Jada with jasmine, falling behind the shoulder */}
      <path d="M 14 -262 C 30 -240 32 -200 28 -140" stroke={HAIR} strokeWidth="11" strokeLinecap="round" fill="none" />
      {[-236, -212, -188, -164].map((y) => (
        <circle key={y} cx={y < -220 ? 26 : 30} cy={y} r="4" fill="#FFF8EB" />
      ))}

      {/* Saree */}
      <path d="M -34 -152 C -48 -96 -58 -44 -64 0 H 64 C 58 -44 48 -96 34 -152 Z" fill="#9B1B30" stroke={GOLD} strokeWidth="1.4" />
      <path d="M -63 -8 H 63" stroke={GOLD} strokeWidth="7" />
      <path d="M -6 -148 L -14 -12 M 2 -148 L 0 -12 M 10 -148 L 14 -12" stroke={GOLD} strokeOpacity="0.45" strokeWidth="1" />

      {/* Arms with bangles */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <path d="M -30 -226 C -47 -200 -50 -164 -48 -124 L -39 -124 C -40 -162 -38 -196 -27 -214 Z" fill={SKIN} />
          <path d="M -49 -140 H -38 M -49 -134 H -38" stroke={GOLD} strokeWidth="2" />
        </g>
      ))}

      {/* Blouse and pallu */}
      <path d="M -28 -232 Q 0 -240 28 -232 C 38 -214 38 -176 34 -152 H -34 C -38 -176 -38 -214 -28 -232 Z" fill="#173C32" stroke={GOLD} strokeWidth="1.2" />
      <path d="M -30 -232 C -10 -228 8 -200 36 -152 L 42 -118 C 20 -150 -4 -170 -35 -182 Z" fill="#9B1B30" stroke={GOLD} strokeWidth="1.2" />
      <path d="M -33 -186 C -4 -173 20 -153 41 -122" stroke={GOLD} strokeWidth="4" fill="none" />

      {/* Head */}
      <rect x="-6" y="-250" width="12" height="18" fill={SKIN} />
      <path d="M -13 -240 Q 0 -222 13 -240" stroke={GOLD} strokeWidth="2.4" fill="none" />
      <ellipse cx="0" cy="-268" rx="19" ry="22" fill={SKIN} />
      <path d="M -20 -266 C -23 -296 23 -296 20 -266 C 16 -284 4 -286 0 -280 C -4 -286 -16 -284 -20 -266 Z" fill={HAIR} />
      <circle cx="0" cy="-273" r="2.6" fill="#B3122E" />
      <Bashikam />
    </g>
  )
}

/** A marigold garland that hangs around the neck. */
export function Garland() {
  const path = 'M -25 -236 C -32 -188 -15 -148 0 -144 C 15 -148 32 -188 25 -236'
  return (
    <g fill="none" strokeLinecap="round">
      <path d={path} stroke="#E9B44C" strokeWidth="10" strokeDasharray="0.1 9" />
      <path d={path} stroke="#B3122E" strokeWidth="4" strokeDasharray="0.1 18" />
      <circle cx="0" cy="-141" r="5" fill="#B3122E" />
    </g>
  )
}

/** The tera: the silk curtain held between bride and groom until the muhurtham. */
export function Tera() {
  return (
    <g>
      <defs>
        <pattern id="teraPleats" width="14" height="10" patternUnits="userSpaceOnUse">
          <rect width="14" height="10" fill="#781E32" />
          <rect x="9" width="5" height="10" fill="#54101F" />
          <rect x="3" width="2" height="10" fill="#8C2A40" />
        </pattern>
      </defs>
      <rect x="-64" y="-246" width="128" height="240" fill="url(#teraPleats)" stroke={GOLD} strokeWidth="2" />
      <rect x="-56" y="-238" width="112" height="224" fill="none" stroke={GOLD} strokeWidth="1" strokeOpacity="0.7" />
      <g transform="translate(0 -130)" fill="none" stroke={GOLD} strokeWidth="1.3">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0 0 C 6 -7, 7 -18, 0 -28 C -7 -18, -6 -7, 0 0 Z" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="34" strokeOpacity="0.6" />
      </g>
      <path d="M -76 -248 H 76" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
      <circle cx="-78" cy="-248" r="5" fill={GOLD} />
      <circle cx="78" cy="-248" r="5" fill={GOLD} />
    </g>
  )
}

/** The homa kundam with its sacred fire. */
export function SacredFire() {
  return (
    <g>
      <rect x="-44" y="-14" width="88" height="14" fill="#70500F" stroke={GOLD} />
      <rect x="-34" y="-26" width="68" height="12" fill="#8A6420" stroke={GOLD} />
      <g className="flicker" style={{ transformOrigin: '0px -26px' }}>
        <path d="M 0 -78 C 16 -58 18 -40 6 -26 H -6 C -18 -40 -16 -58 0 -78 Z" fill="#F29C38" />
        <path d="M -14 -60 C -6 -48 -4 -36 -8 -26 H -18 C -24 -38 -22 -50 -14 -60 Z" fill="#E86A2C" />
        <path d="M 14 -60 C 22 -50 24 -38 18 -26 H 8 C 4 -36 6 -48 14 -60 Z" fill="#E86A2C" />
        <path d="M 0 -56 C 8 -46 8 -36 3 -26 H -3 C -8 -36 -8 -46 0 -56 Z" fill="#FFE3A6" />
      </g>
    </g>
  )
}
