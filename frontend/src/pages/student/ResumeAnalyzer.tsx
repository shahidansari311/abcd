import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { PageHeader, Card, Button, Badge, ProgressBar } from "../../components/ui";
import { CompatibilityScore, BarList } from "../../components/charts";
import { fadeUp, stagger } from "../../lib/motion";

const categories = [
  { label: "Formatting", value: 88 },
  { label: "Keywords", value: 64 },
  { label: "Impact", value: 72 },
  { label: "Skills match", value: 79 },
];

const suggestions = [
  { text: "Add measurable metrics to your project bullet points.", tone: "warning" as const },
  { text: "Include keywords: 'machine learning', 'A/B testing'.", tone: "warning" as const },
  { text: "Strong action verbs used throughout — keep it up.", tone: "primary" as const },
  { text: "Consider a concise professional summary at the top.", tone: "accent" as const },
];

export default function ResumeAnalyzer() {
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <div>
      <PageHeader title="Resume analyzer" subtitle="Get an instant, AI-powered review of your resume." />

      {!analyzed ? (
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <div className="grid place-items-center rounded-2xl border-2 border-dashed border-line bg-surface px-6 py-16 text-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-tint text-primary">
                <UploadCloud size={30} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">Drop your resume here</h3>
              <p className="mt-1 text-sm text-ink-soft">PDF or DOCX, up to 5MB</p>
              <Button variant="primary" size="sm" className="mt-5" onClick={() => setAnalyzed(true)}>
                <FileText size={16} /> Upload &amp; analyze
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card className="h-full">
              <h3 className="mb-2 text-center font-semibold text-ink">Overall score</h3>
              <div className="grid place-items-center">
                <CompatibilityScore value={76} size={160} label="Resume strength" />
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setAnalyzed(false)}>
                Upload another
              </Button>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card className="h-full">
              <h3 className="mb-4 font-semibold text-ink">Category breakdown</h3>
              <div className="space-y-4">
                {categories.map((c) => (
                  <div key={c.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-ink">{c.label}</span>
                      <span className="text-ink-soft">{c.value}%</span>
                    </div>
                    <ProgressBar value={c.value} />
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <h4 className="mb-2 text-sm font-medium text-ink">Skill keyword coverage</h4>
                <BarList data={categories} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate="show">
            <Card className="h-full">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <Lightbulb size={18} className="text-accent" /> Suggestions
              </h3>
              <ul className="space-y-3">
                {suggestions.map((s, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-3">
                    {s.tone === "primary" ? (
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    ) : (
                      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-accent" />
                    )}
                    <div>
                      <p className="text-sm text-ink">{s.text}</p>
                      <Badge tone={s.tone}>{s.tone === "primary" ? "Looking good" : "Improve"}</Badge>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
