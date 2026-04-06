interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

/**
 * PennyLime brand mark: 3D half-lemon (cross-section view) with 3 juice drops flying away.
 */
export function LogoMark({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Outer rind gradient — 3D shading */}
        <radialGradient id="lemon-rind" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>
        {/* Pith (white ring) */}
        <radialGradient id="lemon-pith" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef3c7" />
        </radialGradient>
        {/* Pulp (inner flesh) */}
        <radialGradient id="lemon-pulp" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="60%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>
        {/* Drop gradient */}
        <radialGradient id="drop-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="60%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>
        {/* Highlight (glossy shine) */}
        <radialGradient id="gloss" cx="30%" cy="25%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft drop shadow under the lemon */}
      <ellipse cx="22" cy="40" rx="14" ry="2.5" fill="#000" opacity="0.12" />

      {/* Outer rind circle */}
      <circle cx="22" cy="22" r="17" fill="url(#lemon-rind)" stroke="#854d0e" strokeWidth="1.2" />

      {/* White pith ring */}
      <circle cx="22" cy="22" r="14.5" fill="url(#lemon-pith)" />

      {/* Inner pulp circle */}
      <circle cx="22" cy="22" r="12.5" fill="url(#lemon-pulp)" />

      {/* Pulp segments — thin dividers radiating from center */}
      <g stroke="#fef3c7" strokeWidth="1.1" strokeLinecap="round">
        <line x1="22" y1="22" x2="22" y2="9.5" />
        <line x1="22" y1="22" x2="32.8" y2="15.75" />
        <line x1="22" y1="22" x2="32.8" y2="28.25" />
        <line x1="22" y1="22" x2="22" y2="34.5" />
        <line x1="22" y1="22" x2="11.2" y2="28.25" />
        <line x1="22" y1="22" x2="11.2" y2="15.75" />
      </g>

      {/* Segment highlights - subtle juice cell dots */}
      <g fill="#fef9c3" opacity="0.8">
        <circle cx="25" cy="15" r="0.6" />
        <circle cx="28" cy="19" r="0.6" />
        <circle cx="28" cy="25" r="0.6" />
        <circle cx="25" cy="29" r="0.6" />
        <circle cx="19" cy="29" r="0.6" />
        <circle cx="16" cy="25" r="0.6" />
        <circle cx="16" cy="19" r="0.6" />
        <circle cx="19" cy="15" r="0.6" />
      </g>

      {/* Center pith */}
      <circle cx="22" cy="22" r="1.4" fill="#fef3c7" stroke="#a16207" strokeWidth="0.5" />

      {/* Glossy highlight on rind (top-left) */}
      <ellipse cx="14" cy="13" rx="5" ry="3" fill="url(#gloss)" />

      {/* ─── 3 juice drops flying away ─── */}
      {/* Drop 1 - top right */}
      <g transform="translate(38 8) rotate(25)">
        <path
          d="M0 0 C 0 3, -2 4, -2 6.5 C -2 8, -1 9, 0 9 C 1 9, 2 8, 2 6.5 C 2 4, 0 3, 0 0 Z"
          fill="url(#drop-grad)"
          stroke="#854d0e"
          strokeWidth="0.6"
        />
        <ellipse cx="-0.6" cy="5.5" rx="0.5" ry="1.2" fill="#ffffff" opacity="0.7" />
      </g>

      {/* Drop 2 - right */}
      <g transform="translate(42 22) rotate(90)">
        <path
          d="M0 0 C 0 3.5, -2.2 4.5, -2.2 7.2 C -2.2 8.8, -1.1 10, 0 10 C 1.1 10, 2.2 8.8, 2.2 7.2 C 2.2 4.5, 0 3.5, 0 0 Z"
          fill="url(#drop-grad)"
          stroke="#854d0e"
          strokeWidth="0.6"
        />
        <ellipse cx="-0.7" cy="6" rx="0.6" ry="1.3" fill="#ffffff" opacity="0.7" />
      </g>

      {/* Drop 3 - bottom right */}
      <g transform="translate(38 36) rotate(155)">
        <path
          d="M0 0 C 0 2.8, -1.8 3.8, -1.8 6 C -1.8 7.4, -0.9 8.2, 0 8.2 C 0.9 8.2, 1.8 7.4, 1.8 6 C 1.8 3.8, 0 2.8, 0 0 Z"
          fill="url(#drop-grad)"
          stroke="#854d0e"
          strokeWidth="0.6"
        />
        <ellipse cx="-0.5" cy="5" rx="0.4" ry="1" fill="#ffffff" opacity="0.7" />
      </g>
    </svg>
  );
}

export function Logo({
  className = "",
  size = 32,
  showText = true,
  textClassName = "font-extrabold text-[15px] tracking-[-0.03em]",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span className={textClassName}>
          Penny<span className="text-[#15803d]">Lime</span>
        </span>
      )}
    </span>
  );
}
