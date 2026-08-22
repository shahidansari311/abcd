import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PageHeader, Card, Badge, Button, ProgressBar } from "../../components/ui";
import { EASE } from "../../lib/motion";

const STEPS = ["Basics", "Requirements", "Review"];

const inputClass =
  "w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary";

export default function PostOpportunity() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Internship");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>(["Python", "PyTorch"]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("0-2 years");
  const [salary, setSalary] = useState("");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };

  return (
    <div>
      <PageHeader title="Post an Opportunity" subtitle="Create a new listing in three quick steps" />

      <Card className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={`grid size-8 place-items-center rounded-full text-sm font-semibold transition-colors ${
                    i <= step ? "bg-primary text-white" : "bg-tint text-ink-soft"
                  }`}
                >
                  {i < step ? <Check size={16} /> : i + 1}
                </span>
                <span className={`text-sm font-medium ${i === step ? "text-ink" : "text-ink-soft"}`}>{s}</span>
              </div>
            ))}
          </div>
          <ProgressBar value={((step + 1) / STEPS.length) * 100} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Role title</label>
                  <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. ML Research Intern" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Type</label>
                    <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
                      <option>Internship</option>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Research collaboration</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Location</label>
                    <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote / Austin, TX" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Description</label>
                  <textarea
                    className={`${inputClass} min-h-32 resize-y`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the role, team and what candidates will work on..."
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Required skills</label>
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill and press Enter"
                    />
                    <Button variant="outline" onClick={addSkill}>
                      <Plus size={16} /> Add
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 rounded-full bg-tint px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
                        {s}
                        <button onClick={() => setSkills(skills.filter((x) => x !== s))} className="hover:text-error">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Experience</label>
                    <select className={inputClass} value={experience} onChange={(e) => setExperience(e.target.value)}>
                      <option>0-2 years</option>
                      <option>2-4 years</option>
                      <option>4-6 years</option>
                      <option>6+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Salary range</label>
                    <input className={inputClass} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="$90k - $120k" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-line bg-bg p-5">
                  <h3 className="text-lg font-semibold text-ink">{title || "Untitled role"}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone="primary">{type}</Badge>
                    {location && <Badge tone="tint">{location}</Badge>}
                    <Badge tone="accent">{experience}</Badge>
                    {salary && <Badge tone="tint">{salary}</Badge>}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                    {description || "No description provided."}
                  </p>
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Required skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <Badge key={s} tone="tint">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft size={16} /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
              Continue <ArrowRight size={16} />
            </Button>
          ) : (
            <Button variant="secondary">
              <Check size={16} /> Publish
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
