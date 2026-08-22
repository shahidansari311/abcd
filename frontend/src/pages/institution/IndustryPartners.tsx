import { motion } from "framer-motion";
import { Briefcase, Check } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, Avatar, Badge, Button } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";

interface Partner {
  name: string;
  sector: string;
  roles: string[];
  hires: number;
  mou: "Active" | "Renewal due" | "Pending";
}

const partners: Partner[] = [
  { name: "Northwind Labs", sector: "AI / ML", roles: ["ML Engineer", "Data Scientist"], hires: 42, mou: "Active" },
  { name: "Vertex Systems", sector: "Cloud", roles: ["SRE", "Backend Engineer"], hires: 37, mou: "Active" },
  { name: "Helix Bio", sector: "Biotech", roles: ["Research Assoc.", "Bioinformatics"], hires: 29, mou: "Renewal due" },
  { name: "Ironclad Motors", sector: "Automotive", roles: ["Design Engineer", "QA"], hires: 24, mou: "Active" },
  { name: "Beacon Analytics", sector: "Data", roles: ["Analyst", "BI Developer"], hires: 21, mou: "Pending" },
  { name: "Aster Consulting", sector: "Consulting", roles: ["Associate", "Strategy Intern"], hires: 18, mou: "Active" },
];

const requests = [
  { name: "Quanta Robotics", sector: "Robotics", roles: 3 },
  { name: "Lumen Fintech", sector: "Finance", roles: 5 },
  { name: "Solace Health", sector: "HealthTech", roles: 2 },
];

const mouTone: Record<Partner["mou"], "primary" | "warning" | "tint"> = {
  Active: "primary",
  "Renewal due": "warning",
  Pending: "tint",
};

export default function IndustryPartners() {
  return (
    <div>
      <PageHeader title="Industry Partners" subtitle="Companies recruiting and collaborating with your campus" />

      <motion.div variants={stagger} initial="hidden" animate="show">
        <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {partners.map((p) => (
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
                    <Badge tone={mouTone[p.mou]}>{p.mou}</Badge>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {p.roles.map((r) => (
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
            <Badge tone="warning">{requests.length} pending</Badge>
          </div>
          <div className="divide-y divide-line">
            {requests.map((req) => (
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
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
