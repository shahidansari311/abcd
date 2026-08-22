import { motion } from "framer-motion";
import { Bell, ShieldCheck, Briefcase, MessageSquare, Trophy, Check } from "lucide-react";
import { PageHeader, Card, Button, Badge } from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";

const items = [
  { icon: ShieldCheck, title: "Credential verified", desc: "Your SQL Fundamentals credential was verified by Northwind.", time: "2m ago", unread: true },
  { icon: Briefcase, title: "New opportunity match", desc: "Junior Data Analyst at Delta Corp — 92% compatibility.", time: "1h ago", unread: true },
  { icon: MessageSquare, title: "Mentor replied", desc: "Dr. Ortiz answered your question about the research track.", time: "3h ago", unread: true },
  { icon: Trophy, title: "Challenge complete", desc: "You placed 4th in the Analytics Sprint challenge.", time: "Yesterday", unread: false },
  { icon: Bell, title: "Assessment reminder", desc: "Your System Design assessment is due in 2 days.", time: "2 days ago", unread: false },
];

export default function Notifications() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Everything happening across your SkillBridge account."
        action={<Button variant="outline" size="sm"><Check size={16} /> Mark all read</Button>}
      />
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
        {items.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div key={i} variants={fadeUp}>
              <Card hover className={`flex items-start gap-4 ${n.unread ? "border-l-4 border-l-primary" : ""}`}>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-tint text-primary"><Icon size={20} /></span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink">{n.title}</p>
                    {n.unread && <Badge tone="primary">New</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">{n.desc}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-soft">{n.time}</span>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
