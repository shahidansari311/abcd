import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock, Calendar, Target } from "lucide-react";
import { PageHeader, Card, Badge } from "../../components/ui";
import { CompatibilityScore, BarList } from "../../components/charts";
import { fadeUp } from "../../lib/motion";

const focusAreas = ["Machine Learning", "Cloud", "Statistics", "Communication"];

export default function WhatIfSimulator() {
  const [hours, setHours] = useState(10);
  const [focus, setFocus] = useState(0);
  const [months, setMonths] = useState(6);

  const projected = useMemo(() => {
    const base = 58;
    const effort = (hours / 40) * (months / 12) * 60;
    return Math.min(99, Math.round(base + effort));
  }, [hours, months]);

  const skills = useMemo(() => {
    const boost = (hours * months) / 12;
    const focusBonus = (i: number) => (i === focus ? 18 : 0);
    return [
      { label: "Machine Learning", value: Math.min(99, Math.round(45 + boost + focusBonus(0))) },
      { label: "Cloud (AWS)", value: Math.min(99, Math.round(38 + boost + focusBonus(1))) },
      { label: "Statistics", value: Math.min(99, Math.round(58 + boost * 0.6 + focusBonus(2))) },
      { label: "Communication", value: Math.min(99, Math.round(84 + boost * 0.3 + focusBonus(3))) },
    ];
  }, [hours, months, focus]);

  return (
    <div>
      <PageHeader
        title="What-if simulator"
        subtitle="Adjust your commitment and watch your projected readiness update live."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full space-y-7">
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-ink">
                <span className="inline-flex items-center gap-2"><Clock size={16} className="text-primary" /> Hours per week</span>
                <span className="text-primary">{hours}h</span>
              </label>
              <input
                type="range" min={2} max={40} step={1} value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-ink">
                <span className="inline-flex items-center gap-2"><Calendar size={16} className="text-primary" /> Timeframe</span>
                <span className="text-primary">{months} months</span>
              </label>
              <input
                type="range" min={1} max={18} step={1} value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                <Target size={16} className="text-primary" /> Primary focus area
              </label>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setFocus(i)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      focus === i ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink hover:bg-tint"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h3 className="font-semibold text-ink">Projected outcome</h3>
            </div>
            <div className="mt-4 grid place-items-center">
              <CompatibilityScore value={projected} size={160} label="Projected readiness" />
              <Badge tone="primary">
                {projected >= 85 ? "Target-ready" : projected >= 70 ? "Nearly there" : "Keep building"}
              </Badge>
            </div>
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-medium text-ink">Projected skill levels</h4>
              <BarList data={skills} />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
