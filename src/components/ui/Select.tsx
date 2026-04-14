import { type SelectHTMLAttributes, forwardRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  options: { label: string; value: string | number }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, leftIcon, options, className = "", id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            className={`
              h-11 w-full rounded-[12px] bg-surface-container-high text-sm text-on-surface 
              appearance-none transition-all duration-200 outline-none
              border border-transparent focus:border-primary/20 focus:bg-surface-container-highest
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? "pl-10" : "px-4"}
              pr-10
              ${error ? "border-error/40 bg-error/5" : ""}
              ${className}
            `}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none group-focus-within:text-primary transition-colors">
            <ChevronDown size={18} />
          </div>
        </div>
        {error && <span className="text-[10px] font-medium text-error px-1">{error}</span>}
        {hint && !error && (
          <span className="text-[10px] text-on-surface-variant px-1 opacity-70">{hint}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
