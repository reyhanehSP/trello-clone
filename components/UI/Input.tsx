import React, { forwardRef } from "react";
import styles from "./UI.module.scss";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      onKeyDown,
      placeholder,
      autoFocus,
      className = "",
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`${styles.input} ${className}`}
      />
    );
  }
);

Input.displayName = "Input";
