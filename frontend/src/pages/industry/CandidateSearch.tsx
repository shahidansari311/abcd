import { useState } from "react";
import { Link } from "react-router";
import { Search, X } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, Badge, Avatar, Button } from "../../components/ui";
import { CompatibilityScore } from "../../components/charts";

const allCandidates = [
  { id: 1, name: "Amara Okafor", headline: "ML researcher • Stanford", location: "Remote", skills: ["Python", "PyTorch", "NLP"], match: 96 },
  { id: 1, name: "Daniel Reyes", headline: "Data engineer • MIT", location: "Austin", skills: ["SQL", "Spark", "Airflow"], match: 92 },
  { id: 1, name: "Priya Nair", headline: "Frontend engineer • CMU", location: "Remote", skills: ["React", "TypeScript", "CSS"], match: 89 },
  { id: 1, name: "Lukas Meyer", headline: "Product analyst • ETH", location: "Berlin", skills: ["SQL", "Python", "Tableau"], match: 85 },
  { id: 1, name: "Zoe Bennett", headline: "Robotics fellow • Berkeley", location: "Austin", skills: ["C++", "ROS", "Python"], match: 82 },
  { id: 1, name: "Kenji Tanaka", headline: "ML engineer • Waterloo", location: "Remote", skills: ["PyTorch", "NLP", "Python"], match: 79 },
];

const skillFilters = ["Python", "PyTorch", "React", "SQL", "NLP"];
const locationFilters = ["Remote", "Austin", "Berlin"];

export default function CandidateSearch() {
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const results = allCandidates.filter((c) => {
    const q = query.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.headline.toLowerCase().includes(q);
    const matchSkill = skills.length === 0 || skills.some((s) => c.skills.includes(s));
    const matchLoc = locations.length === 0 || locations.includes(c.location);
    return matchQ && matchSkill && matchLoc;
  });

  return (
    <div>
      <PageHeader title="Find Candidates" subtitle="Search verified talent matched to your roles" />

      <Card className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, skill or headline..."
            className="w-full rounded-xl border border-line bg-bg py-2.5 pl-11 pr-4 text-sm text-ink outline-none focus:border-primary"
          />
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Skills</span>
            {skillFilters.map((s) => (
              <button
                key={s}
                onClick={() => toggle(skills, setSkills, s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  skills.includes(s) ? "bg-primary text-white" : "bg-tint text-primary-dark hover:brightness-95"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Location</span>
            {locationFilters.map((l) => (
              <button
                key={l}
                onClick={() => toggle(locations, setLocations, l)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  locations.includes(l) ? "bg-primary text-white" : "bg-tint text-primary-dark hover:brightness-95"
                }`}
              >
                {l}
              </button>
            ))}
            {(skills.length > 0 || locations.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSkills([]);
                  setLocations([]);
                }}
              >
                <X size={14} /> Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      <p className="mb-4 text-sm text-ink-soft">{results.length} candidates</p>

      <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((c, i) => (
          <GridItem key={i}>
            <Link to={`/industry/candidates/${c.id}`}>
              <Card hover className="h-full">
                <div className="flex items-start gap-4">
                  <Avatar name={c.name} size={52} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{c.name}</p>
                    <p className="truncate text-sm text-ink-soft">{c.headline}</p>
                  </div>
                  <CompatibilityScore value={c.match} size={64} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <Badge key={s} tone="tint">
                      {s}
                    </Badge>
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
