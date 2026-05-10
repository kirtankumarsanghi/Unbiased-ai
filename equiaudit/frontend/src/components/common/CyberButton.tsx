import { ButtonHTMLAttributes } from "react";

import { cn } from "../../utils/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function CyberButton({
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        "px-6 py-3 border border-primary/60 text-primary uppercase tracking-widest text-xs font-semibold bg-primary/5 hover:bg-primary/15 hover:shadow-glow transition-all",
        className
      )}
    />
  );
}
