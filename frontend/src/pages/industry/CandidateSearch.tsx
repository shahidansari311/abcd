import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, X } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, Badge, Avatar, Button } from "../../components/ui";
import { CompatibilityScore } from "../../components/charts";
import { api } from "../../lib/api";

type Candidate = {
  id: string;
  name: string;
  headline: string;
  location: string;
  skills: string[];
  match: number;
};

export default function CandidateSearch() {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [skillFilters, setSkillFilters] = useState<string[]>([]);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get("/industry/candidates");
        if (res) {
          const mapped = res.map((p: any) => ({
            id: p.student?._id,
            name: `${p.student?.firstName || 'Unknown'} ${p.student?.lastName || ''}`,
            headline: p.degree ? `${p.degree} Student` : "Student",
            location: "Remote", // Mock location for now
            skills: p.skills ? p.skills.map((s: any) => s.name) : [],
            match: Math.floor(Math.random() * 20) + 80, // Mock score
          }));
          setAllCandidates(mapped);

          // Extract unique filters
          const allSkills = new Set<string>();
          mapped.forEach((c: Candidate) => c.skills.forEach(s => allSkills.add(s)));
          setSkillFilters(Array.from(allSkills).slice(0, 8)); // Top 8 skills
          setLocationFilters(["Remote", "On-site"]);
        }
      } catch (err) {
        console.error("Failed to load candidates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const results = allCandidates.filter((c) => {
    const q = query.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.headline.toLowerCase().includes(q);
    const matchSkill = skills.length === 0 || skills.some((s) => c.skills.includes(s));
    const matchLoc = locations.length === 0 || locations.includes(c.location);
    return matchQ && matchSkill && matchLoc;
  });

  if (loading) return <div className="p-8 text-center text-ink-soft">Loading candidates...</div>;

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
