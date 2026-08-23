import { motion } from "framer-motion";
import { Link } from "react-router";
import { Eye, Pause, XCircle, Plus } from "lucide-react";
import { PageHeader, Card, Badge, Button } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";

import { useState, useEffect } from "react";
import { api } from "../../lib/api";

type Status = "Open" | "Paused" | "Closed";

interface Posting {
  _id: string;
  title: string;
  status: Status;
  applicantsCount: number;
  views: number;
  createdAt: string;
}

const tone: Record<Status, "primary" | "warning" | "error"> = {
  Open: "primary",
  Paused: "warning",
  Closed: "error",
};

export default function ManagePostings() {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    try {
      const res = await api.get("/opportunities");
      setPostings(res || []);
    } catch (error) {
      console.error("Failed to fetch postings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Status) => {
    try {
      await api.patch(`/opportunities/${id}/status`, { status: newStatus });
      setPostings(postings.map(p => p._id === id ? { ...p, status: newStatus } : p));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-ink-soft">Loading postings...</div>;
  }

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
            {postings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-ink-soft">
                  No postings found.
                </td>
              </tr>
            ) : (
              postings.map((p) => (
                <motion.tr key={p._id} variants={fadeUp} className="hover:bg-tint/30">
                  <td className="px-5 py-4 font-semibold text-ink">{p.title}</td>
                  <td className="px-5 py-4">
                    <Badge tone={tone[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{p.applicantsCount}</td>
                  <td className="px-5 py-4 text-ink-soft">{new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-5 py-4 text-ink-soft">{p.views.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/industry/opportunities/${p._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye size={15} />
                        </Button>
                      </Link>
                      {p.status !== "Paused" && (
                        <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(p._id, "Paused")}>
                          <Pause size={15} />
                        </Button>
                      )}
                      {p.status !== "Closed" && (
                        <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(p._id, "Closed")}>
                          <XCircle size={15} />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </Card>

      {/* Stacked cards on mobile */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 md:hidden">
        {postings.map((p) => (
          <motion.div key={p._id} variants={fadeUp}>
            <Card>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <Badge tone={tone[p.status]}>{p.status}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-ink-soft">Applicants</p>
                  <p className="font-semibold text-ink">{p.applicantsCount}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Views</p>
                  <p className="font-semibold text-ink">{p.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Posted</p>
                  <p className="font-semibold text-ink">{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/industry/opportunities/${p._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye size={15} /> View
                  </Button>
                </Link>
                {p.status !== "Paused" && (
                  <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(p._id, "Paused")}>
                    <Pause size={15} /> Pause
                  </Button>
                )}
                {p.status !== "Closed" && (
                  <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(p._id, "Closed")}>
                    <XCircle size={15} /> Close
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
