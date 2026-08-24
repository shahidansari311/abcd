import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Building2, Gauge, Target, Activity, X as XIcon, Check } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Badge, Avatar, Button } from "../../components/ui";
import { TrendChart, BarList } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

export default function Dashboard() {
  const [gaps, setGaps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    interventionType: "Workshop",
    targetSkill: "",
    expectedImpact: ""
  });

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

  const handleRecordIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/institution/interventions", formData);
      setSuccessMsg("Intervention recorded successfully.");
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg("");
        setFormData({ interventionType: "Workshop", targetSkill: "", expectedImpact: "" });
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Institution Dashboard"
        subtitle="Placement and readiness insights across your campus"
        action={
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            <Activity size={16} /> Record Intervention
          </Button>
        }
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">Record Intervention</h2>
              <button onClick={() => setShowModal(false)} className="text-ink-soft hover:text-error">
                <XIcon size={20} />
              </button>
            </div>

            {successMsg ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-3 grid size-12 place-items-center rounded-full bg-primary/20 text-primary">
                  <Check size={24} />
                </div>
                <p className="font-semibold text-ink">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleRecordIntervention} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Intervention Type</label>
                  <select
                    required
                    value={formData.interventionType}
                    onChange={e => setFormData({ ...formData, interventionType: e.target.value })}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2 text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="Curriculum Update">Curriculum Update</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Mentorship Program">Mentorship Program</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Target Skill</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. System Design, React"
                    value={formData.targetSkill}
                    onChange={e => setFormData({ ...formData, targetSkill: e.target.value })}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2 text-ink focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-soft">Expected Impact</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Improve average score by 15 points in CS department"
                    value={formData.expectedImpact}
                    onChange={e => setFormData({ ...formData, expectedImpact: e.target.value })}
                    className="w-full rounded-xl border border-line bg-surface px-4 py-2 text-ink focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Intervention"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
