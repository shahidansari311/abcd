import { motion } from "framer-motion";
import { Check, Target } from "lucide-react";
import { PageHeader, Card, Badge, ProgressBar } from "../../components/ui";
import { stagger, fadeUp } from "../../lib/motion";

type Status = "done" | "current" | "upcoming";

const milestones: { title: string; status: Status; desc: string; progress?: number }[] = [
  { title: "Foundations", status: "done", desc: "Master programming fundamentals and core statistics." },
  { title: "Data Analytics", status: "done", desc: "Learn SQL, data cleaning, and visualization tools." },
  { title: "Machine Learning", status: "current", desc: "Build ML models and complete an applied project.", progress: 45 },
  { title: "Cloud & Deployment", status: "upcoming", desc: "Deploy models on AWS and learn MLOps basics." },
  { title: "Portfolio & Interviews", status: "upcoming", desc: "Polish portfolio, practice mock interviews, apply." },
  { title: "Data Scientist role", status: "upcoming", desc: "Land your target position in industry." },
];

const dotClass: Record<Status, string> = {
  done: "bg-primary text-white border-primary",
  current: "bg-accent text-white border-accent",
  upcoming: "bg-surface text-ink-soft border-line",
};

const toneFor: Record<Status, "primary" | "accent" | "tint"> = {
  done: "primary",
  current: "accent",
  upcoming: "tint",
};

const labelFor: Record<Status, string> = {
  done: "Done",
  current: "In progress",
  upcoming: "Upcoming",
};

export default function CareerRoadmap() {
  return (
    <div>
      <PageHeader title="Career roadmap" subtitle="Your personalized path from student to professional." />

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Card className="mb-8 flex items-center gap-4 bg-tint">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary text-white">
            <Target size={22} />
          </div>
          <div>
            <p className="text-sm text-ink-soft">Target role</p>
            <h3 className="text-lg font-semibold text-ink">Data Scientist</h3>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-ink-soft">Overall progress</p>
            <p className="text-lg font-semibold text-primary">58%</p>
          </div>
        </Card>
      </motion.div>

      <motion.ol variants={stagger} initial="hidden" animate="show" className="relative ml-3 border-l-2 border-line">
        {milestones.map((m) => (
          <motion.li key={m.title} variants={fadeUp} className="relative mb-8 pl-8 last:mb-0">
            <span
              className={`absolute -left-[13px] top-1 grid size-6 place-items-center rounded-full border-2 ${dotClass[m.status]}`}
            >
              {m.status === "done" && <Check size={13} />}
              {m.status === "current" && <span className="size-2 rounded-full bg-white" />}
            </span>
            <Card hover>
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-semibold text-ink">{m.title}</h4>
                <Badge tone={toneFor[m.status]}>{labelFor[m.status]}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{m.desc}</p>
              {m.status === "current" && m.progress !== undefined && (
                <div className="mt-3">
                  <ProgressBar value={m.progress} />
                  <p className="mt-1.5 text-xs text-ink-soft">{m.progress}% complete</p>
                </div>
              )}
            </Card>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
