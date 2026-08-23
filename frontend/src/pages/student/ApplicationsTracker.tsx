import { motion } from "framer-motion";
import { PageHeader, Card, Avatar, Badge, Grid, GridItem } from "../../components/ui";
import { fadeUp } from "../../lib/motion";

import { useState, useEffect } from "react";
import { api } from "../../lib/api";

type App = { _id: string; company: string; role: string; status: "Applied" | "Screening" | "Interview" | "Offer" };

const defaultColumns: { name: string; tone: "tint" | "accent" | "warning" | "primary" }[] = [
  { name: "Applied", tone: "tint" },
  { name: "Screening", tone: "accent" },
  { name: "Interview", tone: "warning" },
  { name: "Offer", tone: "primary" },
];

export default function ApplicationsTracker() {
  const [applications, setApplications] = useState<App[]>([]);

  useEffect(() => {
    async function loadApps() {
      try {
        const res = await api.get("/applications");
        setApplications(res || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadApps();
  }, []);

  const getAppsForStatus = (statusName: string) => applications.filter((a) => a.status === statusName);

  return (
    <div>
      <PageHeader title="Applications tracker" subtitle="Follow every application from applied to offer." />

      <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-2">
        {defaultColumns.map((col) => {
          const apps = getAppsForStatus(col.name);
          return (
          <div key={col.name} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-ink">{col.name}</h3>
              <Badge tone={col.tone}>{apps.length}</Badge>
            </div>
            <Grid className="space-y-3">
              {apps.map((a) => (
                <GridItem key={a._id}>
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
              {apps.length === 0 && (
                <motion.p variants={fadeUp} className="rounded-2xl border border-dashed border-line p-4 text-center text-sm text-ink-soft">
                  Nothing here yet
                </motion.p>
              )}
            </Grid>
          </div>
        );
        })}
      </div>
    </div>
  );
}
