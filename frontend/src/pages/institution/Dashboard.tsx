import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Building2, Gauge, AlertTriangle, Target, Activity } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Badge, Avatar, Button } from "../../components/ui";
import { TrendChart, BarList } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

export default function Dashboard() {
  const [gaps, setGaps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gapsRes, statsRes] = await Promise.all([
          api.get("/institution/skill-gaps"),
          api.get("/institution/stats")
        ]);
        if (gapsRes?.gaps) setGaps(gapsRes.gaps.slice(0, 5));
        setStats(statsRes);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <PageHeader
        title="Institution Dashboard"
        subtitle="Placement and readiness insights across your campus"
        action={<Button variant="primary" size="sm"><Activity size={16} /> Record Intervention</Button>}
      />

      <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <GridItem>
          <StatCard label="Total students" value={<CountUp to={stats?.totalStudents || 0} />} delta="Active" icon={<Users size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Placement rate" value={<CountUp to={stats?.placementRate || 0} suffix="%" />} delta="Projected" icon={<TrendingUp size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Industry partners" value={<CountUp to={stats?.industryPartners || 0} />} delta="Registered" icon={<Building2 size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Avg readiness" value={<CountUp to={stats?.avgReadiness || 0} suffix="%" />} delta="Current" icon={<Gauge size={20} />} />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Academic-Industry Skill Gaps</h2>
                <p className="text-sm text-ink-soft">Difference between Industry Demand and Student Proficiency</p>
              </div>
              <Badge tone="error">Requires Attention</Badge>
            </div>
            
            <div className="mt-6 space-y-4">
              {gaps.length === 0 ? (
                <p className="py-8 text-center text-ink-soft">Loading gap analysis...</p>
              ) : (
                gaps.map((gap, i) => (
                  <div key={i} className="rounded-xl border border-line bg-surface p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className={gap.urgency === 'High' ? 'text-error' : 'text-warning'} size={18} />
                        <span className="font-semibold text-ink">{gap.skill}</span>
                        {gap.urgency === 'High' && <Badge tone="error">High Urgency</Badge>}
                      </div>
                      <span className="text-sm font-semibold text-primary-dark">Gap: {gap.gap} pts</span>
                    </div>
                    
                    <div className="relative mt-4 h-4 w-full rounded-full bg-line">
                      {/* Industry Demand (Background Bar) */}
                      <div 
                        className="absolute left-0 top-0 h-full rounded-full bg-primary/20" 
                        style={{ width: `${gap.requiredProficiency}%` }}
                      ></div>
                      
                      {/* Student Current (Foreground Bar) */}
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full ${gap.gap > 30 ? 'bg-error' : 'bg-primary'}`} 
                        style={{ width: `${gap.studentProficiency}%` }}
                      ></div>
                      
                      {/* Target Marker */}
                      <div 
                        className="absolute top-1/2 h-6 w-1 -translate-y-1/2 bg-ink" 
                        style={{ left: `${gap.requiredProficiency}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-2 flex justify-between text-xs text-ink-soft">
                      <span>Student Avg: {gap.studentProficiency}</span>
                      <span>Industry Target: {gap.requiredProficiency}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h2 className="mb-4 text-lg font-semibold text-ink">Readiness by department</h2>
            <BarList data={stats?.readinessByDept || []} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
