import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, ShieldCheck, Award, Star, RefreshCw } from "lucide-react";
import { PageHeader, Card, Avatar, Badge, ProgressBar, Button, Grid, GridItem } from "../../components/ui";
import { RadarChart } from "../../components/charts";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";
import { Link } from "react-router";

type SkillEntry = {
  _id: string;
  name: string;
  score: number;
  confidence: number;
  isVerified: boolean;
};

type SkillProfileData = {
  _id: string;
  skills: SkillEntry[];
};

type StudentData = {
  firstName: string;
  lastName: string;
  degree: string;
  institutionName?: string;
  graduationYear: number;
};

export default function SkillProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<SkillProfileData | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch both simultaneously
      const [skillData, studentData] = await Promise.all([
        api.get("/skill/profile").catch(() => null),
        api.get("/student/profile").catch(() => null)
      ]);

      if (skillData) setProfile(skillData);
      if (studentData && studentData.student) setStudent(studentData.student);
      
    } catch (err: any) {
      setError(err.message || "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const skills = profile?.skills || [];
  
  // Transform skills for radar chart
  const radar = skills.slice(0, 6).map(s => ({
    label: s.name,
    value: s.score
  }));

  // Filter verified skills for credentials mockup
  const verifiedSkills = skills.filter(s => s.isVerified);

  return (
    <div>
      <div className="flex justify-between items-start">
        <PageHeader title="Skill profile" subtitle="Your verified, always-up-to-date skill portrait." />
        <Button variant="outline" size="sm" onClick={loadData} className="mt-4 gap-2">
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-error/10 text-error text-sm font-medium">
          {error}
        </div>
      )}

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={student ? `${student.firstName} ${student.lastName}` : "Student"} size={72} />
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  {student ? `${student.firstName} ${student.lastName}` : "Your Name"}
                </h2>
                <p className="text-ink-soft">
                  {student?.degree || "No degree specified"} · {student?.institutionName || "No institution"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="primary">Class of {student?.graduationYear || "N/A"}</Badge>
                  <Badge tone="accent">Open to internships</Badge>
                </div>
              </div>
            </div>
            <Link to="/student/profile">
              <Button variant="outline" size="sm"><Pencil size={16} /> Edit profile</Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="h-full">
            <h3 className="mb-4 font-semibold text-ink">Assessed Skills</h3>
            {skills.length === 0 ? (
              <div className="text-center py-8 text-ink-soft bg-surface rounded-lg border border-dashed border-line">
                <p>No skills assessed yet.</p>
                <Link to="/student/assessment">
                  <Button variant="outline" size="sm" className="mt-4">Take an Assessment</Button>
                </Link>
              </div>
            ) : (
              <Grid className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {skills.map((s) => (
                  <GridItem key={s._id || s.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-ink font-medium">{s.name}</span>
                      <span className="text-ink-soft">{s.score}%</span>
                    </div>
                    <ProgressBar value={s.score} />
                    {s.isVerified && (
                      <span className="text-xs text-primary flex items-center gap-1 mt-1">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </GridItem>
                ))}
              </Grid>
            )}
          </Card>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink">
                <Star size={18} className="text-accent" /> Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.slice(0, 5).map((s) => (
                    <Badge key={s.name} tone="tint">{s.name}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-ink-soft">Take assessments to generate highlights.</span>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-2 font-semibold text-ink">Skill radar</h3>
              <div className="grid place-items-center min-h-[240px]">
                {radar.length >= 3 ? (
                  <RadarChart data={radar} size={240} />
                ) : (
                  <p className="text-sm text-ink-soft text-center px-4">
                    Complete at least 3 skill assessments to unlock your radar chart.
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <ShieldCheck size={18} className="text-primary" /> Verified credentials
              </h3>
              <ul className="space-y-3">
                {verifiedSkills.length > 0 ? (
                  verifiedSkills.map((c) => (
                    <li key={c.name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                      <div className="grid size-9 place-items-center rounded-xl bg-tint text-primary">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{c.name}</p>
                        <p className="text-xs text-ink-soft">SkillBridge Verified</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-ink-soft text-center py-4">
                    No verified credentials yet. 
                  </li>
                )}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
