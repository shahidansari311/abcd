import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Award, RotateCw } from "lucide-react";
import { PageHeader, Card, Badge, Grid, GridItem } from "../../components/ui";

const credentials = [
  { name: "SQL Fundamentals", issuer: "Northwind Academy", date: "Mar 2026", id: "SB-SQL-8842" },
  { name: "Python for Data", issuer: "SkillBridge", date: "Jan 2026", id: "SB-PY-1203" },
  { name: "Intro to Statistics", issuer: "Delta University", date: "Nov 2025", id: "SB-ST-4471" },
  { name: "Data Visualization", issuer: "Tableau Learning", date: "Feb 2026", id: "SB-VIZ-6690" },
  { name: "Agile Foundations", issuer: "SkillBridge", date: "Dec 2025", id: "SB-AGL-3355" },
  { name: "Communication Pro", issuer: "Delta University", date: "Oct 2025", id: "SB-COM-2018" },
];

export default function SkillPassport() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setFlipped((f) => ({ ...f, [id]: !f[id] }));

  return (
    <div>
      <PageHeader
        title="Skill passport"
        subtitle="Your portable, verifiable wallet of earned credentials."
      />

      <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {credentials.map((c) => {
          const isFlipped = !!flipped[c.id];
          return (
            <GridItem key={c.id}>
              <button onClick={() => toggle(c.id)} className="block w-full text-left">
                <Card hover className="relative min-h-44">
                  <AnimatePresence mode="wait" initial={false}>
                    {!isFlipped ? (
                      <motion.div
                        key="front"
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: 90 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="grid size-12 place-items-center rounded-2xl bg-tint text-primary">
                            <Award size={22} />
                          </div>
                          <RotateCw size={16} className="text-ink-soft" />
                        </div>
                        <h3 className="mt-4 font-semibold text-ink">{c.name}</h3>
                        <p className="text-sm text-ink-soft">{c.issuer}</p>
                        <p className="mt-6 text-xs text-ink-soft">Tap to verify</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: 90 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Badge tone="primary">
                          <span className="inline-flex items-center gap-1"><ShieldCheck size={13} /> Verified</span>
                        </Badge>
                        <dl className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-ink-soft">Issuer</dt>
                            <dd className="font-medium text-ink">{c.issuer}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-ink-soft">Issued</dt>
                            <dd className="font-medium text-ink">{c.date}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-ink-soft">Credential ID</dt>
                            <dd className="font-mono text-xs text-ink">{c.id}</dd>
                          </div>
                        </dl>
                        <p className="mt-4 text-xs text-ink-soft">Tap to flip back</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </button>
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
}
