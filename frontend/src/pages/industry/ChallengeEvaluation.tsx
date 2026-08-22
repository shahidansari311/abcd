import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { PageHeader, Card, Badge, Avatar, Button } from "../../components/ui";
import { BarList } from "../../components/charts";
import { fadeUp, stagger } from "../../lib/motion";

const submissions = [
  { name: "Amara Okafor", challenge: "Sentiment Model Optimization", submitted: "Aug 18, 2026", auto: 92 },
  { name: "Daniel Reyes", challenge: "ETL Pipeline Design", submitted: "Aug 17, 2026", auto: 85 },
  { name: "Priya Nair", challenge: "Accessible Dashboard Build", submitted: "Aug 15, 2026", auto: 78 },
];

const rubric = ["Correctness", "Code quality", "Performance", "Documentation"];

function ScorePanel() {
  const [scores, setScores] = useState<number[]>([80, 75, 70, 85]);
  const data = rubric.map((label, i) => ({ label, value: scores[i] }));
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return (
    <div className="mt-4 rounded-xl border border-line bg-bg p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Score submission</p>
        <Badge tone="accent">Overall {overall}</Badge>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-4">
          {rubric.map((label, i) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-ink">{label}</span>
                <span className="text-ink-soft">{scores[i]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={scores[i]}
                onChange={(e) => {
                  const next = [...scores];
                  next[i] = Number(e.target.value);
                  setScores(next);
                }}
                className="w-full accent-primary"
              />
            </div>
          ))}
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">Rubric breakdown</p>
          <BarList data={data} />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Button variant="secondary" size="sm">
          <Check size={15} /> Approve
        </Button>
        <Button variant="danger" size="sm">
          <X size={15} /> Reject
        </Button>
      </div>
    </div>
  );
}

export default function ChallengeEvaluation() {
  return (
    <div>
      <PageHeader title="Challenge Evaluation" subtitle="Review and score candidate submissions" />

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
        {submissions.map((s) => (
          <motion.div key={s.name} variants={fadeUp}>
            <Card>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar name={s.name} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{s.name}</p>
                  <p className="text-sm text-ink-soft">{s.challenge}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink-soft">Submitted {s.submitted}</p>
                  <Badge tone={s.auto >= 85 ? "primary" : "warning"}>Auto-score {s.auto}</Badge>
                </div>
              </div>
              <ScorePanel />
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
