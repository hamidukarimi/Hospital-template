import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface AdminButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
}

export const AdminButton = ({
  variant = "primary",
  children,
  className = "",
  ...props
}: AdminButtonProps) => {
  const variants = {
    primary: "bg-[#111111] text-white hover:bg-[#1A1A1A]",
    secondary: "bg-[#F7C12B] text-[#111111] hover:bg-[#f0b819]",
    ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={props.type ?? "button"}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F7C12B]/30 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </motion.button>
  );
};
