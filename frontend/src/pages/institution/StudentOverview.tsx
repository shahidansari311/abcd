import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { PageHeader, Card, Avatar, Badge, ProgressBar, Button } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";

type Status = "Placed" | "Interviewing" | "Available";

interface Student {
  id: number;
  name: string;
  department: string;
  year: string;
  readiness: number;
  status: Status;
  placement: string;
}

const students: Student[] = [
  { id: 1, name: "Amara Okafor", department: "Computer Science", year: "Final", readiness: 96, status: "Placed", placement: "Northwind Labs" },
  { id: 2, name: "Daniel Reyes", department: "Electronics", year: "Final", readiness: 88, status: "Interviewing", placement: "-" },
  { id: 3, name: "Priya Nair", department: "Computer Science", year: "Third", readiness: 82, status: "Available", placement: "-" },
  { id: 4, name: "Lukas Meyer", department: "Mechanical", year: "Final", readiness: 74, status: "Placed", placement: "Ironclad Motors" },
  { id: 5, name: "Sofia Marchetti", department: "Biotech", year: "Final", readiness: 79, status: "Interviewing", placement: "-" },
  { id: 6, name: "Kwame Asante", department: "Civil", year: "Third", readiness: 61, status: "Available", placement: "-" },
  { id: 7, name: "Mei Lin", department: "Computer Science", year: "Final", readiness: 91, status: "Placed", placement: "Vertex Systems" },
  { id: 8, name: "Ravi Deshmukh", department: "Electronics", year: "Second", readiness: 55, status: "Available", placement: "-" },
];

const filters = ["All", "Placed", "Interviewing", "Available"] as const;

const statusTone: Record<Status, "primary" | "warning" | "tint"> = {
  Placed: "primary",
  Interviewing: "warning",
  Available: "tint",
};

export default function StudentOverview() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  const visible = students.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.department.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = active === "All" || s.status === active;
    return matchesQuery && matchesFilter;
  });

  return (
    <div>
      <PageHeader title="Student Overview" subtitle="Track readiness and placement status across cohorts" />

      <Card className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students or departments"
              className="w-full rounded-2xl border border-line bg-surface py-2.5 pl-10 pr-4 text-ink outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active === f ? "bg-primary text-white" : "bg-tint text-ink-soft hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line text-sm text-ink-soft">
              <th className="pb-3 font-medium">Student</th>
              <th className="pb-3 font-medium">Department</th>
              <th className="pb-3 font-medium">Year</th>
              <th className="pb-3 font-medium">Readiness</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Placement</th>
            </tr>
          </thead>
          <motion.tbody variants={stagger} initial="hidden" animate="show">
            <AnimatePresence>
              {visible.map((s) => (
                <motion.tr
                  key={s.id}
                  variants={fadeUp}
                  layout
                  className="border-b border-line last:border-0"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size={32} />
                      <span className="font-medium text-ink">{s.name}</span>
                    </div>
                  </td>
                  <td className="text-ink-soft">{s.department}</td>
                  <td className="text-ink-soft">{s.year}</td>
                  <td className="w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ProgressBar value={s.readiness} />
                      </div>
                      <span className="text-sm text-ink-soft">{s.readiness}%</span>
                    </div>
                  </td>
                  <td>
                    <Badge tone={statusTone[s.status]}>{s.status}</Badge>
                  </td>
                  <td className="text-ink-soft">{s.placement}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
        {visible.length === 0 && (
          <p className="py-8 text-center text-ink-soft">No students match your filters.</p>
        )}
      </Card>

      {/* Mobile cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 md:hidden">
        <AnimatePresence>
          {visible.map((s) => (
            <motion.div key={s.id} variants={fadeUp} layout>
              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size={32} />
                    <div>
                      <p className="font-medium text-ink">{s.name}</p>
                      <p className="text-sm text-ink-soft">{s.department} - {s.year}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone[s.status]}>{s.status}</Badge>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <ProgressBar value={s.readiness} />
                  <span className="text-sm text-ink-soft">{s.readiness}%</span>
                </div>
                <p className="text-sm text-ink-soft">Placement: {s.placement}</p>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <Card>
            <p className="py-6 text-center text-ink-soft">No students match your filters.</p>
          </Card>
        )}
      </motion.div>

      <div className="mt-6 flex justify-center">
        <Button variant="outline">Export cohort report</Button>
      </div>
    </div>
  );
}
