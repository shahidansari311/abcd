import { useState, useEffect } from "react";
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
import { api } from "../../lib/api";

type Filter = string;

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

export default function OpportunityDiscovery() {
  const [active, setActive] = useState<Filter>("All");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await api.get("/opportunities/all");
        if (res) {
          const formattedOpps = res.map((o: any) => ({
            id: o._id,
            title: o.title,
            company: o.industryPartner?.companyName || "Industry Partner",
            domain: o.type, // Map 'type' to 'domain' for now
            location: o.location || "Remote",
            tags: o.requiredSkills ? o.requiredSkills.map((s: any) => s.skillName) : [],
            funding: "TBD", // Mock funding
            match: Math.floor(Math.random() * 20) + 80 // Mock match score
          }));
          setOpportunities(formattedOpps);

          // Extract unique tags to use as filters
          const allTags = new Set<string>();
          formattedOpps.forEach((o: Opportunity) => o.tags.forEach((t: string) => allTags.add(t)));
          setFilters(["All", ...Array.from(allTags).slice(0, 5)]); // top 5 tags
        }
      } catch (err) {
        console.error("Failed to load opportunities", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpportunities();
  }, []);

  const visible =
    active === "All"
      ? opportunities
      : opportunities.filter((o) => o.tags.includes(active) || o.domain === active);

  if (loading) {
    return <div className="p-8 text-center text-ink-soft">Loading opportunities...</div>;
  }

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
