import { useParams } from "react-router";
import { motion } from "framer-motion";
import { MapPin, Building2, Clock, Check, X, Send } from "lucide-react";
import { PageHeader, Card, Button, Badge } from "../../components/ui";
import { CompatibilityScore } from "../../components/charts";
import { fadeUp } from "../../lib/motion";

const requiredSkills = [
  { name: "SQL", have: true },
  { name: "Python", have: true },
  { name: "Tableau", have: true },
  { name: "Statistics", have: false },
  { name: "Machine Learning", have: false },
];

export default function OpportunityDetail() {
  const { id } = useParams();

  return (
    <div>
      <PageHeader
        title="Junior Data Analyst"
        subtitle={`Delta Corp · Remote · Opportunity #${id ?? "1"}`}
        action={<Button variant="primary" size="sm"><Send size={16} /> Apply now</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid size-14 place-items-center rounded-2xl bg-tint text-primary">
                  <Building2 size={26} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink">Delta Corp</h2>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1"><MapPin size={14} /> Remote</span>
                    <span className="inline-flex items-center gap-1"><Clock size={14} /> Full-time</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-2 font-semibold text-ink">About the role</h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                Join Delta Corp's analytics team to turn raw data into decisions. You'll build dashboards,
                run analyses, and partner with product teams to surface insights. This is an ideal first
                step for a data-minded graduate ready to make measurable impact.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-3 font-semibold text-ink">Required skills</h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((s) => (
                  <span
                    key={s.name}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                      s.have ? "bg-tint text-primary" : "bg-surface text-error"
                    }`}
                  >
                    {s.have ? <Check size={14} /> : <X size={14} />}
                    {s.name}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                You have 3 of 5 required skills. Close the 2 gaps to boost your match.
              </p>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h3 className="mb-2 font-semibold text-ink">About Delta Corp</h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                Delta Corp is a 2,000-person data-driven logistics company. We invest heavily in early-career
                talent through mentorship, learning stipends, and clear growth ladders.
              </p>
            </Card>
          </motion.div>
        </div>

        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:sticky lg:top-6">
            <Card>
              <h3 className="mb-2 text-center font-semibold text-ink">Your match</h3>
              <div className="grid place-items-center">
                <CompatibilityScore value={92} size={150} />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge tone="primary">Strong fit</Badge>
                <Badge tone="accent">Skills verified</Badge>
              </div>
              <Button variant="primary" size="md" className="mt-5 w-full">
                <Send size={16} /> Apply now
              </Button>
              <Button variant="outline" size="sm" className="mt-2 w-full">Save for later</Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
