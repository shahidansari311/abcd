import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MailCheck, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="glass rounded-2xl p-7 md:p-9"
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-6 text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="grid size-16 place-items-center rounded-full bg-tint text-primary">
              <MailCheck size={32} />
            </motion.span>
            <h1 className="mt-5 text-xl font-semibold text-ink">Check your inbox</h1>
            <p className="mt-1.5 max-w-xs text-sm text-ink-soft">
              We sent a reset link to <strong className="text-ink">{email || "your email"}</strong>. It expires in 30 minutes.
            </p>
            <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft size={16} /> Back to login
            </Link>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-semibold text-ink">Reset your password</h1>
            <p className="mt-1 text-sm text-ink-soft">Enter your email and we'll send a reset link.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-7 space-y-5"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full rounded-lg border border-line bg-white/80 px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/60 focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white shadow-card transition-all hover:bg-primary-dark">
                <Check size={18} /> Send reset link
              </motion.button>
            </form>
            <p className="mt-6 text-center text-sm text-ink-soft">
              Remembered it?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
