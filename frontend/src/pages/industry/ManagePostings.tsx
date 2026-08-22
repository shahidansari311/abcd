import { motion } from "framer-motion";
import { Link } from "react-router";
import { Eye, Pause, XCircle, Plus } from "lucide-react";
import { PageHeader, Card, Badge, Button } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";

type Status = "Open" | "Paused" | "Closed";

const postings: { title: string; status: Status; applicants: number; posted: string; views: number }[] = [
  { title: "ML Research Intern", status: "Open", applicants: 42, posted: "Aug 2, 2026", views: 1284 },
  { title: "Data Engineer", status: "Open", applicants: 28, posted: "Jul 24, 2026", views: 967 },
  { title: "Frontend Engineer", status: "Paused", applicants: 19, posted: "Jul 10, 2026", views: 742 },
  { title: "Robotics Research Fellow", status: "Open", applicants: 11, posted: "Jul 5, 2026", views: 503 },
  { title: "Product Analyst", status: "Closed", applicants: 64, posted: "May 18, 2026", views: 2110 },
];

const tone: Record<Status, "primary" | "warning" | "error"> = {
  Open: "primary",
  Paused: "warning",
  Closed: "error",
};

export default function ManagePostings() {
  return (
    <div>
      <PageHeader
        title="Manage Postings"
        subtitle="Track and update your open roles"
        action={
          <Link to="/industry/post">
            <Button>
              <Plus size={16} /> New posting
            </Button>
          </Link>
        }
      />

      {/* Table on md+ */}
      <Card className="hidden overflow-hidden p-0 md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Applicants</th>
              <th className="px-5 py-3 font-semibold">Posted</th>
              <th className="px-5 py-3 font-semibold">Views</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody variants={stagger} initial="hidden" animate="show" className="divide-y divide-line">
            {postings.map((p) => (
              <motion.tr key={p.title} variants={fadeUp} className="hover:bg-tint/30">
                <td className="px-5 py-4 font-semibold text-ink">{p.title}</td>
                <td className="px-5 py-4">
                  <Badge tone={tone[p.status]}>{p.status}</Badge>
                </td>
                <td className="px-5 py-4 text-ink-soft">{p.applicants}</td>
                <td className="px-5 py-4 text-ink-soft">{p.posted}</td>
                <td className="px-5 py-4 text-ink-soft">{p.views.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye size={15} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Pause size={15} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <XCircle size={15} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </Card>

      {/* Stacked cards on mobile */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 md:hidden">
        {postings.map((p) => (
          <motion.div key={p.title} variants={fadeUp}>
            <Card>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <Badge tone={tone[p.status]}>{p.status}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-ink-soft">Applicants</p>
                  <p className="font-semibold text-ink">{p.applicants}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Views</p>
                  <p className="font-semibold text-ink">{p.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Posted</p>
                  <p className="font-semibold text-ink">{p.posted}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye size={15} /> View
                </Button>
                <Button variant="ghost" size="sm">
                  <Pause size={15} /> Pause
                </Button>
                <Button variant="ghost" size="sm">
                  <XCircle size={15} /> Close
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
