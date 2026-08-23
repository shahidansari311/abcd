import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Briefcase, Users, CalendarCheck, Trophy, ArrowUpRight } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Badge, Avatar, Button } from "../../components/ui";
import { TrendChart, BarList } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type DashboardStats = {
  activePostings: number;
  pipelineCount: number;
  interviewsCount: number;
  hiresCount: number;
  applicationsTrend: number[];
};

const candidates = [
  { id: 1, name: "Amara Okafor", role: "ML Research Intern", match: 96 },
  { id: 1, name: "Daniel Reyes", role: "Data Engineer", match: 92 },
  { id: 1, name: "Priya Nair", role: "Frontend Engineer", match: 89 },
  { id: 1, name: "Lukas Meyer", role: "Product Analyst", match: 85 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/industry/dashboard");
        if (res) {
          setStats(res);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stages = [
    { label: "Sourced", value: stats?.pipelineCount || 0 },
    { label: "Screening", value: Math.floor((stats?.pipelineCount || 0) * 0.5) }, // Mock logic for visual
    { label: "Interview", value: stats?.interviewsCount || 0 },
    { label: "Offer", value: Math.floor((stats?.interviewsCount || 0) * 0.4) }, // Mock logic
    { label: "Hired", value: stats?.hiresCount || 0 },
  ];

  if (loading) {
    return <div className="p-8 text-center text-ink-soft">Loading dashboard...</div>;
  }

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
          <StatCard label="Active postings" value={<CountUp to={stats?.activePostings || 0} />} delta="Live now" icon={<Briefcase size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Candidates in pipeline" value={<CountUp to={stats?.pipelineCount || 0} />} delta="Total tracking" icon={<Users size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Interviews scheduled" value={<CountUp to={stats?.interviewsCount || 0} />} delta="Active phase" icon={<CalendarCheck size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Hires" value={<CountUp to={stats?.hiresCount || 0} />} delta="Success rate" icon={<Trophy size={20} />} />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Applications over time</h2>
              <Badge tone="accent">Last 12 months</Badge>
            </div>
            <TrendChart data={stats?.applicationsTrend || [0,0,0,0]} height={220} />
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
