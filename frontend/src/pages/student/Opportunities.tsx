import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Building2 } from "lucide-react";
import { PageHeader, Card, Badge, Grid, GridItem } from "../../components/ui";

const filters = ["All", "Internship", "Full-time", "Remote", "Research"];

const opportunities = [
  { role: "Junior Data Analyst", company: "Delta Corp", location: "Remote", type: "Full-time", tags: ["SQL", "Python", "Tableau"], match: 92 },
  { role: "Data Science Intern", company: "Northwind", location: "Boston, MA", type: "Internship", tags: ["Python", "ML", "Statistics"], match: 88 },
  { role: "BI Developer", company: "Acme Labs", location: "Remote", type: "Remote", tags: ["Power BI", "SQL", "ETL"], match: 79 },
  { role: "Research Assistant", company: "Delta University", location: "On campus", type: "Research", tags: ["R", "Statistics", "Writing"], match: 74 },
  { role: "Product Analyst", company: "Brightline", location: "New York, NY", type: "Full-time", tags: ["SQL", "A/B Testing", "Excel"], match: 71 },
  { role: "ML Intern", company: "Vertex AI Co", location: "Remote", type: "Internship", tags: ["PyTorch", "ML", "Python"], match: 66 },
];

export default function Opportunities() {
  const [active, setActive] = useState("All");

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
        {shown.map((o, i) => (
          <GridItem key={`${o.role}-${i}`}>
            <Link to="/student/opportunities/1">
              <Card hover className="flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-tint text-primary">
                    <Building2 size={20} />
                  </div>
                  <Badge tone={o.match >= 85 ? "primary" : "accent"}>{o.match}% match</Badge>
                </div>
                <h3 className="mt-4 font-semibold text-ink">{o.role}</h3>
                <p className="text-sm text-ink-soft">{o.company}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-ink-soft">
                  <MapPin size={14} /> {o.location}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {o.tags.map((t) => (
                    <Badge key={t} tone="tint">{t}</Badge>
                  ))}
                </div>
              </Card>
            </Link>
          </GridItem>
        ))}
      </Grid>
    </div>
  );
}
