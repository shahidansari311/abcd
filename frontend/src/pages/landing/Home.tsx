import { useState } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap, Building2, BookOpen, Landmark, ArrowRight, Sparkles,
  Target, Route, ShieldCheck, BarChart3, Users, Check,
} from "lucide-react";
import AnimatedBackground from "../../components/AnimatedBackground";
import CountUp from "../../components/CountUp";
import { fadeUp, stagger, EASE } from "../../lib/motion";

const roles = [
  { icon: GraduationCap, name: "Student", tag: "Grow", to: "/student", desc: "Assess skills, close gaps, and follow an AI-guided roadmap toward the career you want." },
  { icon: Building2, name: "Industry", tag: "Hire", to: "/industry", desc: "Post opportunities, search verified talent, and run recruitment pipelines end to end." },
  { icon: BookOpen, name: "Academician", tag: "Collaborate", to: "/academician", desc: "Discover industry projects, build partnerships, and showcase a research portfolio." },
  { icon: Landmark, name: "Institution", tag: "Measure", to: "/institution", desc: "Track cohort readiness, department heatmaps, and live placement analytics." },
];
const features = [
  { icon: Target, title: "Skill Gap Intelligence", desc: "Radar-mapped competencies benchmarked against live market demand." },
  { icon: Route, title: "Career Roadmaps", desc: "Personalized, milestone-based paths that adapt as you progress." },
  { icon: ShieldCheck, title: "Skill Passport", desc: "Verifiable, employer-trusted credentials in a portable wallet." },
  { icon: BarChart3, title: "What-If Simulator", desc: "Model choices and watch projected outcomes update in real time." },
  { icon: Users, title: "Mentorship & Community", desc: "Connect learners, mentors, and recruiters around real challenges." },
  { icon: Sparkles, title: "Mock Interviews", desc: "AI-driven practice with actionable, scored feedback." },
];
const stats = [
  { to: 48000, suffix: "+", label: "Learners guided" },
  { to: 1200, suffix: "+", label: "Industry partners" },
  { to: 320, suffix: "+", label: "Partner institutions" },
  { to: 94, suffix: "%", label: "Placement uplift" },
];
const testimonials = [
  { name: "Aisha Rahman", role: "CS Undergraduate", quote: "The skill-gap radar showed me exactly what to learn next. I landed an internship in eight weeks." },
  { name: "Marcus Bell", role: "Talent Lead, Northwind", quote: "Verified skill passports cut our screening time in half. The pipeline board is a joy to run." },
  { name: "Dr. Lena Ortiz", role: "Professor, Delta University", quote: "The collaboration hub connected my lab with three industry projects this semester alone." },
  { name: "Priya Nair", role: "Placement Officer", quote: "Department heatmaps finally gave us a live picture of cohort readiness. Reporting is effortless." },
  { name: "Tomas Vidal", role: "Bootcamp Graduate", quote: "The what-if simulator helped me choose data engineering over a dead-end path. Life-changing." },
];

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-28">
      <AnimatedBackground variant="light" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur">
            <Sparkles size={15} /> Academia meets industry
          </motion.span>
          <motion.h1 variants={fadeUp} className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-6xl">
            Bridge the gap between <span className="bg-[linear-gradient(120deg,#2E6F40,#68BA7F)] bg-clip-text text-transparent">learning and careers</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            SkillBridge is the intelligent career development platform connecting students, industry, academicians, and institutions — with skill mapping, verified credentials, and adaptive roadmaps that grow with you.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/register" className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-white shadow-card transition-all hover:bg-primary-dark hover:shadow-glass">
              Start your journey <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#roles" className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/70 px-6 py-3.5 font-semibold text-ink backdrop-blur transition-colors hover:border-primary hover:text-primary">
              Explore roles
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6 text-sm text-ink-soft">
            <div className="flex -space-x-3">
              {["AR", "MB", "LO", "PN"].map((i) => (
                <span key={i} className="grid size-9 place-items-center rounded-full border-2 border-bg bg-tint text-xs font-semibold text-primary-dark">{i}</span>
              ))}
            </div>
            <span>Trusted by <strong className="text-ink">48,000+</strong> learners worldwide</span>
          </motion.div>
        </motion.div>

        <motion.div style={{ y }} initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.15 }} className="relative">
          <div className="glass rounded-2xl p-6 md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-soft">Skill readiness</p>
                <p className="text-3xl font-bold text-ink"><CountUp to={82} suffix="%" /></p>
              </div>
              <span className="rounded-full bg-tint px-3 py-1 text-xs font-semibold text-primary-dark">+12% this month</span>
            </div>
            <div className="mt-6 space-y-4">
              {[{ label: "Data Analysis", v: 88 }, { label: "Communication", v: 74 }, { label: "System Design", v: 61 }, { label: "Machine Learning", v: 69 }].map((s, i) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium text-ink">{s.label}</span><span className="text-ink-soft">{s.v}%</span></div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-line">
                    <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#CFFFDC,#2E6F40)]" initial={{ width: 0 }} whileInView={{ width: `${s.v}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.12 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-primary-dark/95 p-4 text-white">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/30"><Route size={18} /></span>
              <div className="text-sm"><p className="font-semibold">Next milestone</p><p className="text-white/70">Complete the SQL assessment to unlock Analyst track.</p></div>
            </div>
          </div>
          <div className="glass absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl px-5 py-4 sm:flex">
            <span className="grid size-10 place-items-center rounded-lg bg-primary text-white"><ShieldCheck size={18} /></span>
            <div className="text-sm"><p className="font-semibold text-ink">Verified</p><p className="text-ink-soft">3 new credentials</p></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const loop = [...testimonials, ...testimonials];
  return (
    <>
      <Hero />

      {/* Roles */}
      <section id="roles" className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">One platform</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">Built for four roles, connected as one ecosystem</h2>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <motion.div key={r.name} variants={fadeUp} whileHover={{ y: -4 }}>
                <Link to={r.to} className="group block h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-all hover:border-accent">
                  <span className="grid size-12 place-items-center rounded-xl bg-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white"><Icon size={22} /></span>
                  <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-accent">{r.tag}</span>
                  <h3 className="mt-1 text-xl font-semibold text-ink">{r.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Enter <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative overflow-hidden bg-primary-dark py-20 text-white md:py-28">
        <div className="blob" style={{ width: 400, height: 400, top: "-10%", right: "-6%", background: "#2E6F40", opacity: 0.5, animation: "drift-b 12s ease-in-out infinite" }} />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Platform</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Intelligence at every step of the journey</h2>
            <p className="mt-4 text-lg text-white/70">From first assessment to verified hire — a connected toolkit that keeps every role moving forward.</p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -4 }} className="glass-dark rounded-2xl p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent/25 text-tint"><Icon size={20} /></span>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="impact" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="grid gap-6 rounded-2xl border border-line bg-surface p-8 shadow-card sm:grid-cols-2 lg:grid-cols-4 md:p-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold tracking-tight text-primary md:text-5xl"><CountUp to={s.to} suffix={s.suffix} /></p>
              <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden py-10 md:py-16">
        <div className="mx-auto mb-10 max-w-2xl px-5 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">Voices from the ecosystem</h2>
        </div>
        <div className="relative">
          <div className="marquee-track flex w-max gap-5 px-5">
            {loop.map((t, i) => (
              <figure key={i} className="w-[320px] shrink-0 rounded-2xl border border-line bg-surface p-6 shadow-card">
                <blockquote className="text-sm leading-relaxed text-ink">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-tint text-xs font-semibold text-primary-dark">{t.name.split(" ").map((n) => n[0]).join("")}</span>
                  <div className="text-sm"><p className="font-semibold text-ink">{t.name}</p><p className="text-ink-soft">{t.role}</p></div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,#F7FBF8,transparent)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-[linear-gradient(270deg,#F7FBF8,transparent)]" />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <AnimatedBackground variant="vivid" />
        <div className="relative mx-auto max-w-3xl px-5 text-center text-white">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Your growth starts with one login</h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">Join learners, recruiters, faculty, and institutions building the bridge between education and opportunity.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 font-semibold text-primary shadow-glass transition-transform hover:scale-105">
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="glass inline-flex items-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-white transition-transform hover:scale-105">
              Log in
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/80">
            {["Free for students", "Verified credentials", "No credit card"].map((b) => (
              <span key={b} className="inline-flex items-center gap-2"><Check size={15} /> {b}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
