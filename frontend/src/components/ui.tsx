import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "../lib/motion";

/* ---------------- Button ---------------- */
type BtnVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass";
type BtnSize = "sm" | "md" | "lg";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:pointer-events-none";
const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-primary text-white shadow-card hover:bg-primary-dark hover:shadow-glass",
  secondary: "bg-accent text-primary-dark hover:brightness-95",
  outline: "border border-line bg-white/70 text-ink hover:border-primary hover:text-primary",
  ghost: "text-ink-soft hover:bg-tint/60 hover:text-primary",
  danger: "bg-error text-white hover:brightness-110",
  glass: "glass text-ink hover:shadow-glass",
};
const btnSizes: Record<BtnSize, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

/* ---------------- Cards ---------------- */
export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: "0 12px 32px rgba(46,111,64,0.15)" } : undefined}
      className={`rounded-2xl border border-line bg-surface p-6 shadow-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl p-6 ${className}`}>{children}</div>;
}

/* ---------------- Badge / Tag ---------------- */
export function Badge({
  children,
  tone = "tint",
}: {
  children: ReactNode;
  tone?: "tint" | "primary" | "warning" | "error" | "accent";
}) {
  const tones = {
    tint: "bg-tint text-primary-dark",
    primary: "bg-primary text-white",
    accent: "bg-accent/25 text-primary-dark",
    warning: "bg-[#C9A227]/15 text-[#8a6f11]",
    error: "bg-error/12 text-error",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

/* ---------------- ProgressBar ---------------- */
export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-line ${className}`}>
      <motion.div
        className="h-full rounded-full bg-[linear-gradient(90deg,#CFFFDC,#2E6F40)]"
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-tint font-semibold text-primary-dark"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

/* ---------------- Section header + grid helpers ---------------- */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Grid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

export function GridItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/* ---------------- StatCard ---------------- */
export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <Card hover className="flex items-start justify-between">
      <div>
        <p className="text-sm text-ink-soft">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{value}</p>
        {delta && <p className="mt-1 text-xs font-semibold text-primary">{delta}</p>}
      </div>
      {icon && <span className="grid size-11 place-items-center rounded-xl bg-tint text-primary">{icon}</span>}
    </Card>
  );
}

/* ---------------- EmptyState ---------------- */
export function EmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center py-16 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-tint text-primary">{icon}</span>
      <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}
