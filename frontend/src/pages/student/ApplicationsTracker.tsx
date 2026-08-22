import { motion } from "framer-motion";
import { PageHeader, Card, Avatar, Badge, Grid, GridItem } from "../../components/ui";
import { fadeUp } from "../../lib/motion";

type App = { company: string; role: string };

const columns: { name: string; tone: "tint" | "accent" | "primary" | "warning"; apps: App[] }[] = [
  {
    name: "Applied",
    tone: "tint",
    apps: [
      { company: "Vertex AI Co", role: "ML Intern" },
      { company: "Brightline", role: "Product Analyst" },
      { company: "Acme Labs", role: "BI Developer" },
    ],
  },
  {
    name: "Screening",
    tone: "accent",
    apps: [
      { company: "Northwind", role: "Data Science Intern" },
      { company: "Delta University", role: "Research Assistant" },
    ],
  },
  {
    name: "Interview",
    tone: "warning",
    apps: [{ company: "Delta Corp", role: "Junior Data Analyst" }],
  },
  {
    name: "Offer",
    tone: "primary",
    apps: [{ company: "Sky Analytics", role: "Data Intern" }],
  },
];

export default function ApplicationsTracker() {
  return (
    <div>
      <PageHeader title="Applications tracker" subtitle="Follow every application from applied to offer." />

      <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-2">
        {columns.map((col) => (
          <div key={col.name} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-ink">{col.name}</h3>
              <Badge tone={col.tone}>{col.apps.length}</Badge>
            </div>
            <Grid className="space-y-3">
              {col.apps.map((a, i) => (
                <GridItem key={`${a.company}-${i}`}>
                  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <Card hover>
                      <div className="flex items-center gap-3">
                        <Avatar name={a.company} size={40} />
                        <div>
                          <p className="text-sm font-semibold text-ink">{a.role}</p>
                          <p className="text-xs text-ink-soft">{a.company}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </GridItem>
              ))}
              {col.apps.length === 0 && (
                <motion.p variants={fadeUp} className="rounded-2xl border border-dashed border-line p-4 text-center text-sm text-ink-soft">
                  Nothing here yet
                </motion.p>
              )}
            </Grid>
          </div>
        ))}
      </div>
    </div>
  );
}
