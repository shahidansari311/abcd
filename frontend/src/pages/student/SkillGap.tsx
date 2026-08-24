import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, BookOpen, Video, FileText } from "lucide-react";
import { PageHeader, Card, Button, Badge, Grid, GridItem } from "../../components/ui";
import { BarList, RadarChart } from "../../components/charts";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type GapAnalysis = {
  skill: string;
  gap: number;
};

const resources = [
  { title: "Machine Learning Crash Course", type: "Course", icon: BookOpen, gap: "Machine Learning", hours: 20 },
  { title: "AWS Cloud Practitioner Path", type: "Track", icon: Video, gap: "Cloud (AWS)", hours: 15 },
  { title: "Applied Statistics Handbook", type: "Reading", icon: FileText, gap: "Statistics", hours: 8 },
];

export default function SkillGap() {
  const [targetRole, setTargetRole] = useState("Loading...");
  const [radarData, setRadarData] = useState([]);
  const [detailedGaps, setDetailedGaps] = useState<GapAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const res = await api.get("/student/skill-gap");
        if (res) {
          setTargetRole(res.targetRole);
          setRadarData(res.radarData);
          setDetailedGaps(res.detailedAnalysis.filter((g: any) => g.gap > 0));
        }
      } catch (err) {
        console.error("Failed to load skill gaps", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  if (loading) return <div className="p-8 text-center text-ink-soft">Loading skill gaps...</div>;

  return (
    <div>
      <PageHeader
        title="Skill gap analysis"
        subtitle={`See exactly what stands between you and your target role: ${targetRole}.`}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-ink">You vs. Target role</h3>
            </div>
            <div className="h-[300px]">
              <RadarChart data={radarData} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="mb-1 font-semibold text-ink">Top gaps to close</h3>
            <p className="mb-4 text-sm text-ink-soft">Point difference between you and the target profile.</p>
            <BarList data={detailedGaps.map(g => ({ label: g.skill, value: g.gap }))} />
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
