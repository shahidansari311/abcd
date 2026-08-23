import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarClock, MessageSquare } from "lucide-react";
import {
  PageHeader,
  Card,
  GlassCard,
  Badge,
  Avatar,
  ProgressBar,
  Grid,
  GridItem,
} from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

type Status = "On track" | "At risk" | "Kickoff";
const statusTone: Record<Status, "primary" | "warning" | "accent"> = {
  "On track": "primary",
  "At risk": "warning",
  Kickoff: "accent",
};

type Collaboration = {
  id: string;
  company: string;
  project: string;
  status: Status;
  progress: number;
  team: string[];
  deadline: string;
};

const activity = [
  { who: "Sam Okoye", text: "pushed evaluation results for turbine dataset v2", time: "10m ago" },
  { who: "MediCore Labs", text: "requested revised data-sharing terms", time: "1h ago" },
  { who: "Priya Nair", text: "scheduled the NordVind milestone review", time: "3h ago" },
  { who: "Corvus Analytics", text: "shared the pilot scope document", time: "Yesterday" },
  { who: "Jonas Weber", text: "commented on the privacy budget analysis", time: "Yesterday" },
];

export default function CollaborationHub() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/workspaces");
        if (res) {
          const formatted = res.map((ws: any) => ({
            id: ws._id,
            company: ws.opportunity?.industryPartner?.companyName || "Industry Partner",
            project: ws.title || ws.opportunity?.title || "Untitled Project",
            status: "On track", // Mock status
            progress: Math.floor(Math.random() * 100), // Mock progress
            team: ws.members ? ws.members.map((m: any) => `${m.firstName} ${m.lastName}`) : [],
            deadline: "Ongoing"
          }));
          setCollaborations(formatted);
        }
      } catch (err) {
        console.error("Failed to load workspaces", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-ink-soft">Loading collaborations...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Collaboration Hub"
        subtitle="Track active industry partnerships and stay in sync."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborations.map((c) => (
              <GridItem key={c.id}>
                <Card hover className="rounded-2xl p-5 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.company} size={44} />
                      <div>
                        <p className="text-ink font-semibold leading-tight">{c.project}</p>
                        <p className="text-ink-soft text-sm">{c.company}</p>
                      </div>
                    </div>
                    <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-ink-soft">Milestones</span>
                      <span className="text-ink font-medium">{c.progress}%</span>
                    </div>
                    <ProgressBar value={c.progress} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {c.team.map((t) => (
                        <div key={t} className="ring-2 ring-surface rounded-full">
                          <Avatar name={t} size={28} />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-ink-soft text-sm">
                      <CalendarClock className="size-4" /> {c.deadline}
                    </div>
                  </div>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <GlassCard className="rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="size-5 text-primary" />
              <h3 className="text-ink font-semibold">Activity</h3>
            </div>
            <motion.ul
              className="space-y-4"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {activity.map((a, i) => (
                <motion.li key={i} variants={fadeUp} className="flex gap-3">
                  <Avatar name={a.who} size={28} />
                  <div className="text-sm">
                    <p className="text-ink">
                      <span className="font-medium">{a.who}</span> {a.text}
                    </p>
                    <p className="text-ink-soft text-xs">{a.time}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
