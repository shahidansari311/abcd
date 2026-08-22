import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ExternalLink, ShieldCheck } from "lucide-react";
import { PageHeader, Card, Badge, Avatar, Button } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";

type Status = "Pending" | "Verified" | "Rejected";

const initial: { name: string; credential: string; evidence: string; status: Status }[] = [
  { name: "Amara Okafor", credential: "PyTorch Proficiency", evidence: "github.com/amara/portfolio", status: "Pending" },
  { name: "Daniel Reyes", credential: "AWS Solutions Architect", evidence: "credly.com/daniel", status: "Pending" },
  { name: "Priya Nair", credential: "Accessibility Certification", evidence: "priyanair.dev/certs", status: "Verified" },
  { name: "Lukas Meyer", credential: "SQL Advanced", evidence: "datacamp.com/lukas", status: "Pending" },
];

const tone: Record<Status, "warning" | "primary" | "error"> = {
  Pending: "warning",
  Verified: "primary",
  Rejected: "error",
};

export default function SkillVerification() {
  const [rows, setRows] = useState(initial);
  const [flash, setFlash] = useState<number | null>(null);

  const update = (i: number, status: Status) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, status } : row)));
    if (status === "Verified") {
      setFlash(i);
      setTimeout(() => setFlash(null), 1400);
    }
  };

  return (
    <div>
      <PageHeader title="Skill Verification" subtitle="Review evidence and verify candidate credentials" />

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
        {rows.map((row, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Card className="flex flex-wrap items-center gap-4">
              <Avatar name={row.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{row.name}</p>
                <p className="text-sm text-ink-soft">{row.credential}</p>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <ExternalLink size={12} /> {row.evidence}
                </a>
              </div>

              <Badge tone={tone[row.status]}>{row.status}</Badge>

              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {flash === i && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="grid size-9 place-items-center rounded-full bg-primary text-white"
                    >
                      <ShieldCheck size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
                {row.status === "Pending" && (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => update(i, "Verified")}>
                      <Check size={15} /> Verify
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => update(i, "Rejected")}>
                      <X size={15} /> Reject
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
