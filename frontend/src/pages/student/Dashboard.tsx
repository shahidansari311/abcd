import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Target, Briefcase, ShieldCheck, Route as RouteIcon, ArrowRight, CheckCircle2, Circle, Loader } from "lucide-react";
import { Target, Briefcase, ShieldCheck, Route, ArrowRight, CheckCircle2, Circle, Loader, Flame, Shield } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Button, Badge } from "../../components/ui";
import { RadarChart, TrendChart, CompatibilityScore } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

type Milestone = { title: string; status: "done" | "current" | "upcoming"; desc: string };

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [momentum, setMomentum] = useState<any>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [studentRes, skillRes, oppRes, appsRes, roadmapRes] = await Promise.allSettled([
          api.get("/student/profile"),
          api.get("/skill/profile"),
          api.get("/student/opportunities"),
          api.get("/applications"),
          api.get("/student/roadmap"),
        ]);

        if (studentRes.status === "fulfilled" && studentRes.value?.student) setStudent(studentRes.value.student);
        if (skillRes.status === "fulfilled" && skillRes.value?.skills) setSkills(skillRes.value.skills);
        if (oppRes.status === "fulfilled" && oppRes.value) setOpportunities(oppRes.value.slice(0, 3));
        if (appsRes.status === "fulfilled" && appsRes.value) setApplications(appsRes.value);
        if (roadmapRes.status === "fulfilled" && roadmapRes.value) setMilestones(roadmapRes.value);
        const [studentRes, skillRes, oppRes, momentumRes] = await Promise.all([
          api.get("/student/profile").catch(() => null),
          api.get("/skill/profile").catch(() => null),
          api.get("/student/opportunities").catch(() => null),
          api.get("/student/momentum").catch(() => null),
        ]);

        if (studentRes?.student) setStudent(studentRes.student);
        if (skillRes?.skills) setSkills(skillRes.skills);
        if (oppRes) setOpportunities(oppRes.slice(0, 3)); // Only show top 3
        if (momentumRes) setMomentum(momentumRes);
      } catch (err) {
        console.error("Dashboard data load failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader className="animate-spin text-primary size-8" /></div>;
  }

  const skillSnapshot = skills.slice(0, 6).map(s => ({
    label: s.name,
    value: s.score
  }));

  const readinessScore = student?.readinessScore || 0;
  const verifiedCount = skills.filter(s => s.isVerified).length;
  
  // Real readiness history or fallback
  const readinessHistory = student?.readinessHistory || [];
  const readinessTrend = readinessHistory.length > 0 
    ? readinessHistory.map((h: any) => h.score) 
    : [readinessScore];
  
  // Progress calculation for milestones
  const completedMilestones = milestones.filter(m => m.status === "done").length;
  const roadmapProgress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;
  
  // Active applications (not Offer or Rejected)
  const activeApplicationsCount = applications.filter(a => a.status !== "Offer" && a.status !== "Rejected").length;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${student?.firstName || "Student"}`}
        subtitle="Here's how your journey from campus to career is progressing."
        action={
          <div className="flex gap-2">
            <Link to="/student/agent">
              <Button variant="outline" size="sm" className="gap-2">
                <Target size={16} /> Ask AI Career Agent
              </Button>
            </Link>
            <Link to="/student/roadmap">
              <Button variant="primary" size="sm" className="gap-2">
                <RouteIcon size={16} /> View roadmap
              </Button>
            </Link>
          </div>
        }
      />

      <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GridItem>
          <StatCard label="Skill readiness" value={<CountUp to={readinessScore} suffix="%" />} delta="Current Score" icon={<Target size={18} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Applications" value={<CountUp to={applications.length} />} delta={`${activeApplicationsCount} active`} icon={<Briefcase size={18} />} />
          <StatCard 
            label="Career Momentum" 
            value={<div className="flex items-center gap-1"><CountUp to={momentum?.streak || 0} /><Flame size={24} className="text-orange-500 animate-pulse" /></div>} 
            delta={momentum?.multiplier > 1 ? `${momentum.multiplier}x Hot Streak!` : `${Math.round(((momentum?.progress || 0) / (momentum?.goal || 1)) * 100)}% this week`} 
            icon={<Shield size={18} className={momentum?.shields > 0 ? "text-primary" : "text-ink-soft"} />} 
          />
        </GridItem>
        <GridItem>
          <StatCard label="Credentials" value={<CountUp to={verifiedCount} />} delta="Verified skills" icon={<ShieldCheck size={18} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Roadmap progress" value={<CountUp to={roadmapProgress} suffix="%" />} delta={milestones.length > 0 ? "Tracking" : "No roadmap"} icon={<RouteIcon size={18} />} />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="text-lg font-semibold text-ink">Skill snapshot</h3>
            <p className="mb-2 text-sm text-ink-soft">Your current competency across core areas.</p>
            <div className="grid place-items-center">
              {skillSnapshot.length >= 3 ? (
                <RadarChart data={skillSnapshot} />
              ) : (
                <p className="text-sm text-ink-soft py-10">Take more assessments to build your radar.</p>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="text-lg font-semibold text-ink">Readiness over time</h3>
            <p className="mb-4 text-sm text-ink-soft">Historical career-readiness score trend.</p>
            {readinessTrend.length > 1 ? (
              <TrendChart data={readinessTrend} height={180} />
            ) : (
              <div className="flex h-[180px] items-center justify-center text-sm text-ink-soft">
                Not enough history yet. Keep building skills!
              </div>
            )}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-ink-soft">Start</span>
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
            {opportunities.length === 0 ? (
               <p className="text-sm text-ink-soft py-4">No matched opportunities right now.</p>
            ) : (
              <motion.ul variants={stagger} initial="hidden" animate="show" className="space-y-3">
                {opportunities.map((o) => (
                  <motion.li key={o._id} variants={fadeUp}>
                    <Link
                      to={`/student/opportunities/${o._id}`}
                      className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 transition-colors hover:bg-tint"
                    >
                      <div className="flex items-center gap-4">
                        <CompatibilityScore value={o.matchScore || 85} size={56} /> 
                        <div>
                          <p className="font-semibold text-ink">{o.title}</p>
                          <p className="text-sm text-ink-soft">{o.industryPartner?.companyName || "Organization"}</p>
                        </div>
                      </div>
                      <Badge tone="primary">{o.type}</Badge>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="mb-4 text-lg font-semibold text-ink">Next milestones</h3>
            {milestones.length === 0 ? (
              <div className="text-sm text-ink-soft py-4">Generate your career roadmap to see milestones.</div>
            ) : (
              <ul className="space-y-3">
                {milestones.map((m) => (
                  <li key={m.title} className="flex items-start gap-3">
                    {m.status === "done" ? (
                      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                    ) : (
                      <Circle size={20} className="mt-0.5 shrink-0 text-ink-soft" />
                    )}
                    <span className={m.status === "done" ? "text-ink-soft line-through" : "text-ink"}>{m.title}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/student/roadmap">
              <Button variant="outline" size="sm" className="mt-5 w-full">Manage milestones</Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
