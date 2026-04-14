import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold text-on-surface-variant px-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            min-h-[100px] w-full rounded-[12px] bg-surface-container-high text-sm text-on-surface 
            placeholder:text-outline/60 transition-all duration-200 outline-none p-4
            border border-transparent focus:border-primary/20 focus:bg-surface-container-highest
            disabled:opacity-50 disabled:cursor-not-allowed resize-none
            ${error ? "border-error/40 bg-error/5" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-[10px] font-medium text-error px-1">{error}</span>}
        {hint && !error && (
          <span className="text-[10px] text-on-surface-variant px-1 opacity-70">{hint}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
