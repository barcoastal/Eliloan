interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

/**
 * CreditLime brand mark: half-lemon being squeezed with 3 juice drops.
 */
export function LogoMark({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Half lemon body (upside-down cup shape) */}
      <path
        d="M6 16 A14 14 0 0 1 34 16 Z"
        fill="#d4f088"
        stroke="#15803d"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Outer rind highlight */}
      <path
        d="M8 16 A12 12 0 0 1 32 16"
        stroke="#15803d"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Pulp wedge lines */}
      <path d="M20 16 L12 8" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 16 L20 5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 16 L28 8" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 16 L8 12" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 16 L32 12" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />

      {/* 3 juice drops being squeezed */}
      <path
        d="M13 20 C 13 23, 11 24, 11 26 C 11 27.5, 12 28, 13 28 C 14 28, 15 27.5, 15 26 C 15 24, 13 23, 13 20 Z"
        fill="#fde047"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 22 C 20 26, 17.5 27.5, 17.5 30 C 17.5 32, 18.5 33, 20 33 C 21.5 33, 22.5 32, 22.5 30 C 22.5 27.5, 20 26, 20 22 Z"
        fill="#fde047"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M27 20 C 27 23, 25 24, 25 26 C 25 27.5, 26 28, 27 28 C 28 28, 29 27.5, 29 26 C 29 24, 27 23, 27 20 Z"
        fill="#fde047"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  size = 28,
  showText = true,
  textClassName = "font-extrabold text-[15px] tracking-[-0.03em]",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span className={textClassName}>
          Credit<span className="text-[#15803d]">Lime</span>
        </span>
      )}
    </span>
  );
}
