import { Link } from "react-router";
import { motion } from "framer-motion";
import { Briefcase, Users, CalendarCheck, Trophy, ArrowUpRight } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Badge, Avatar, Button } from "../../components/ui";
import { TrendChart, BarList } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp } from "../../lib/motion";

const applications = [12, 18, 15, 24, 30, 28, 41, 38, 52, 47, 61, 58];

const stages = [
  { label: "Sourced", value: 46 },
  { label: "Screening", value: 28 },
  { label: "Interview", value: 14 },
  { label: "Offer", value: 6 },
  { label: "Hired", value: 3 },
];

const candidates = [
  { id: 1, name: "Amara Okafor", role: "ML Research Intern", match: 96 },
  { id: 1, name: "Daniel Reyes", role: "Data Engineer", match: 92 },
  { id: 1, name: "Priya Nair", role: "Frontend Engineer", match: 89 },
  { id: 1, name: "Lukas Meyer", role: "Product Analyst", match: 85 },
];

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Employer Dashboard"
        subtitle="Your hiring activity at a glance"
        action={
          <Link to="/industry/post">
            <Button>Post opportunity</Button>
          </Link>
        }
      />

      <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <GridItem>
          <StatCard label="Active postings" value={<CountUp to={9} />} delta="+2 this month" icon={<Briefcase size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Candidates in pipeline" value={<CountUp to={97} />} delta="+18 this week" icon={<Users size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Interviews scheduled" value={<CountUp to={14} />} delta="5 upcoming" icon={<CalendarCheck size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Hires this quarter" value={<CountUp to={6} />} delta="+3 vs last" icon={<Trophy size={20} />} />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Applications over time</h2>
              <Badge tone="accent">Last 12 months</Badge>
            </div>
            <TrendChart data={applications} height={220} />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Pipeline overview</h2>
            <BarList data={stages} />
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Top matched candidates</h2>
            <Link to="/industry/candidates" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-line">
            {candidates.map((c, i) => (
              <Link
                key={i}
                to={`/industry/candidates/${c.id}`}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-tint/40 rounded-xl px-2"
              >
                <Avatar name={c.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{c.name}</p>
                  <p className="truncate text-sm text-ink-soft">{c.role}</p>
                </div>
                <Badge tone="primary">{c.match}% match</Badge>
                <ArrowUpRight size={18} className="text-ink-soft" />
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
