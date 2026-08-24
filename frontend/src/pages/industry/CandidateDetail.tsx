import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { MessageSquare, UserPlus, ShieldCheck } from "lucide-react";
import { PageHeader, Card, Badge, Avatar, Button } from "../../components/ui";
import { CompatibilityScore, RadarChart } from "../../components/charts";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

const skills = [
  { label: "Python", value: 95 },
  { label: "PyTorch", value: 88 },
  { label: "NLP", value: 84 },
  { label: "Research", value: 92 },
  { label: "Comms", value: 76 },
  { label: "Systems", value: 70 },
];

const credentials = [
  { name: "M.S. Computer Science", issuer: "Stanford University" },
  { name: "Deep Learning Specialization", issuer: "DeepLearning.AI" },
  { name: "Published: EMNLP 2025", issuer: "Peer reviewed" },
];

const experience = [
  { role: "ML Research Intern", org: "OpenLab", period: "2025 — Present" },
  { role: "Teaching Assistant, NLP", org: "Stanford University", period: "2024 — 2025" },
  { role: "Software Engineer Intern", org: "Brightwave", period: "Summer 2024" },
];

export default function CandidateDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/industry/candidates/${id}`)
        .then(setProfile)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center text-ink-soft">Loading candidate profile...</div>;
  if (!profile) return <div className="p-8 text-center text-ink-soft">Candidate not found</div>;

  const studentName = `${profile.student?.firstName} ${profile.student?.lastName}`;
  const skillsData = profile.skills?.map((s: any) => ({
    subject: s.name,
    A: s.score,
    B: 80, // Target score placeholder
    fullMark: 100
  })) || [];

  const verifiedSkills = profile.skills?.filter((s: any) => s.isVerified) || [];

  return (
    <div>
      <PageHeader title="Candidate Profile" subtitle={`Candidate ID: ${id}`} />

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Card className="flex flex-wrap items-center gap-5">
          <Avatar name={studentName} size={72} />
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-ink">{studentName}</h2>
            <p className="text-ink-soft">{profile.student?.major || "Major Undefined"} • {profile.student?.graduationYear || "Year Undefined"}</p>
            <p className="mt-1 text-sm">{profile.student?.bio}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="accent">Available</Badge>
              <Badge tone="tint">Remote</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <MessageSquare size={16} /> Message
            </Button>
            <Button>
              <UserPlus size={16} /> Add to pipeline
            </Button>
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="flex flex-col items-center">
            <h3 className="mb-4 self-start text-lg font-semibold text-ink">Match score</h3>
            <CompatibilityScore value={96} label="ML Research Intern" />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card className="flex flex-col items-center">
            <h3 className="mb-2 self-start text-lg font-semibold text-ink">Skills profile</h3>
            <div className="h-[300px] w-full">
              {skillsData.length > 0 ? <RadarChart data={skillsData} /> : <p className="text-sm text-ink-soft">No skills data.</p>}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink">Verified skills</h3>
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {verifiedSkills.length > 0 ? verifiedSkills.map((c: any) => (
                <motion.div key={c.name} variants={fadeUp} className="flex items-center gap-3 rounded-xl border border-line bg-bg p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-tint text-primary">
                    <ShieldCheck size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{c.name}</p>
                    <p className="truncate text-sm text-ink-soft">Score: {c.score}</p>
                  </div>
                  <Badge tone="primary">Verified</Badge>
                </motion.div>
              )) : (
                <p className="text-sm text-ink-soft">No verified skills yet.</p>
              )}
            </motion.div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink">Experience</h3>
            <div className="relative space-y-6 pl-6">
              <span className="absolute left-1.5 top-1 h-full w-px bg-line" />
              {experience.map((e) => (
                <div key={e.role} className="relative">
                  <span className="absolute -left-[19px] top-1 size-3 rounded-full border-2 border-surface bg-primary" />
                  <p className="font-semibold text-ink">{e.role}</p>
                  <p className="text-sm text-ink-soft">{e.org}</p>
                  <p className="text-xs text-ink-soft">{e.period}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
