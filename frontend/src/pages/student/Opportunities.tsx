import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MapPin, Building2 } from "lucide-react";
import { PageHeader, Card, Badge, Grid, GridItem } from "../../components/ui";
import { api } from "../../lib/api";

const filters = ["All", "Internship", "Full-time", "Remote", "Research"];

type Opportunity = {
  _id: string;
  title: string;
  company: { name: string; location: string };
  type: string;
  requirements: string[];
};

export default function Opportunities() {
  const [active, setActive] = useState("All");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    async function loadOpp() {
      try {
        const res = await api.get("/student/opportunities");
        setOpportunities(res || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadOpp();
  }, []);

  const shown = opportunities.filter((o) => active === "All" || o.type === active);

  return (
    <div>
      <PageHeader title="Opportunities" subtitle="Roles matched to your verified skills and goals." />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === f ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink hover:bg-tint"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Grid className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((o) => {
          // Fake a match score based on title length just for UI polish if the backend doesn't provide match scores yet
          const match = 70 + (o.title.length % 25);
          return (
            <GridItem key={o._id}>
              <Link to={`/student/opportunities/${o._id}`}>
                <Card hover className="flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="grid size-11 place-items-center rounded-2xl bg-tint text-primary">
                      <Building2 size={20} />
                    </div>
                    <Badge tone={match >= 85 ? "primary" : "accent"}>{match}% match</Badge>
                  </div>
                  <h3 className="mt-4 font-semibold text-ink">{o.title}</h3>
                  <p className="text-sm text-ink-soft">{o.company?.name || "Unknown Company"}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-ink-soft">
                    <MapPin size={14} /> {o.company?.location || "Remote"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {o.requirements.slice(0,3).map((t) => (
                      <Badge key={t} tone="tint">{t}</Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
}
