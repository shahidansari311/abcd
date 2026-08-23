import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, BookOpen, Landmark, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { api } from "../../lib/api";

const roles = [
  { key: "student", icon: GraduationCap, name: "Student", desc: "Grow skills & find opportunities" },
  { key: "industry", icon: Building2, name: "Industry", desc: "Hire verified talent" },
  { key: "academician", icon: BookOpen, name: "Academician", desc: "Collaborate & research" },
  { key: "institution_admin", icon: Landmark, name: "Institution", desc: "Track cohort outcomes" },
];

const field =
  "w-full rounded-lg border border-line bg-white/80 px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/60 focus:border-primary focus:ring-4 focus:ring-primary/15";

export default function Register() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const finish = async () => {
    setError("");
    setStatus("loading");
    try {
      let firstName = name;
      let lastName = "";
      if (name.includes(" ")) {
        const parts = name.split(" ");
        firstName = parts[0];
        lastName = parts.slice(1).join(" ");
      }
      
      const payload = {
        email,
        password,
        role,
        firstName,
        lastName
      };

      const data = await api.post("/auth/register", payload);
      localStorage.setItem("token", data.tokens.accessToken);
      localStorage.setItem("role", data.user.role);
      
      setStatus("success");
      setTimeout(() => nav(`/${role ?? "student"}`), 1000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setStatus("idle");
    }
  };

  const steps = ["Role", "Details", "Confirm"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="glass rounded-2xl p-7 md:p-9"
    >
      {status === "success" ? (
        <div className="flex flex-col items-center py-10 text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="grid size-20 place-items-center rounded-full bg-primary text-white">
            <Check size={40} />
          </motion.span>
          <h2 className="mt-5 text-xl font-semibold text-ink">Account created!</h2>
          <p className="mt-1 text-sm text-ink-soft">Taking you to your dashboard…</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink-soft">Join the academia–industry ecosystem.</p>

          {/* Stepper */}
          <div className="mt-6 flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-colors ${i <= step ? "bg-primary text-white" : "bg-line text-ink-soft"}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
                    <motion.div className="absolute inset-y-0 left-0 bg-primary" animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-7 min-h-[240px]">
            <AnimatePresence mode="wait" custom={dir}>
              {step === 0 && (
                <motion.div key="s0" custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 40 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 gap-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const active = role === r.key;
                    return (
                      <motion.button
                        key={r.key}
                        onClick={() => setRole(r.key)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{ scale: active ? 1.03 : 1 }}
                        className={`rounded-xl border p-4 text-left transition-colors ${active ? "border-primary bg-tint/60 shadow-glass" : "border-line bg-white/70 hover:border-accent"}`}
                      >
                        <span className={`grid size-10 place-items-center rounded-lg ${active ? "bg-primary text-white" : "bg-tint text-primary"}`}>
                          <Icon size={18} />
                        </span>
                        <p className="mt-3 font-semibold text-ink">{r.name}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">{r.desc}</p>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 40 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
                    <input className={field} placeholder="Jordan Lee" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
                    <input className={field} placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
                    <input type="password" className={field} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 40 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="rounded-xl border border-line bg-white/70 p-4">
                    <p className="text-sm text-ink-soft">Registering as</p>
                    <p className="text-lg font-semibold capitalize text-ink">{role ?? "—"}</p>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-ink-soft">
                    <input type="checkbox" defaultChecked className="mt-0.5 size-4 rounded border-line accent-primary" />
                    I agree to the Terms of Service and Privacy Policy.
                  </label>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }} exit={{ opacity: 0 }} transition={{ x: { duration: 0.4 } }} className="text-sm font-medium text-error">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button onClick={() => go(step - 1)} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-primary">
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={(step === 0 && !role) || (step === 1 && (!name || !email || password.length < 8))}
                onClick={() => go(step + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-dark disabled:opacity-50"
              >
                Continue <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={finish} 
                disabled={status !== "idle"}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-dark disabled:opacity-90"
              >
                {status === "loading" ? "Creating..." : "Create account"} {status !== "loading" && <Check size={16} />}
              </motion.button>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}
    </motion.div>
  );
}
