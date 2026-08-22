import { motion } from "framer-motion";
import { PageHeader, Card, Badge, Avatar } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";

type Candidate = { name: string; role: string; match: number };
type Column = { title: string; candidates: Candidate[] };

const columns: Column[] = [
  {
    title: "Sourced",
    candidates: [
      { name: "Amara Okafor", role: "ML Research Intern", match: 96 },
      { name: "Kenji Tanaka", role: "ML Engineer", match: 79 },
      { name: "Zoe Bennett", role: "Robotics Fellow", match: 82 },
    ],
  },
  {
    title: "Screening",
    candidates: [
      { name: "Daniel Reyes", role: "Data Engineer", match: 92 },
      { name: "Lukas Meyer", role: "Product Analyst", match: 85 },
    ],
  },
  {
    title: "Interview",
    candidates: [
      { name: "Priya Nair", role: "Frontend Engineer", match: 89 },
    ],
  },
  {
    title: "Offer",
    candidates: [{ name: "Sara Lund", role: "Data Engineer", match: 91 }],
  },
  {
    title: "Hired",
    candidates: [{ name: "Marco Rossi", role: "ML Engineer", match: 88 }],
  },
];

export default function RecruitmentPipeline() {
  return (
    <div>
      <PageHeader title="Recruitment Pipeline" subtitle="Move candidates through your hiring stages" />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {columns.map((col) => (
            <div key={col.title} className="w-72 shrink-0">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="font-semibold text-ink">{col.title}</h2>
                <Badge tone="tint">{col.candidates.length}</Badge>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3 rounded-2xl bg-bg p-3">
                {col.candidates.map((c, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    whileHover={{ y: -3 }}
                    whileDrag={{ rotate: 2, scale: 1.03, cursor: "grabbing" }}
                    className="cursor-grab"
                  >
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-ink">{c.name}</p>
                          <p className="truncate text-xs text-ink-soft">{c.role}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Badge tone="primary">{c.match}% match</Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {col.candidates.length === 0 && (
                  <p className="py-6 text-center text-sm text-ink-soft">No candidates</p>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
