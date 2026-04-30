interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function LogoMark({ variant = "dark", size = "md" }: LogoProps) {
  const dimensions = size === "sm" ? 28 : size === "lg" ? 56 : 36;
  const stroke = variant === "light" ? "#FFFFFF" : "#0A1224";
  const accent = "#2D5BFF";

  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Stylized F with swoosh */}
      <path
        d="M14 12 Q 14 8 18 8 L 50 8 Q 56 8 54 13 L 50 18 L 22 18 L 22 28 L 44 28 L 42 36 L 22 36 L 22 56 L 14 56 Z"
        fill={stroke}
      />
      {/* Motion dots */}
      <circle cx="6" cy="40" r="2.5" fill={accent} />
      <circle cx="11" cy="48" r="2.5" fill={accent} />
      <circle cx="6" cy="56" r="2.5" fill={accent} />
    </svg>
  );
}

export function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const textSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-3xl" : "text-xl";
  const firstColor = variant === "light" ? "text-white" : "text-[#0A1224]";
  const callColor = "text-[#2D5BFF]";

  return (
    <div class="flex items-center gap-2">
      <LogoMark variant={variant} size={size} />
      <span class={`font-bold tracking-tight ${textSize}`}>
        <span class={firstColor}>First</span>
        <span class={callColor}>Call</span>
      </span>
    </div>
  );
}
