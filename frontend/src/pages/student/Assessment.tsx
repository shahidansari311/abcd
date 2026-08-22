import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Loader, ChevronLeft, ChevronRight, Code2, BarChart3, Database, Cpu } from "lucide-react";
import { PageHeader, Card, Badge, ProgressBar, Button, Grid, GridItem } from "../../components/ui";
import { fadeUp } from "../../lib/motion";

type Status = "Completed" | "In progress" | "Locked";

const categories: { name: string; icon: typeof Code2; status: Status; progress: number }[] = [
  { name: "Programming Fundamentals", icon: Code2, status: "Completed", progress: 100 },
  { name: "Data Analytics", icon: BarChart3, status: "In progress", progress: 62 },
  { name: "Databases & SQL", icon: Database, status: "In progress", progress: 40 },
  { name: "System Design", icon: Cpu, status: "Locked", progress: 0 },
];

const toneFor: Record<Status, "primary" | "accent" | "tint"> = {
  Completed: "primary",
  "In progress": "accent",
  Locked: "tint",
};

const questions = [
  {
    q: "Which SQL clause is used to filter groups created by GROUP BY?",
    options: ["WHERE", "HAVING", "FILTER", "ORDER BY"],
    answer: 1,
  },
  {
    q: "What does the term 'normalization' primarily reduce in a database?",
    options: ["Query speed", "Data redundancy", "Table count", "Index size"],
    answer: 1,
  },
  {
    q: "Which join returns only matching rows from both tables?",
    options: ["LEFT JOIN", "FULL OUTER JOIN", "INNER JOIN", "CROSS JOIN"],
    answer: 2,
  },
];

export default function Assessment() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const q = questions[current];

  function go(dir: number) {
    setCurrent((c) => Math.min(Math.max(c + dir, 0), questions.length - 1));
    setSelected(null);
  }

  return (
    <div>
      <PageHeader
        title="Skill assessments"
        subtitle="Measure your abilities and unlock verified credentials."
      />

      <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <GridItem key={c.name}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-tint text-primary">
                    <Icon size={20} />
                  </div>
                  <Badge tone={toneFor[c.status]}>
                    <span className="inline-flex items-center gap-1">
                      {c.status === "Completed" && <CheckCircle2 size={13} />}
                      {c.status === "In progress" && <Loader size={13} />}
                      {c.status === "Locked" && <Lock size={13} />}
                      {c.status}
                    </span>
                  </Badge>
                </div>
                <h3 className="mt-4 font-semibold text-ink">{c.name}</h3>
                <div className="mt-3">
                  <ProgressBar value={c.progress} />
                  <p className="mt-2 text-sm text-ink-soft">{c.progress}% complete</p>
                </div>
                <Button
                  variant={c.status === "Locked" ? "ghost" : "outline"}
                  size="sm"
                  className="mt-4 w-full"
                  disabled={c.status === "Locked"}
                >
                  {c.status === "Completed" ? "Review" : c.status === "Locked" ? "Locked" : "Continue"}
                </Button>
              </Card>
            </GridItem>
          );
        })}
      </Grid>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-6">
        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge tone="accent">Active assessment</Badge>
              <h3 className="mt-2 text-lg font-semibold text-ink">Databases & SQL</h3>
            </div>
            <p className="text-sm font-medium text-ink-soft">
              Question {current + 1} of {questions.length}
            </p>
          </div>

          <ProgressBar value={((current + 1) / questions.length) * 100} className="mb-6" />

          <p className="text-lg font-medium text-ink">{q.q}</p>

          <div className="mt-4 space-y-3">
            {q.options.map((opt, i) => {
              const active = selected === i;
              return (
                <button
                  key={opt}
                  onClick={() => setSelected(i)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                    active ? "border-primary bg-tint" : "border-line bg-surface hover:bg-tint"
                  }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full border text-sm font-semibold ${
                      active ? "border-primary bg-primary text-white" : "border-line text-ink-soft"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-ink">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => go(-1)} disabled={current === 0}>
              <ChevronLeft size={16} /> Prev
            </Button>
            <Button variant="primary" size="sm" onClick={() => go(1)} disabled={current === questions.length - 1}>
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
