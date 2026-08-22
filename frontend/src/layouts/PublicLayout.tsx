import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

function Navbar() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => scrollY.on("change", (v) => setSolid(v > 32)), [scrollY]);

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "glass shadow-glass" : "bg-transparent"}`}
      style={{ borderRadius: 0 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-ink">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-white shadow-card">
            <Leaf size={18} />
          </span>
          <span className="text-lg tracking-tight">SkillBridge</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-ink-soft hover:text-primary"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-semibold text-ink-soft transition-colors hover:text-primary">
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-dark hover:shadow-glass"
          >
            Get started
          </Link>
        </div>

        <button className="grid size-10 place-items-center rounded-lg text-ink md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass overflow-hidden md:hidden">
            <div className="flex flex-col gap-1 px-5 pb-5">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-tint/60">
                  {l.label}
                </Link>
              ))}
              <Link to="/register" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white">
                Get started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function Footer() {
  const cols = {
    Platform: ["Skill Gap", "Roadmaps", "Passport", "Simulator"],
    Roles: ["Students", "Industry", "Academicians", "Institutions"],
    Company: ["About", "Careers", "Blog", "Contact"],
  };
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-primary-dark">
              <Leaf size={18} />
            </span>
            <span className="text-lg">SkillBridge</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            The academia–industry collaboration and intelligent career development platform.
          </p>
        </div>
        {Object.entries(cols).map(([title, items]) => (
          <div key={title}>
            <p className="text-sm font-semibold">{title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {items.map((it) => (
                <li key={it}>
                  <Link to="/about" className="text-tint/80 transition-colors hover:text-tint">
                    {it}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-white/50 md:flex-row md:px-8">
          <p>© 2026 SkillBridge. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-tint">Privacy</Link>
            <Link to="/about" className="hover:text-tint">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
