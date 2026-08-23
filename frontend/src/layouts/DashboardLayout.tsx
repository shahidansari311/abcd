import { useState } from "react";
import { NavLink, Outlet, useLocation, Link, Navigate, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Bell, Search, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { roleNav, roleMeta, type RoleKey } from "../data/nav";
import { pageVariants } from "../lib/motion";
import { Avatar } from "../components/ui";

export default function DashboardLayout({ role }: { role: RoleKey }) {
  const navMenu = roleNav[role];
  const meta = roleMeta[role];
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-5 py-6 text-white">
        <span className="grid size-9 place-items-center rounded-xl bg-accent text-primary-dark">
          <Leaf size={18} />
        </span>
        <span className="text-lg font-bold">SkillBridge</span>
      </Link>
      <p className="px-5 pb-3 text-xs font-semibold uppercase tracking-widest text-tint/60">{meta.name}</p>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {navMenu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === meta.base}
            onClick={() => setOpen(false)}
            className="block"
          >
            {({ isActive }) => (
              <span className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors">
                {isActive && (
                  <motion.span
                    layoutId={`nav-pill-${role}`}
                    className="absolute inset-0 rounded-lg bg-tint"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? "text-primary-dark" : "text-tint/70"}`}>
                  {item.icon}
                </span>
                <span className={`relative z-10 ${isActive ? "text-primary-dark" : "text-white/80"}`}>
                  {item.label}
                </span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10"
        >
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </div>
  );

  // Protected Route Logic
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-primary-dark lg:block">{SidebarContent}</aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-primary-dark/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-primary-dark lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass" style={{ borderRadius: 0 }}>
          <div className="flex items-center gap-4 px-4 py-3 md:px-6">
            <button className="grid size-10 place-items-center rounded-lg text-ink lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="relative hidden max-w-md flex-1 items-center md:flex">
              <Search size={18} className="absolute left-3 text-ink-soft" />
              <input
                placeholder="Search…"
                className="w-full rounded-lg border border-line bg-white/70 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link to={`${meta.base}/notifications`} className="relative grid size-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-tint/60 hover:text-primary">
                <Bell size={20} />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-error" />
              </Link>
              <Link to={`${meta.base}/profile`} className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-tint/60">
                <Avatar name="Jordan Lee" size={32} />
                <span className="hidden text-sm font-medium text-ink sm:block">My Profile</span>
              </Link>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
