import { motion } from "framer-motion";
import { Pencil, ShieldCheck, Award, Star } from "lucide-react";
import { PageHeader, Card, Avatar, Badge, ProgressBar, Button, Grid, GridItem } from "../../components/ui";
import { RadarChart } from "../../components/charts";
import { fadeUp } from "../../lib/motion";

const skillGroups = [
  {
    category: "Technical",
    skills: [
      { name: "Python", level: 82 },
      { name: "SQL", level: 76 },
      { name: "JavaScript", level: 64 },
    ],
  },
  {
    category: "Analytics",
    skills: [
      { name: "Data Visualization", level: 71 },
      { name: "Statistics", level: 58 },
      { name: "Excel / Sheets", level: 88 },
    ],
  },
  {
    category: "Professional",
    skills: [
      { name: "Communication", level: 84 },
      { name: "Teamwork", level: 79 },
      { name: "Problem Solving", level: 73 },
    ],
  },
];

const radar = [
  { label: "Technical", value: 74 },
  { label: "Analytics", value: 72 },
  { label: "Professional", value: 79 },
  { label: "Design", value: 52 },
  { label: "Leadership", value: 48 },
  { label: "Domain", value: 66 },
];

const endorsements = ["Python", "SQL", "Teamwork", "Data Viz", "Public Speaking", "Agile"];

const credentials = [
  { name: "SQL Fundamentals", issuer: "Northwind Academy" },
  { name: "Python for Data", issuer: "SkillBridge" },
  { name: "Intro to Statistics", issuer: "Delta University" },
];

export default function SkillProfile() {
  return (
    <div>
      <PageHeader title="Skill profile" subtitle="Your verified, always-up-to-date skill portrait." />

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name="Maya Chen" size={72} />
              <div>
                <h2 className="text-xl font-semibold text-ink">Maya Chen</h2>
                <p className="text-ink-soft">Data Science Undergraduate · Delta University</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="primary">Class of 2026</Badge>
                  <Badge tone="accent">Open to internships</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm"><Pencil size={16} /> Edit profile</Button>
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {skillGroups.map((group) => (
              <GridItem key={group.category}>
                <Card className="h-full">
                  <h3 className="mb-4 font-semibold text-ink">{group.category}</h3>
                  <ul className="space-y-4">
                    {group.skills.map((s) => (
                      <li key={s.name}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="text-ink">{s.name}</span>
                          <span className="text-ink-soft">{s.level}%</span>
                        </div>
                        <ProgressBar value={s.level} />
                      </li>
                    ))}
                  </ul>
                </Card>
              </GridItem>
            ))}
          </Grid>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink">
                <Star size={18} className="text-accent" /> Endorsements
              </h3>
              <div className="flex flex-wrap gap-2">
                {endorsements.map((e) => (
                  <Badge key={e} tone="tint">{e}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-2 font-semibold text-ink">Skill radar</h3>
              <div className="grid place-items-center">
                <RadarChart data={radar} size={240} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                <ShieldCheck size={18} className="text-primary" /> Verified credentials
              </h3>
              <ul className="space-y-3">
                {credentials.map((c) => (
                  <li key={c.name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-tint text-primary">
                      <Award size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{c.name}</p>
                      <p className="text-xs text-ink-soft">{c.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
