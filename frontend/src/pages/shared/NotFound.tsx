import { Link } from "react-router";
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";
import AnimatedBackground from "../../components/AnimatedBackground";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 text-center">
      <AnimatedBackground variant="light" />
      <div className="relative">
        <motion.div
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto grid size-24 place-items-center rounded-3xl bg-tint text-primary shadow-glass"
        >
          <Compass size={48} />
        </motion.div>
        <h1 className="mt-8 text-6xl font-bold tracking-tight text-ink">404</h1>
        <p className="mt-3 text-lg text-ink-soft">This path hasn't been mapped yet.</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-white shadow-card transition-all hover:bg-primary-dark">
          <ArrowLeft size={18} /> Back home
        </Link>
      </div>
    </div>
  );
}
