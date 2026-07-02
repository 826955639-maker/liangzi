export type BadgeType = "eye" | "wave" | "maze";

/* Center icon drawn in the medal's 104×116 coordinate space, centred on (52,52) */
function MedalIcon({ type }: { type: BadgeType }) {
  const common = {
    fill: "none",
    stroke: "#efe7ff",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <g transform="translate(31.6 31.6) scale(1.7)" {...common}>
      {type === "eye" && (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="1.1" fill="#efe7ff" stroke="none" />
        </>
      )}
      {type === "wave" && (
        <path d="M2.5 12.5h2l1.5-4.5 2.5 10 2.5-14.5 2.5 17 2.5-12.5 2 8.5 1.5-4h2" />
      )}
      {type === "maze" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="1.4" />
          <path d="M3 9h5M3 15h4M9 3v5M15 3v4M21 9h-4M21 15h-6M9 21v-5M15 21v-4M11 9h2v6h-2z" />
        </>
      )}
    </g>
  );
}

/* Ornate hexagonal award medal — glossy face, engraved inner, rivets, laurel, sparkles */
export default function BadgeMedal({ type }: { type: BadgeType }) {
  const uid = `bm-${type}`;
  const main = "52,10 90,33 90,79 52,102 14,79 14,33";
  const ring = "52,3 97,29 97,83 52,109 7,83 7,29";
  const inner = "52,20 81,37.5 81,74.5 52,92 23,74.5 23,37.5";
  const rivets: Array<[number, number]> = [
    [52, 10],
    [90, 33],
    [90, 79],
    [52, 102],
    [14, 79],
    [14, 33],
  ];

  return (
    <svg viewBox="0 0 104 118" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="badge-medal">
      <defs>
        <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9b0ff" />
          <stop offset="42%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3a1a86" />
        </linearGradient>
        <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {/* ambient glow */}
      <polygon points={main} fill={`url(#${uid}-glow)`} filter={`url(#${uid}-soft)`} opacity="0.9" />

      {/* dotted outer ring */}
      <polygon
        points={ring}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1"
        strokeOpacity="0.55"
        strokeDasharray="1.4 3.4"
        strokeLinecap="round"
      />

      {/* laurel wreath wrapping the lower sides */}
      <g stroke="#8b6ce0" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M40 104C31 101 25 93 23 82" />
        <path d="M64 104c9-3 15-11 17-22" />
      </g>
      <g fill="#9d7bec" opacity="0.9">
        <ellipse cx="27" cy="94" rx="3.1" ry="1.7" transform="rotate(52 27 94)" />
        <ellipse cx="24" cy="86" rx="3" ry="1.6" transform="rotate(72 24 86)" />
        <ellipse cx="23" cy="78" rx="2.7" ry="1.5" transform="rotate(88 23 78)" />
        <ellipse cx="77" cy="94" rx="3.1" ry="1.7" transform="rotate(-52 77 94)" />
        <ellipse cx="80" cy="86" rx="3" ry="1.6" transform="rotate(-72 80 86)" />
        <ellipse cx="81" cy="78" rx="2.7" ry="1.5" transform="rotate(-88 81 78)" />
      </g>

      {/* medal face */}
      <polygon points={main} fill={`url(#${uid}-face)`} stroke="#d6c4ff" strokeWidth="1.4" />
      {/* top gloss */}
      <polygon points="14,33 52,10 90,33 52,48" fill={`url(#${uid}-gloss)`} />
      {/* engraved inner hexagon */}
      <polygon points={inner} fill="none" stroke="#e6d9ff" strokeWidth="1" strokeOpacity="0.55" />

      {/* rivets on each vertex */}
      <g fill="#efe7ff">
        {rivets.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.7" />
        ))}
      </g>

      {/* icon */}
      <MedalIcon type={type} />

      {/* sparkles */}
      <g fill="#fbe7a6">
        <path d="M30 22l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1Z" opacity="0.9" />
        <path d="M75 18l0.8 2.2 2.2 0.8-2.2 0.8-0.8 2.2-0.8-2.2-2.2-0.8 2.2-0.8Z" opacity="0.8" />
      </g>
      <circle cx="68" cy="30" r="1.1" fill="#fff" opacity="0.7" />
      <circle cx="34" cy="34" r="1" fill="#fff" opacity="0.6" />
    </svg>
  );
}
