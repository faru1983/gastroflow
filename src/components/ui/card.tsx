import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive";
  padding?: "sm" | "md" | "lg" | "none";
}

function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
  ...props
}: CardProps) {
  const variants: Record<string, string> = {
    default: "bg-surface-container",
    elevated: "bg-surface-container-high",
    interactive:
      "bg-surface-container hover:bg-surface-container-high transition-colors duration-150 cursor-pointer",
  };

  const paddings: Record<string, string> = {
    none: "",
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  };

  return (
    <div
      className={`rounded-[8px] ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
export type { CardProps };
