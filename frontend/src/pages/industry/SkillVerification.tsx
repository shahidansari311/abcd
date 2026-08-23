import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ExternalLink, ShieldCheck } from "lucide-react";
import { PageHeader, Card, Badge, Avatar, Button } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

type Status = "pending" | "approved" | "rejected";

const tone: Record<Status, "warning" | "primary" | "error"> = {
  pending: "warning",
  approved: "primary",
  rejected: "error",
};

export default function SkillVerification() {
  const [rows, setRows] = useState<any[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await api.get('/verification/pending');
        setRows(data);
      } catch (error) {
        console.error("Failed to load requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const update = async (i: number, status: Status, requestId: string) => {
    try {
      await api.put(`/verification/${requestId}/process`, { status, notes: "Processed by Industry" });
      setRows((r) => r.map((row, idx) => (idx === i ? { ...row, status } : row)));
      if (status === "approved") {
        setFlash(i);
        setTimeout(() => setFlash(null), 1400);
      }
    } catch (err) {
      console.error("Error processing request", err);
    }
  };

  if (loading) return <div className="p-8 text-center text-ink-soft">Loading pending verifications...</div>;

  return (
    <div>
      <PageHeader title="Skill Verification" subtitle="Review evidence and verify candidate credentials" />

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
        {rows.length === 0 && <div className="text-ink-soft">No pending verification requests.</div>}
        {rows.map((row, i) => {
          const studentName = row.student ? `${row.student.firstName} ${row.student.lastName}` : "Unknown Student";
          return (
            <motion.div key={row._id} variants={fadeUp}>
              <Card className="flex flex-wrap items-center gap-4">
                <Avatar name={studentName} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{studentName}</p>
                  <p className="text-sm text-ink-soft">{row.skillName}</p>
                  {row.evidenceUrl && (
                    <a
                      href={row.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <ExternalLink size={12} /> View Evidence
                    </a>
                  )}
                </div>

                <Badge tone={tone[row.status]}>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</Badge>

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
                  {row.status === "pending" && (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => update(i, "approved", row._id)}>
                        <Check size={15} /> Verify
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => update(i, "rejected", row._id)}>
                        <X size={15} /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
