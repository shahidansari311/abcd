import { motion } from "framer-motion";
import { Users, TrendingUp, Building2, Gauge } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Badge, Avatar } from "../../components/ui";
import { TrendChart, BarList } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp, stagger } from "../../lib/motion";

const placementsByYear = [182, 214, 241, 268, 297, 331, 372, 418];

const readinessByDept = [
  { label: "Computer Science", value: 88 },
  { label: "Electronics", value: 79 },
  { label: "Mechanical", value: 71 },
  { label: "Civil", value: 64 },
  { label: "Biotech", value: 68 },
];

const recruiters = [
  { name: "Northwind Labs", hires: 42, sector: "AI / ML" },
  { name: "Vertex Systems", hires: 37, sector: "Cloud" },
  { name: "Helix Bio", hires: 29, sector: "Biotech" },
  { name: "Ironclad Motors", hires: 24, sector: "Automotive" },
  { name: "Beacon Analytics", hires: 21, sector: "Data" },
];

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Institution Dashboard"
        subtitle="Placement and readiness insights across your campus"
      />

      <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <GridItem>
          <StatCard label="Total students" value={<CountUp to={4820} />} delta="+312 this year" icon={<Users size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Placement rate" value={<CountUp to={87} suffix="%" />} delta="+4% YoY" icon={<TrendingUp size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Industry partners" value={<CountUp to={126} />} delta="+18 new" icon={<Building2 size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Avg readiness" value={<CountUp to={74} suffix="%" />} delta="+6 pts" icon={<Gauge size={20} />} />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Placements over years</h2>
              <Badge tone="accent">2017 - 2024</Badge>
            </div>
            <TrendChart data={placementsByYear} />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Readiness by department</h2>
            <BarList data={readinessByDept} />
          </Card>
        </motion.div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="mt-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Top recruiters</h2>
            <Badge tone="primary">This academic year</Badge>
          </div>
          <div className="divide-y divide-line">
            {recruiters.map((r) => (
              <motion.div
                key={r.name}
                variants={fadeUp}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={r.name} />
                  <div>
                    <p className="font-medium text-ink">{r.name}</p>
                    <p className="text-sm text-ink-soft">{r.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">{r.hires}</p>
                  <p className="text-xs text-ink-soft">hires</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
