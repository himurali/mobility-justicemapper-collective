
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "lg";
  variant?: "default" | "outline";
  className?: string;
}

const btnBase =
  "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50";

const sizes = {
  sm: "h-9 px-4 py-1 text-base",
  lg: "h-12 px-8 py-3 text-lg",
};

const variants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50",
};

const Button: React.FC<ButtonProps> = ({
  size = "sm",
  variant = "default",
  className = "",
  ...rest
}) => (
  <button
    className={`${btnBase} ${sizes[size]} ${variants[variant]} ${className}`}
    {...rest}
  />
);

export default Button;
