import { Link } from "react-router";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import AnimatedBackground from "../../components/AnimatedBackground";

export default function Unauthorized() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 text-center">
      <AnimatedBackground variant="light" />
      <div className="relative">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto grid size-24 place-items-center rounded-3xl bg-tint text-primary shadow-glass">
          <Lock size={44} />
        </motion.div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-ink md:text-5xl">Access restricted</h1>
        <p className="mt-3 max-w-md text-lg text-ink-soft">You don't have permission to view this page. Check your role or sign in with a different account.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/70 px-6 py-3.5 font-semibold text-ink transition-colors hover:border-primary hover:text-primary">
            <ArrowLeft size={18} /> Home
          </Link>
          <Link to="/login" className="rounded-lg bg-primary px-6 py-3.5 font-semibold text-white shadow-card transition-all hover:bg-primary-dark">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
