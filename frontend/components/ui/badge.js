import { cn } from "@/lib/utils";

export function Badge({ variant = "default", className, ...props }) {
  const variants = {
    default:
      "bg-primary/10 text-primary ring-primary/20",
    success:
      "bg-primary/10 text-primary ring-primary/20",
    warning:
      "bg-secondary text-secondary-foreground ring-secondary-foreground/20",
    destructive:
      "bg-destructive/10 text-destructive ring-destructive/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variants[variant] ?? variants.default,
        className
      )}
      {...props}
    />
  );
}


