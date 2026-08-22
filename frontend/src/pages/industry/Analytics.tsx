import { motion } from "framer-motion";
import { Clock, Users, Target, TrendingUp } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, ProgressBar } from "../../components/ui";
import { TrendChart, BarList, HeatmapChart } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp } from "../../lib/motion";

const timeToHire = [38, 35, 36, 32, 30, 28, 27, 25, 24, 22, 21, 19];

const sources = [
  { label: "University partners", value: 142 },
  { label: "Platform matches", value: 118 },
  { label: "Referrals", value: 64 },
  { label: "Direct applications", value: 47 },
  { label: "Events", value: 29 },
];

const heatRows = ["Engineering", "Data", "Research", "Product", "Design"];
const heatCols = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const heatData = [
  [40, 55, 62, 70, 80, 88],
  [30, 45, 50, 58, 66, 72],
  [20, 28, 35, 48, 60, 68],
  [15, 22, 30, 38, 44, 52],
  [10, 18, 24, 30, 36, 42],
];

const funnel = [
  { label: "Applications", value: 100, count: 380 },
  { label: "Screened", value: 62, count: 236 },
  { label: "Interviewed", value: 34, count: 129 },
  { label: "Offers", value: 12, count: 46 },
  { label: "Hires", value: 6, count: 23 },
];

export default function Analytics() {
  return (
    <div>
      <PageHeader title="Hiring Analytics" subtitle="Measure and improve your recruitment funnel" />

      <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <GridItem>
          <StatCard label="Avg. time-to-hire" value={<CountUp to={19} suffix=" days" />} delta="-6 days YoY" icon={<Clock size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Total applications" value={<CountUp to={380} />} delta="+22% QoQ" icon={<Users size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Offer accept rate" value={<CountUp to={78} suffix="%" />} delta="+4 pts" icon={<Target size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Quality of hire" value={<CountUp to={91} suffix="%" />} delta="+3 pts" icon={<TrendingUp size={20} />} />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Time-to-hire (days)</h2>
            <TrendChart data={timeToHire} height={220} />
          </Card>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Applications by source</h2>
            <BarList data={sources} />
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Hiring activity</h2>
            <HeatmapChart rows={heatRows} cols={heatCols} data={heatData} />
          </Card>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Recruitment funnel</h2>
            <div className="space-y-4">
              {funnel.map((f) => (
                <div key={f.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-ink">{f.label}</span>
                    <span className="text-ink-soft">{f.count}</span>
                  </div>
                  <ProgressBar value={f.value} />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
