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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/institution/placements");
        setData(res);
      } catch (err) {
        console.error(err);
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

  return (
    <div>
      <PageHeader title="Placement Analytics" subtitle="Outcomes, packages, and funnel performance" />

      <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <GridItem>
          <StatCard
            label="Median package"
            value={<CountUp to={data?.medianPackage || 0} prefix="₹" suffix=" LPA" />}
            delta="From placed students"
            icon={<IndianRupee size={20} />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Highest package"
            value={<CountUp to={data?.highestPackage || 0} prefix="₹" suffix=" LPA" />}
            delta="Top offer this cycle"
            icon={<Award size={20} />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Offers extended"
            value={<CountUp to={data?.offersExtended || 0} />}
            delta="Offer + Hired status"
            icon={<FileCheck size={20} />}
          />
        </GridItem>
        <GridItem>
          <StatCard
            label="Companies visited"
            value={<CountUp to={data?.companiesVisited || 0} />}
            delta="Unique recruiters"
            icon={<Building size={20} />}
          />
        </GridItem>
      </Grid>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Placement rate trend</h2>
              <Badge tone="accent">Hires per month</Badge>
            </div>
            <TrendChart data={data?.placementTrend || []} />
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Offers by sector</h2>
            {data?.offersBySector?.length > 0 ? (
              <BarList data={data.offersBySector} />
            ) : (
              <p className="py-6 text-center text-sm text-ink-soft">No offers data yet.</p>
            )}
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-6">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Placement funnel</h2>
            {data?.funnel && data.funnel.length > 0 && (
              <Badge tone="primary">
                Placed: {data.funnel.find((s: any) => s.label === "Placed")?.value || 0}
              </Badge>
            )}
          </div>
          <div className="space-y-5">
            {data?.funnel?.map((step: any) => {
              const maxVal = Math.max(...(data.funnel.map((s: any) => s.value) || [1]), 1);
              const pct = Math.round((step.value / maxVal) * 100);
              return (
                <div key={step.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{step.label}</span>
                    <span className="text-ink-soft">{step.value} students</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              );
            })}
            {(!data?.funnel || data.funnel.length === 0) && (
              <p className="py-6 text-center text-sm text-ink-soft">No placement data yet.</p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
