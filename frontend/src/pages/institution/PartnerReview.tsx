import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, Globe, Mail, Briefcase, Users, Check,
  X, MapPin, ShieldCheck, ShieldAlert, Star, ChevronRight
} from "lucide-react";
import { PageHeader, Card, Badge, Button, Avatar } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

interface Opportunity {
  id: string;
  title: string;
  type: string;
  location: string;
  status: string;
  requiredSkills: { skillName: string; minimumScore: number }[];
}

interface PartnerDetail {
  id: string;
  name: string;
  sector: string;
  website: string;
  email: string;
  isVerified: boolean;
  opportunities: Opportunity[];
  stats: { hires: number; totalApps: number; openRoles: number };
}

const typeColors: Record<string, string> = {
  job: "bg-primary/10 text-primary",
  internship: "bg-accent/10 text-accent-dark",
  project: "bg-purple-100 text-purple-700",
};

export default function PartnerReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<PartnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/institution/partners/${id}`);
        setPartner(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDecision = async (action: "approved" | "rejected") => {
    setSaving(true);
    // Optimistic UI — backend endpoint for approve/reject can be added later
    await new Promise(r => setTimeout(r, 600));
    setDecision(action);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="size-10 animate-spin rounded-full border-4 border-line border-t-primary" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-ink-soft">Partner not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Go back
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="grid size-9 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs text-ink-soft">Industry Partners</p>
          <p className="font-semibold text-ink">Partnership Review</p>
        </div>
      </div>

      {/* Decision Banner */}
      {decision && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 flex items-center gap-3 rounded-xl border px-5 py-4 ${
            decision === "approved"
              ? "border-primary/30 bg-primary/10 text-primary-dark"
              : "border-error/30 bg-error/10 text-error"
          }`}
        >
          {decision === "approved" ? <Check size={20} /> : <X size={20} />}
          <p className="font-semibold">
            {decision === "approved"
              ? `${partner.name} has been approved as a campus partner.`
              : `${partner.name}'s request has been rejected.`}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — company info */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2 space-y-6">
          {/* Company Header */}
          <Card>
            <div className="flex items-start gap-5">
              <div className="grid size-16 place-items-center rounded-2xl bg-primary/10">
                <Building2 size={32} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-ink">{partner.name}</h2>
                  <Badge tone={partner.isVerified ? "primary" : "warning"}>
                    {partner.isVerified
                      ? <><ShieldCheck size={13} className="mr-1" />Verified</>
                      : <><ShieldAlert size={13} className="mr-1" />Pending Verification</>
                    }
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{partner.sector} Industry</p>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-soft">
                  {partner.email && (
                    <a href={`mailto:${partner.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Mail size={15} /> {partner.email}
                    </a>
                  )}
                  {partner.website && (
                    <a href={partner.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Globe size={15} /> {partner.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5">
              {[
                { label: "Open Roles", value: partner.stats.openRoles, icon: <Briefcase size={18} /> },
                { label: "Total Applications", value: partner.stats.totalApps, icon: <Users size={18} /> },
                { label: "Hires to Date", value: partner.stats.hires, icon: <Star size={18} /> },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
                  <div className="grid size-9 place-items-center rounded-xl bg-tint text-primary">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="text-xs text-ink-soft">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Proposed Opportunities */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-ink">Proposed Opportunities</h3>
              <Badge tone="tint">{partner.opportunities.length} roles</Badge>
            </div>

            {partner.opportunities.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-soft">No opportunities posted yet.</p>
            ) : (
              <div className="space-y-4">
                {partner.opportunities.map(opp => (
                  <div key={opp.id} className="rounded-xl border border-line p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold text-ink">{opp.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                          <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${typeColors[opp.type] || "bg-tint text-ink-soft"}`}>
                            {opp.type}
                          </span>
                          {opp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {opp.location}
                            </span>
                          )}
                          <Badge tone={opp.status === "Open" ? "primary" : "warning"}>
                            {opp.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {opp.requiredSkills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {opp.requiredSkills.map(skill => (
                          <span key={skill.skillName} className="rounded-full bg-tint px-3 py-1 text-xs font-medium text-ink-soft">
                            {skill.skillName} ≥ {skill.minimumScore}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Right column — actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
          {!decision ? (
            <Card>
              <h3 className="mb-1 text-sm font-semibold text-ink">Partnership Decision</h3>
              <p className="mb-5 text-xs text-ink-soft leading-relaxed">
                Approving will mark {partner.name} as an active campus partner and allow their opportunities to be visible to your students.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleDecision("approved")}
                  disabled={saving}
                  className="flex w-full items-center justify-between rounded-xl border border-primary/30 bg-primary/8 px-4 py-3 text-left transition-all hover:bg-primary/15 disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-primary text-white">
                      <Check size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Approve Partnership</p>
                      <p className="text-xs text-ink-soft">Grant campus partner status</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-ink-soft" />
                </button>

                <button
                  onClick={() => handleDecision("rejected")}
                  disabled={saving}
                  className="flex w-full items-center justify-between rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-left transition-all hover:bg-error/10 disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-error/10 text-error">
                      <X size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-error">Reject Request</p>
                      <p className="text-xs text-ink-soft">Decline this partnership</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-ink-soft" />
                </button>
              </div>

              {saving && (
                <p className="mt-3 text-center text-xs text-ink-soft animate-pulse">Processing…</p>
              )}
            </Card>
          ) : (
            <Card>
              <div className={`flex items-center gap-3 rounded-xl p-4 ${
                decision === "approved" ? "bg-primary/10" : "bg-error/10"
              }`}>
                {decision === "approved"
                  ? <Check size={20} className="text-primary" />
                  : <X size={20} className="text-error" />
                }
                <p className="text-sm font-semibold text-ink capitalize">{decision}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate(-1)}>
                <ArrowLeft size={15} /> Back to Partners
              </Button>
            </Card>
          )}

          <Card className="bg-tint/50 border-line">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Quick Facts</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Industry</dt>
                <dd className="font-medium text-ink">{partner.sector}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Status</dt>
                <dd>
                  <Badge tone={partner.isVerified ? "primary" : "warning"}>
                    {partner.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Roles posted</dt>
                <dd className="font-medium text-ink">{partner.opportunities.length}</dd>
              </div>
            </dl>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
