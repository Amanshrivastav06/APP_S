import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", onChange, readOnly, value, defaultValue, ...rest },
    ref
  ) => {
    const isControlled = value !== undefined && defaultValue === undefined;
    const computedReadOnly = isControlled && !onChange && !readOnly ? true : readOnly;

    if (isControlled && !onChange && !readOnly && process.env.NODE_ENV !== "production") {
      console.warn(
        "[Input] `value` provided without `onChange`. Setting readOnly to avoid React warning."
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        onChange={onChange}
        readOnly={computedReadOnly}
        value={value}
        defaultValue={defaultValue}
        {...rest}
      />
    );
  }
);
Input.displayName = "Input";
