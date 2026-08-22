import { motion } from "framer-motion";
import { Plus, BookOpen, Video, FileText } from "lucide-react";
import { PageHeader, Card, Button, Badge, Grid, GridItem } from "../../components/ui";
import { RadarChart, BarList } from "../../components/charts";
import { fadeUp } from "../../lib/motion";

const you = [
  { label: "Python", value: 82 },
  { label: "SQL", value: 76 },
  { label: "ML", value: 45 },
  { label: "Statistics", value: 58 },
  { label: "Comm.", value: 84 },
  { label: "Cloud", value: 38 },
];

const target = [
  { label: "Python", value: 85 },
  { label: "SQL", value: 80 },
  { label: "ML", value: 80 },
  { label: "Statistics", value: 78 },
  { label: "Comm.", value: 75 },
  { label: "Cloud", value: 70 },
];

const gaps = [
  { label: "Machine Learning", value: 35 },
  { label: "Cloud (AWS)", value: 32 },
  { label: "Statistics", value: 20 },
  { label: "SQL", value: 4 },
];

const resources = [
  { title: "Machine Learning Crash Course", type: "Course", icon: BookOpen, gap: "Machine Learning", hours: 20 },
  { title: "AWS Cloud Practitioner Path", type: "Track", icon: Video, gap: "Cloud (AWS)", hours: 15 },
  { title: "Applied Statistics Handbook", type: "Reading", icon: FileText, gap: "Statistics", hours: 8 },
];

export default function SkillGap() {
  return (
    <div>
      <PageHeader
        title="Skill gap analysis"
        subtitle="See exactly what stands between you and your target role: Data Scientist."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-ink">You vs. Target role</h3>
              <div className="flex gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-ink-soft"><span className="size-2.5 rounded-full bg-primary" /> You</span>
                <span className="inline-flex items-center gap-1.5 text-ink-soft"><span className="size-2.5 rounded-full bg-accent" /> Target</span>
              </div>
            </div>
            <div className="grid place-items-center gap-4 sm:grid-cols-2">
              <div className="text-center">
                <p className="mb-1 text-sm font-medium text-primary">You</p>
                <RadarChart data={you} size={200} />
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm font-medium text-accent">Target role</p>
                <RadarChart data={target} size={200} />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="mb-1 font-semibold text-ink">Top gaps to close</h3>
            <p className="mb-4 text-sm text-ink-soft">Point difference between you and the target profile.</p>
            <BarList data={gaps} />
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-6">
        <h3 className="mb-3 text-lg font-semibold text-ink">Recommended to close your gaps</h3>
      </motion.div>

      <Grid className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {resources.map((r) => {
          const Icon = r.icon;
          return (
            <GridItem key={r.title}>
              <Card hover className="flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-tint text-primary">
                    <Icon size={20} />
                  </div>
                  <Badge tone="accent">{r.type}</Badge>
                </div>
                <h4 className="mt-4 font-semibold text-ink">{r.title}</h4>
                <p className="mt-1 text-sm text-ink-soft">Closes: {r.gap}</p>
                <p className="mt-1 text-sm text-ink-soft">~{r.hours} hours</p>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  <Plus size={16} /> Add to roadmap
                </Button>
              </Card>
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
}
