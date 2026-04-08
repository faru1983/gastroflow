import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "tertiary" | "error" | "success" | "outline" | "warning";
  size?: "sm" | "md";
}

function Badge({
  variant = "primary",
  size = "sm",
  children,
  className = "",
  ...props
}: BadgeProps) {
  const variants: Record<string, string> = {
    primary: "bg-primary/15 text-primary",
    secondary: "bg-secondary-container text-on-secondary-container",
    tertiary: "bg-tertiary/15 text-tertiary",
    error: "bg-error/15 text-error",
    success: "bg-success/15 text-success",
    warning: "bg-tertiary/20 text-tertiary",
    outline: "border border-outline-variant text-on-surface-variant",
  };

  const sizes: Record<string, string> = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps };
