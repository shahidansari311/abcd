import { motion } from "framer-motion";
import { Layers, Flame, Sparkles } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Badge } from "../../components/ui";
import { HeatmapChart } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp } from "../../lib/motion";

const rows = ["Computer Science", "Electronics", "Mechanical", "Civil", "Biotech"];
const cols = ["Technical", "Communication", "Problem Solving", "Teamwork", "Leadership", "Domain"];

const data = [
  [95, 78, 90, 82, 74, 88],
  [84, 72, 80, 76, 68, 81],
  [71, 66, 74, 79, 62, 77],
  [63, 70, 61, 74, 58, 69],
  [76, 68, 72, 71, 64, 85],
];

export default function DepartmentHeatmap() {
  return (
    <div>
      <PageHeader
        title="Department Heatmap"
        subtitle="Skill strengths across departments and competency areas"
      />

      <Grid className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <GridItem>
          <StatCard label="Departments tracked" value={<CountUp to={5} />} icon={<Layers size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Strongest area" value="Technical" delta="CS 95%" icon={<Flame size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Growth focus" value="Leadership" delta="Avg 65%" icon={<Sparkles size={20} />} />
        </GridItem>
      </Grid>

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Skill competency matrix</h2>
            <Badge tone="accent">Scored 0 - 100</Badge>
          </div>

          <HeatmapChart rows={rows} cols={cols} data={data} />

          <div className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
            <span>Low</span>
            <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-tint via-accent to-primary" />
            <span>High</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
