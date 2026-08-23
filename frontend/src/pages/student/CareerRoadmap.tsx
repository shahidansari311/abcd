import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Target, Loader2 } from "lucide-react";
import { PageHeader, Card, Badge, ProgressBar } from "../../components/ui";
import { stagger, fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type Status = "done" | "current" | "upcoming";

type Milestone = {
  title: string;
  status: Status;
  desc: string;
  progress?: number;
};

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
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        const [roadmapRes, profileRes] = await Promise.all([
          api.get("/student/roadmap"),
          api.get("/student/profile")
        ]);
        setMilestones(roadmapRes || []);
        setReadiness(profileRes.readinessScore || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

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
            <p className="text-lg font-semibold text-primary">{readiness}%</p>
          </div>
        </Card>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary size-8" /></div>
      ) : (
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
      )}
    </div>
  );
}
