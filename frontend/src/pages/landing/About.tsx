import { Link } from "react-router";
import { motion } from "framer-motion";
import { Leaf, Target, Users, Sparkles, ArrowRight } from "lucide-react";
import AnimatedBackground from "../../components/AnimatedBackground";
import CountUp from "../../components/CountUp";
import { fadeUp, stagger } from "../../lib/motion";

const values = [
  { icon: Leaf, title: "Organic growth", desc: "Careers grow like ecosystems — nurtured with the right signals at the right time." },
  { icon: Target, title: "Data-forward", desc: "Every recommendation is grounded in real skill data and live market demand." },
  { icon: Users, title: "Collaborative", desc: "Students, industry, faculty, and institutions moving as one connected system." },
  { icon: Sparkles, title: "Trustworthy", desc: "Verifiable credentials employers can rely on, owned by the learner." },
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24">
        <AnimatedBackground variant="light" />
        <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" className="text-4xl font-bold tracking-tight text-ink md:text-6xl">
            Building the bridge between <span className="bg-[linear-gradient(120deg,#2E6F40,#68BA7F)] bg-clip-text text-transparent">education and opportunity</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="mt-6 text-lg text-ink-soft">
            SkillBridge exists to make the path from learning to career transparent, measurable, and fair — for every learner and every institution.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 md:px-8">
        <div className="grid gap-6 rounded-2xl border border-line bg-surface p-8 shadow-card sm:grid-cols-3 md:p-12">
          {[{ to: 48000, s: "+", l: "Learners guided" }, { to: 1200, s: "+", l: "Industry partners" }, { to: 94, s: "%", l: "Placement uplift" }].map((x) => (
            <div key={x.l} className="text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl"><CountUp to={x.to} suffix={x.s} /></p>
              <p className="mt-2 text-sm text-ink-soft">{x.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">What we stand for</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">Our values</h2>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <motion.div key={v.title} variants={fadeUp} whileHover={{ y: -4 }} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
                <span className="grid size-12 place-items-center rounded-xl bg-tint text-primary"><Icon size={22} /></span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <AnimatedBackground variant="vivid" />
        <div className="relative mx-auto max-w-2xl px-5 text-center text-white">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Ready to grow with us?</h2>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 font-semibold text-primary shadow-glass transition-transform hover:scale-105">
            Get started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
