import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Share2, Download, Copy, Award, RotateCw, Activity, Hash, Layers } from "lucide-react";
import { PageHeader, Card, Badge, Button } from "../../components/ui";
import { api } from "../../lib/api";

type Verification = {
  id: string;
  skill: string;
  issuer: string;
  date: string;
  type: string;
  score: number;
};

export default function SkillPassport() {
  const [address, setAddress] = useState("Loading...");
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const res = await api.get("/student/passport");
        if (res) {
          setAddress(res.address);
          setVerifications(res.verifications);
        }
      } catch (err) {
        console.error("Failed to load passport", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, []);

  const toggle = (id: string) => setFlipped((f) => ({ ...f, [id]: !f[id] }));

  if (loading) return <div className="p-8 text-center text-ink-soft">Loading passport...</div>;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <PageHeader title="Skill Passport" subtitle="Your cryptographically verifiable record of skills and achievements" className="mb-0" />
        <div className="flex gap-3">
          <Button variant="outline" size="sm" icon={<Share2 size={16} />}>Share Profile</Button>
          <Button variant="primary" size="sm" icon={<Download size={16} />}>Export PDF</Button>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
        <p className="text-sm text-slate-400">Wallet Address</p>
        <div className="mt-2 flex items-center gap-3">
          <p className="font-mono text-sm">{address}</p>
          <button className="text-slate-500 transition-colors hover:text-white" aria-label="Copy address">
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {verifications.map((v) => {
          const isFlipped = !!flipped[v.id];
          return (
            <div key={v.id}>
              <button onClick={() => toggle(v.id)} className="block w-full text-left">
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
                        <h3 className="mt-4 font-semibold text-ink">{v.skill}</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
                          <span>{v.issuer}</span>
                          <span className="size-1 rounded-full bg-line" />
                          <span>{new Date(v.date).toLocaleDateString()}</span>
                        </div>
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
                            <dd className="font-medium text-ink">{v.issuer}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-ink-soft">Score</dt>
                            <dd className="font-medium text-ink">{v.score}%</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-ink-soft">Credential ID</dt>
                            <dd className="font-mono text-xs text-ink">{v.id}</dd>
                          </div>
                        </dl>
                        <p className="mt-4 text-xs text-ink-soft">Tap to flip back</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
