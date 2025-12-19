
type BrandMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function BrandMark({ className = "", size = "md" }: BrandMarkProps) {
  return (
    <span className={`font-semibold tracking-tight inline-flex items-center ${sizeMap[size]} ${className}`}>
      <span className="text-slate-50">Nxt</span>
      <span className="text-[#D4AF37]">Owner</span>
      <span className="text-slate-300">.ca</span>
    </span>
  );
}
