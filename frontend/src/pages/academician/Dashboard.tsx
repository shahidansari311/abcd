import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Calendar,
  ArrowRight,
  Building2,
} from "lucide-react";
import {
  PageHeader,
  Grid,
  GridItem,
  StatCard,
  Card,
  GlassCard,
  Badge,
  Button,
} from "../../components/ui";
import { TrendChart } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp, stagger } from "../../lib/motion";

import { useState, useEffect } from "react";
import { api } from "../../lib/api";

type Opportunity = {
  _id: string;
  title: string;
  company: string;
  tags: string[];
  match: number;
};

type Stats = {
  activeCollaborations: number;
  publications: number;
  studentsMentored: number;
  grantFunding: number;
  researchImpact: number[];
};

const schedule = [
  { time: "Today, 14:00", label: "Kickoff call — NordVind pilot", tone: "primary" as const },
  { time: "Tomorrow, 10:30", label: "PhD progress review — S. Okoye", tone: "tint" as const },
  { time: "Fri, 09:00", label: "Grant panel — Horizon Europe", tone: "accent" as const },
  { time: "Mon, 16:00", label: "Paper revision deadline", tone: "warning" as const },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, oppsRes] = await Promise.all([
          api.get("/academician/dashboard"),
          api.get("/opportunities/all")
        ]);

        if (statsRes) setStats(statsRes);
        
        if (oppsRes) {
          // Map backend opportunities to expected UI format
          const formattedOpps = oppsRes.slice(0, 3).map((o: any) => ({
            _id: o._id,
            title: o.title,
            company: o.industryPartner?.companyName || "Industry Partner",
            tags: o.requiredSkills ? o.requiredSkills.slice(0, 3).map((s: any) => s.skillName) : [],
            match: Math.floor(Math.random() * 20) + 80 // Mock match score between 80-99
          }));
          setOpportunities(formattedOpps);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-ink-soft">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, Dr. Reyes"
        subtitle="Your research and collaboration activity at a glance."
        action={
          <Link to="/academician/discovery">
            <Button variant="primary">Discover opportunities</Button>
          </Link>
        }
      />

      <Grid className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <GridItem>
          <StatCard
            label="Active collaborations"
            value={<CountUp to={stats?.activeCollaborations || 0} />}
            delta="+2 this quarter"
            icon={<Users className="size-5" />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Publications"
            value={<CountUp to={stats?.publications || 132} />}
            delta="+5 this year"
            icon={<BookOpen className="size-5" />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Students mentored"
            value={<CountUp to={stats?.studentsMentored || 41} />}
            delta="9 active"
            icon={<GraduationCap className="size-5" />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Grant funding"
            value={<CountUp to={stats?.grantFunding || 2.4} prefix="$" suffix="M" />}
            delta="+$480K"
            icon={<DollarSign className="size-5" />}
          />
        </GridItem>
      </Grid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <Card className="rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-ink font-semibold">Research impact</h3>
                <p className="text-ink-soft text-sm">Citations over the last 12 months</p>
              </div>
              <Badge tone="accent">+18% YoY</Badge>
            </div>
            <TrendChart
              data={stats?.researchImpact || [820, 910, 880, 1040, 1120, 1090, 1210, 1330, 1290, 1420, 1560, 1680]}
            />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <GlassCard className="rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="size-5 text-primary" />
              <h3 className="text-ink font-semibold">Upcoming</h3>
            </div>
            <ul className="space-y-3">
              {schedule.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <Badge tone={item.tone}>{item.time}</Badge>
                  <span className="text-sm text-ink">{item.label}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ink font-semibold text-lg">Open industry opportunities</h3>
          <Link
            to="/academician/discovery"
            className="text-primary text-sm inline-flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <Grid className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((op) => (
            <GridItem key={op._id}>
              <Card hover className="rounded-2xl p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-ink-soft text-sm">
                    <Building2 className="size-4" />
                    {op.company}
                  </div>
                  <Badge tone="primary">{op.match}% match</Badge>
                </div>
                <h4 className="text-ink font-medium mb-3 flex-1">{op.title}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {op.tags.map((t) => (
                    <Badge key={t} tone="tint">
                      {t}
                    </Badge>
                  ))}
                </div>
                <Link to="/academician/discovery">
                  <Button variant="outline" size="sm">
                    Express interest
                  </Button>
                </Link>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </motion.div>
    </div>
  );
}
