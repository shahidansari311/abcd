import { motion } from "framer-motion";
import { Star, Calendar, Video } from "lucide-react";
import { PageHeader, Card, Avatar, Badge, Button, Grid, GridItem } from "../../components/ui";
import { fadeUp } from "../../lib/motion";

const mentors = [
  { name: "Dr. Elena Ortiz", role: "Lead Data Scientist · Delta Corp", tags: ["ML", "Statistics", "Careers"], rating: 4.9 },
  { name: "Marcus Reed", role: "Analytics Manager · Northwind", tags: ["SQL", "BI", "Leadership"], rating: 4.8 },
  { name: "Priya Nair", role: "ML Engineer · Vertex AI", tags: ["PyTorch", "MLOps", "Cloud"], rating: 5.0 },
  { name: "James Okafor", role: "Product Analyst · Brightline", tags: ["A/B Testing", "Product", "SQL"], rating: 4.7 },
  { name: "Sofia Lindqvist", role: "Research Fellow · Delta University", tags: ["R", "Research", "Writing"], rating: 4.9 },
  { name: "Daniel Kim", role: "Founder · Sky Analytics", tags: ["Startups", "Strategy", "Data"], rating: 4.6 },
];

const sessions = [
  { mentor: "Dr. Elena Ortiz", topic: "Breaking into data science", when: "Thu, Aug 28 · 3:00 PM" },
  { mentor: "Marcus Reed", topic: "Resume & portfolio review", when: "Mon, Sep 1 · 11:00 AM" },
];

export default function Mentorship() {
  return (
    <div>
      <PageHeader title="Mentorship" subtitle="Learn from professionals already in your target field." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {mentors.map((m) => (
              <GridItem key={m.name}>
                <Card hover className="flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size={52} />
                    <div>
                      <h3 className="font-semibold text-ink">{m.name}</h3>
                      <p className="text-xs text-ink-soft">{m.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm text-ink">
                    <Star size={15} className="fill-accent text-accent" /> {m.rating}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <Badge key={t} tone="tint">{t}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    <Video size={16} /> Request session
                  </Button>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-ink">
              <Calendar size={18} className="text-primary" /> Your sessions
            </h3>
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li key={s.topic} className="rounded-2xl border border-line bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={s.mentor} size={32} />
                    <p className="text-sm font-medium text-ink">{s.mentor}</p>
                  </div>
                  <p className="mt-2 text-sm text-ink">{s.topic}</p>
                  <p className="mt-1 text-xs text-ink-soft">{s.when}</p>
                  <Button variant="ghost" size="sm" className="mt-2 w-full">Join call</Button>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
