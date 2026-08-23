import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Award, FileCheck, Building } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, Badge, ProgressBar } from "../../components/ui";
import { TrendChart, BarList } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

export default function PlacementAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/institution/placements");
        setData(res);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);
  return (
    <div>
      <PageHeader title="Placement Analytics" subtitle="Outcomes, packages, and funnel performance" />

      <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <GridItem>
          <StatCard label="Median package" value={<CountUp to={12} prefix="₹" suffix=" LPA" />} delta="+1.5 LPA" icon={<IndianRupee size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Highest package" value={<CountUp to={54} prefix="₹" suffix=" LPA" />} delta="Record high" icon={<Award size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Offers extended" value={<CountUp to={533} />} delta="+72 YoY" icon={<FileCheck size={20} />} />
        </GridItem>
        <GridItem>
          <StatCard label="Companies visited" value={<CountUp to={126} />} delta="+18 new" icon={<Building size={20} />} />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Placement rate trend</h2>
              <Badge tone="accent">% placed</Badge>
            </div>
            <TrendChart data={data?.placementTrend || []} />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Offers by sector</h2>
            <BarList data={data?.offersBySector || []} />
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-6">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Placement funnel</h2>
            <Badge tone="primary">Conversion 48%</Badge>
          </div>
          <div className="space-y-5">
            {data?.funnel?.map((step: any) => (
              <div key={step.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{step.label}</span>
                  <span className="text-ink-soft">{step.value}%</span>
                </div>
                <ProgressBar value={step.value} />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
