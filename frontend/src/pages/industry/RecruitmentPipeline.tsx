import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { PageHeader, Card, Badge, Avatar } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

type Candidate = { 
  id: string; 
  name: string; 
  role: string; 
  match: number; 
  status: string;
};
type Column = { title: string; candidates: Candidate[] };

const columnTitles = ["Applied", "Screening", "Interview", "Offer", "Hired"];

export default function RecruitmentPipeline() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const res = await api.get("/industry/pipeline");
        if (res) {
          const mapped = res.map((app: any) => ({
            id: app._id,
            name: `${app.student?.firstName || 'Unknown'} ${app.student?.lastName || 'Student'}`,
            role: app.role || "Applicant",
            match: Math.floor(Math.random() * 20) + 80, // Mock score
            status: app.status
          }));
          setCandidates(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch pipeline", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPipeline();
  }, []);

  const handleDragEnd = async (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, candidate: Candidate, currentColIndex: number) => {
    const xOffset = info.offset.x;
    const threshold = 150; // pixels to move left or right to change column

    let newStatus = candidate.status;
    
    if (xOffset > threshold && currentColIndex < columnTitles.length - 1) {
      // Move right
      newStatus = columnTitles[currentColIndex + 1];
    } else if (xOffset < -threshold && currentColIndex > 0) {
      // Move left
      newStatus = columnTitles[currentColIndex - 1];
    }

    if (newStatus !== candidate.status) {
      // Optimistic update
      setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: newStatus } : c));
      
      try {
        await api.put(`/industry/pipeline/${candidate.id}/status`, { status: newStatus });
      } catch (err) {
        console.error("Failed to update status", err);
        // Revert on error
        setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: candidate.status } : c));
      }
    }
  };

  const columns: Column[] = columnTitles.map(title => ({
    title,
    candidates: candidates.filter(c => (c.status === title) || (title === 'Applied' && c.status === 'Sourced')) // map legacy "Sourced" to "Applied"
  }));

  if (loading) return <div className="p-8 text-center text-ink-soft">Loading pipeline...</div>;

  return (
    <div>
      <PageHeader title="Recruitment Pipeline" subtitle="Move candidates through your hiring stages" />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {columns.map((col, colIndex) => (
            <div key={col.title} className="w-72 shrink-0">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="font-semibold text-ink">{col.title}</h2>
                <Badge tone="tint">{col.candidates.length}</Badge>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3 rounded-2xl bg-bg p-3 min-h-[150px]">
                {col.candidates.map((c) => (
                  <motion.div
                    key={c.id}
                    variants={fadeUp}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, info) => handleDragEnd(e, info, c, colIndex)}
                    whileHover={{ y: -3 }}
                    whileDrag={{ rotate: 2, scale: 1.05, cursor: "grabbing", zIndex: 50 }}
                    className="cursor-grab relative"
                  >
                    <Card className="p-4 shadow-sm">
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
