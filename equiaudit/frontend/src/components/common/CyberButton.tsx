import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";

type Props = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function CyberButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const baseStyles = "group relative inline-flex items-center justify-center font-bold uppercase tracking-[0.15em] transition-all duration-300 overflow-hidden outline-none rounded-sm";
  
  const variants = {
    primary: "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgb(var(--color-primary)/0.2)]",
    secondary: "bg-secondary/10 border border-secondary/40 text-secondary hover:bg-secondary/20 hover:border-secondary hover:shadow-[0_0_20px_rgb(var(--color-secondary)/0.2)]",
    danger: "bg-error/10 border border-error/40 text-error hover:bg-error/20 hover:border-error hover:shadow-[0_0_20px_rgb(var(--color-error)/0.2)]",
    outline: "border border-border text-text-primary hover:border-primary/50 hover:text-primary bg-transparent",
    ghost: "border-transparent text-muted hover:text-text-primary hover:bg-surface-elevated bg-transparent",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-current/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-scan-line pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">{props.children}</span>
    </motion.button>
  );
}
