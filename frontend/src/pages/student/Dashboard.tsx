import { motion } from "framer-motion";
import { Link } from "react-router";
import { Target, Briefcase, ShieldCheck, Route, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Button, Badge } from "../../components/ui";
import { RadarChart, TrendChart, CompatibilityScore } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp, stagger } from "../../lib/motion";

const skillSnapshot = [
  { label: "Technical", value: 78 },
  { label: "Analytics", value: 64 },
  { label: "Communication", value: 82 },
  { label: "Design", value: 55 },
  { label: "Leadership", value: 48 },
  { label: "Domain", value: 70 },
];

const readiness = [42, 48, 51, 55, 60, 63, 68, 74];

const opportunities = [
  { role: "Junior Data Analyst", company: "Delta Corp", match: 92 },
  { role: "Product Analyst", company: "Northwind", match: 85 },
  { role: "BI Developer", company: "Acme Labs", match: 79 },
];

const milestones = [
  { title: "Complete System Design assessment", done: false },
  { title: "Verify SQL Fundamentals credential", done: true },
  { title: "Apply to 2 matched roles", done: false },
  { title: "Book mentor session with Dr. Ortiz", done: false },
];

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Welcome back, Maya"
        subtitle="Here's how your journey from campus to career is progressing."
        action={<Button variant="primary" size="sm"><Route size={16} /> View roadmap</Button>}
      />

      <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GridItem>
          <StatCard label="Skill readiness" value={<CountUp to={74} suffix="%" />} delta="+6% this month" icon={<Target size={18} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Applications" value={<CountUp to={8} />} delta="3 active" icon={<Briefcase size={18} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Credentials" value={<CountUp to={12} />} delta="9 verified" icon={<ShieldCheck size={18} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Roadmap progress" value={<CountUp to={58} suffix="%" />} delta="On track" icon={<Route size={18} />} />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="text-lg font-semibold text-ink">Skill snapshot</h3>
            <p className="mb-2 text-sm text-ink-soft">Your current competency across core areas.</p>
            <div className="grid place-items-center">
              <RadarChart data={skillSnapshot} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="text-lg font-semibold text-ink">Readiness over time</h3>
            <p className="mb-4 text-sm text-ink-soft">Weekly career-readiness score trend.</p>
            <TrendChart data={readiness} height={180} />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-ink-soft">8 weeks ago</span>
              <Badge tone="primary">+32 pts</Badge>
              <span className="text-ink-soft">Now</span>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Recommended opportunities</h3>
              <Link to="/student/opportunities" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                See all <ArrowRight size={14} />
              </Link>
            </div>
            <motion.ul variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {opportunities.map((o) => (
                <motion.li key={o.role} variants={fadeUp}>
                  <Link
                    to="/student/opportunities/1"
                    className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 transition-colors hover:bg-tint"
                  >
                    <div className="flex items-center gap-4">
                      <CompatibilityScore value={o.match} size={56} />
                      <div>
                        <p className="font-semibold text-ink">{o.role}</p>
                        <p className="text-sm text-ink-soft">{o.company}</p>
                      </div>
                    </div>
                    <Badge tone="primary">{o.match}% match</Badge>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="mb-4 text-lg font-semibold text-ink">Next milestones</h3>
            <ul className="space-y-3">
              {milestones.map((m) => (
                <li key={m.title} className="flex items-start gap-3">
                  {m.done ? (
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                  ) : (
                    <Circle size={20} className="mt-0.5 shrink-0 text-ink-soft" />
                  )}
                  <span className={m.done ? "text-ink-soft line-through" : "text-ink"}>{m.title}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="mt-5 w-full">Manage milestones</Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
