import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, DollarSign, MapPin, Search } from "lucide-react";
import {
  PageHeader,
  Card,
  Badge,
  Button,
  Grid,
  GridItem,
  EmptyState,
} from "../../components/ui";
import { fadeUp } from "../../lib/motion";

const filters = ["All", "AI & Data", "Healthcare", "Energy", "Materials", "Robotics"] as const;
type Filter = (typeof filters)[number];

type Opportunity = {
  id: string;
  title: string;
  company: string;
  domain: Filter;
  location: string;
  tags: string[];
  funding: string;
  match: number;
};

const opportunities: Opportunity[] = [
  {
    id: "op-1",
    title: "AI-Driven Predictive Maintenance for Wind Turbines",
    company: "NordVind Energy",
    domain: "Energy",
    location: "Copenhagen, DK",
    tags: ["Machine Learning", "IoT", "Time Series"],
    funding: "$420K / 18 mo",
    match: 94,
  },
  {
    id: "op-2",
    title: "Federated Learning for Clinical Diagnostics",
    company: "MediCore Labs",
    domain: "Healthcare",
    location: "Boston, US",
    tags: ["Privacy", "Deep Learning", "Imaging"],
    funding: "$610K / 24 mo",
    match: 88,
  },
  {
    id: "op-3",
    title: "Generative Chemistry for Battery Materials",
    company: "Helios Materials",
    domain: "Materials",
    location: "Remote",
    tags: ["Simulation", "Chemistry", "R&D"],
    funding: "$350K / 12 mo",
    match: 81,
  },
  {
    id: "op-4",
    title: "Autonomous Warehouse Navigation",
    company: "Loopway Robotics",
    domain: "Robotics",
    location: "Munich, DE",
    tags: ["SLAM", "Reinforcement Learning"],
    funding: "$500K / 18 mo",
    match: 77,
  },
  {
    id: "op-5",
    title: "Foundation Models for Tabular Enterprise Data",
    company: "Corvus Analytics",
    domain: "AI & Data",
    location: "London, UK",
    tags: ["LLM", "Transfer Learning"],
    funding: "$540K / 20 mo",
    match: 90,
  },
  {
    id: "op-6",
    title: "Wearable Signal Denoising for Cardiac Monitoring",
    company: "PulseIQ",
    domain: "Healthcare",
    location: "Amsterdam, NL",
    tags: ["Signal Processing", "Edge AI"],
    funding: "$280K / 12 mo",
    match: 84,
  },
];

export default function OpportunityDiscovery() {
  const [active, setActive] = useState<Filter>("All");

  const visible =
    active === "All"
      ? opportunities
      : opportunities.filter((o) => o.domain === active);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Discover opportunities"
        subtitle="Industry research projects matched to your expertise."
        action={<Button variant="secondary">Save search</Button>}
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              active === f
                ? "bg-primary text-white"
                : "bg-surface text-ink-soft border border-line hover:bg-tint"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Search className="size-6" />}
          title="No opportunities found"
          message="Try a different domain filter to see more projects."
          action={<Button variant="outline" onClick={() => setActive("All")}>Reset filters</Button>}
        />
      ) : (
        <Grid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((o) => (
            <GridItem key={o.id}>
              <Card hover className="rounded-2xl p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <Badge tone="accent">{o.domain}</Badge>
                  <Badge tone="primary">{o.match}% match</Badge>
                </div>
                <h3 className="text-ink font-semibold mb-2">{o.title}</h3>
                <div className="space-y-1 text-sm text-ink-soft mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4" /> {o.company}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" /> {o.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4" /> {o.funding}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {o.tags.map((t) => (
                    <Badge key={t} tone="tint">
                      {t}
                    </Badge>
                  ))}
                </div>
                <motion.div variants={fadeUp} className="mt-auto">
                  <Button variant="primary" size="sm">
                    Express interest
                  </Button>
                </motion.div>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}
    </div>
  );
}
