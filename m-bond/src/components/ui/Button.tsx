import type { ButtonHTMLAttributes } from "react";

type Variant = "solid" | "outline" | "danger";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant }

const styles: Record<Variant, string> = {
  solid: "bg-brand text-white hover:brightness-110",
  outline: "border border-line bg-transparent text-ink hover:bg-line/60",
  danger: "bg-danger/15 text-danger hover:bg-danger/25",
};

export function Button({ variant = "solid", className = "", type = "button", ...rest }: Props) {
  return (
    <button
      type={type}
      className={`min-h-9 rounded-lg px-3.5 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}
