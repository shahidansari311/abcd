import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Check } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, Avatar, Badge, Button } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

interface Partner {
  name: string;
  sector: string;
  roles: string[] | number;
  hires?: number;
  mou?: "Active" | "Renewal due" | "Pending";
}

const mouTone: Record<NonNullable<Partner["mou"]>, "primary" | "warning" | "tint"> = {
  Active: "primary",
  "Renewal due": "warning",
  Pending: "tint",
};

export default function IndustryPartners() {
  const [data, setData] = useState<{ partners: Partner[], requests: Partner[] }>({ partners: [], requests: [] });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/institution/partners");
        setData(res || { partners: [], requests: [] });
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <PageHeader title="Industry Partners" subtitle="Companies recruiting and collaborating with your campus" />

      <motion.div variants={stagger} initial="hidden" animate="show">
        <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.partners.map((p) => (
            <GridItem key={p.name}>
              <motion.div variants={fadeUp}>
                <Card hover>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} />
                      <div>
                        <p className="font-semibold text-ink">{p.name}</p>
                        <Badge tone="accent">{p.sector}</Badge>
                      </div>
                    </div>
                    <Badge tone={mouTone[p.mou || "Pending"]}>{p.mou || "Pending"}</Badge>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {Array.isArray(p.roles) && p.roles.map((r) => (
                      <span key={r} className="rounded-full bg-tint px-3 py-1 text-xs font-medium text-ink-soft">
                        {r}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <Briefcase size={16} className="text-primary" />
                    <span className="font-semibold text-ink">{p.hires}</span> hires to date
                  </div>
                </Card>
              </motion.div>
            </GridItem>
          ))}
        </Grid>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-8">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">New partnership requests</h2>
            <Badge tone="warning">{data.requests.length} pending</Badge>
          </div>
          <div className="divide-y divide-line">
            {data.requests.length === 0 ? (
              <p className="py-4 text-center text-sm text-ink-soft">No pending requests.</p>
            ) : (
              data.requests.map((req) => (
                <div key={req.name} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={req.name} size={32} />
                    <div>
                      <p className="font-medium text-ink">{req.name}</p>
                      <p className="text-sm text-ink-soft">{req.sector} - {req.roles} roles proposed</p>
                    </div>
                  </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Review</Button>
                  <Button size="sm">
                    <Check size={16} /> Approve
                  </Button>
                </div>
              </div>
            ))
          )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
