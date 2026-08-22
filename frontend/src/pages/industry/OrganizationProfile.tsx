import { motion } from "framer-motion";
import { Pencil, Users, Calendar, MapPin, Building2 } from "lucide-react";
import { PageHeader, Card, GlassCard, Grid, GridItem, Badge, Avatar, Button } from "../../components/ui";
import { fadeUp } from "../../lib/motion";

const facts = [
  { icon: <Users size={18} />, label: "Company size", value: "850+ employees" },
  { icon: <Calendar size={18} />, label: "Founded", value: "2011" },
  { icon: <MapPin size={18} />, label: "Headquarters", value: "Austin, TX" },
];

const benefits = ["Remote-first", "Learning stipend", "Equity", "Health & dental", "Flexible PTO", "Mentorship"];

const team = [
  { name: "Sofia Alvarez", role: "Head of Talent" },
  { name: "Marcus Chen", role: "Engineering Manager" },
  { name: "Nina Patel", role: "University Relations" },
  { name: "Omar Haddad", role: "Recruiter" },
];

export default function OrganizationProfile() {
  return (
    <div>
      <PageHeader
        title="Organization Profile"
        subtitle="How candidates see your company"
        action={
          <Button variant="outline">
            <Pencil size={16} /> Edit profile
          </Button>
        }
      />

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <GlassCard className="flex flex-wrap items-center gap-5">
          <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-primary text-2xl font-bold text-white">
            N
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-ink">Northwind Labs</h2>
            <p className="flex items-center gap-1.5 text-ink-soft">
              <Building2 size={16} /> Applied AI & Robotics
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="primary">Verified employer</Badge>
              <Badge tone="accent">Actively hiring</Badge>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="mb-3 text-lg font-semibold text-ink">About</h3>
            <div className="rounded-xl border border-line bg-bg p-4 text-sm leading-relaxed text-ink-soft">
              Northwind Labs builds applied machine learning systems that help robotics teams see and reason about the
              physical world. We partner closely with universities to bring emerging research into production, and we
              invest heavily in mentoring early-career engineers and researchers.
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink">Key facts</h3>
            <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {facts.map((f) => (
                <GridItem key={f.label}>
                  <div className="rounded-xl border border-line bg-bg p-4">
                    <span className="grid size-9 place-items-center rounded-lg bg-tint text-primary">{f.icon}</span>
                    <p className="mt-3 text-xs text-ink-soft">{f.label}</p>
                    <p className="font-semibold text-ink">{f.value}</p>
                  </div>
                </GridItem>
              ))}
            </Grid>
          </Card>

          <Card>
            <h3 className="mb-3 text-lg font-semibold text-ink">Benefits & culture</h3>
            <div className="flex flex-wrap gap-2">
              {benefits.map((b) => (
                <Badge key={b} tone="tint">
                  {b}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink">Team</h3>
            <div className="space-y-4">
              {team.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <Avatar name={m.name} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{m.name}</p>
                    <p className="truncate text-sm text-ink-soft">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
