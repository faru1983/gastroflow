import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-on-surface-variant px-1"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              h-11 w-full rounded-[12px] bg-surface-container-high text-sm text-on-surface 
              placeholder:text-outline/60 transition-all duration-200 outline-none
              border border-transparent focus:border-primary/20 focus:bg-surface-container-highest
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? "pl-10" : "px-4"}
              ${rightIcon ? "pr-10" : "px-4"}
              ${error ? "border-error/40 bg-error/5" : ""}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-[10px] font-medium text-error px-1">{error}</span>}
        {hint && !error && (
          <span className="text-[10px] text-on-surface-variant px-1 opacity-70">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
