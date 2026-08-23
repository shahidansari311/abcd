import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check, Globe, Code2 } from "lucide-react";

import { api } from "../../lib/api";

export default function Login() {
  const nav = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || pw.length < 4) {
      setError("Enter a valid email and a password of at least 4 characters.");
      return;
    }
    setError("");
    setStatus("loading");
    
    try {
      const data = await api.post("/auth/login", { email, password: pw });
      localStorage.setItem("token", data.tokens.accessToken);
      localStorage.setItem("role", data.user.role);
      setStatus("success");
      setTimeout(() => {
        const rolePath = data.user.role === 'institution_admin' ? 'institution' : data.user.role;
        nav(`/${rolePath}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
      setStatus("idle");
    }
  }

  const field =
    "w-full rounded-lg border border-line bg-white/80 px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/60 focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="glass rounded-2xl p-7 md:p-9"
    >
      <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-soft">Log in to continue to your dashboard.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-lg border border-line bg-white/70 py-2.5 text-sm font-medium text-ink transition-colors hover:border-primary">
          <Globe size={17} /> Google
        </button>
        <button className="flex items-center justify-center gap-2 rounded-lg border border-line bg-white/70 py-2.5 text-sm font-medium text-ink transition-colors hover:border-primary">
          <Code2 size={17} /> GitHub
        </button>
      </div>
      <div className="my-6 flex items-center gap-3 text-xs text-ink-soft">
        <span className="h-px flex-1 bg-line" /> or continue with email <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" className={field} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
          <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" className={`${field} pr-11`} />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-primary" aria-label="Toggle password">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }} exit={{ opacity: 0 }} transition={{ x: { duration: 0.4 } }} className="text-sm font-medium text-error">
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-soft">
            <input type="checkbox" className="size-4 rounded border-line accent-primary" /> Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={status !== "idle"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-lg bg-primary font-semibold text-white shadow-card transition-all hover:bg-primary-dark disabled:opacity-90"
        >
          <AnimatePresence mode="wait" initial={false}>
            {status === "idle" && <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Log in</motion.span>}
            {status === "loading" && <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {status === "success" && <motion.span key="o" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2"><Check size={20} /> Welcome!</motion.span>}
          </AnimatePresence>
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
