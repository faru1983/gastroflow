import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "tertiary" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      asChild = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-[8px] transition-all duration-150 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants: Record<string, string> = {
      primary:
        "gradient-primary text-on-primary-container hover:brightness-110 shadow-sm",
      secondary:
        "bg-secondary-container text-on-secondary-container hover:brightness-110",
      ghost:
        "bg-transparent text-on-surface-variant hover:bg-surface-container-high",
      danger: "bg-error-container text-error hover:brightness-110",
      tertiary:
        "gradient-tertiary text-on-tertiary-container hover:brightness-110",
      outline:
        "border border-outline-variant text-on-surface hover:bg-surface-container-low"
    };

    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-11 px-5 text-sm",
      icon: "h-9 w-9 p-0"
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref as any}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
            {children}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
