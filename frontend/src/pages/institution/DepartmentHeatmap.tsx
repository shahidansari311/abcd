import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, Flame, Sparkles } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Badge } from "../../components/ui";
import { HeatmapChart } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

export default function DepartmentHeatmap() {
  const [heatmap, setHeatmap] = useState<{rows: string[], cols: string[], data: number[][]}>({ rows: [], cols: [], data: [] });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/institution/heatmap");
        setHeatmap(res || { rows: [], cols: [], data: [] });
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <PageHeader
        title="Department Heatmap"
        subtitle="Skill strengths across departments and competency areas"
      />

      <Grid className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <GridItem>
          <StatCard label="Departments tracked" value={<CountUp to={heatmap.rows.length} />} icon={<Layers size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Strongest area" value={heatmap.cols.length > 0 ? heatmap.cols[0] : "N/A"} delta="Current" icon={<Flame size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Growth focus" value={heatmap.cols.length > 0 ? heatmap.cols[1] || "N/A" : "N/A"} delta="Current" icon={<Sparkles size={20} />} />
        </GridItem>
      </Grid>

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Skill competency matrix</h2>
            <Badge tone="accent">Scored 0 - 100</Badge>
          </div>

          {heatmap.rows.length > 0 ? (
            <HeatmapChart rows={heatmap.rows} cols={heatmap.cols} data={heatmap.data} />
          ) : (
            <p className="py-8 text-center text-ink-soft">Loading heatmap data...</p>
          )}

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
