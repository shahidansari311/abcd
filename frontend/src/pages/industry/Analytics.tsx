import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Target, TrendingUp } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, StatCard, ProgressBar } from "../../components/ui";
import { TrendChart, BarList, HeatmapChart } from "../../components/charts";
import CountUp from "../../components/CountUp";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/industry/analytics");
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="size-10 animate-spin rounded-full border-4 border-line border-t-primary" />
      </div>
    );
  }

  const timeToHire = data?.timeToHireTrend || [];
  const sources = data?.applicationsBySource || [];
  const funnel = data?.recruitmentFunnel || [];
  const heatRows = data?.heatRows || ["job", "internship", "project"];
  const heatCols = data?.heatCols || [];
  const heatData = data?.heatData || [];

  return (
    <div>
      <PageHeader title="Hiring Analytics" subtitle="Measure and improve your recruitment funnel" />

      <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <GridItem>
          <StatCard
            label="Avg. time-to-hire"
            value={<CountUp to={data?.avgTimeToHire || 0} suffix=" days" />}
            delta="From application to hire"
            icon={<Clock size={20} />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Total applications"
            value={<CountUp to={data?.totalApplications || 0} />}
            delta="All time"
            icon={<Users size={20} />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Offer accept rate"
            value={<CountUp to={data?.offerAcceptRate || 0} suffix="%" />}
            delta="Offers → Hired"
            icon={<Target size={20} />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Total hires"
            value={<CountUp to={data?.hiresCount || 0} />}
            delta="Hired status"
            icon={<TrendingUp size={20} />}
          />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Time-to-hire trend (days)</h2>
            {timeToHire.length > 0 ? (
              <TrendChart data={timeToHire} height={220} />
            ) : (
              <p className="py-10 text-center text-sm text-ink-soft">No hire data yet.</p>
            )}
          </Card>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Applications by source</h2>
            {sources.length > 0 ? (
              <BarList data={sources} />
            ) : (
              <p className="py-10 text-center text-sm text-ink-soft">No application sources yet.</p>
            )}
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Hiring activity by type</h2>
            {heatData.length > 0 && heatCols.length > 0 ? (
              <HeatmapChart rows={heatRows} cols={heatCols} data={heatData} />
            ) : (
              <p className="py-10 text-center text-sm text-ink-soft">No hiring activity data yet.</p>
            )}
          </Card>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Recruitment funnel</h2>
            {funnel.length > 0 ? (
              <div className="space-y-4">
                {funnel.map((f: any) => (
                  <div key={f.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-ink">{f.label}</span>
                      <span className="text-ink-soft">{f.count}</span>
                    </div>
                    <ProgressBar value={f.value} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-ink-soft">No applications yet.</p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
