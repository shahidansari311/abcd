import { motion } from "framer-motion";
import { Pencil, ExternalLink, Award, Quote, FileText } from "lucide-react";
import {
  PageHeader,
  Card,
  GlassCard,
  Badge,
  Button,
  Avatar,
} from "../../components/ui";
import { fadeUp, stagger } from "../../lib/motion";

const interests = [
  "Machine Learning",
  "Computer Vision",
  "Federated Learning",
  "Edge AI",
  "Robotics",
  "Responsible AI",
];

const metrics = [
  { label: "h-index", value: "48", icon: <Award className="size-4" /> },
  { label: "Citations", value: "18,240", icon: <Quote className="size-4" /> },
  { label: "Papers", value: "132", icon: <FileText className="size-4" /> },
];

const publications = [
  {
    title: "Efficient Federated Vision Transformers for Edge Deployment",
    venue: "NeurIPS 2025",
    citations: 214,
  },
  {
    title: "Self-Supervised Pretraining for Industrial Defect Detection",
    venue: "CVPR 2024",
    citations: 512,
  },
  {
    title: "Privacy-Preserving Multi-Institution Clinical Learning",
    venue: "Nature Machine Intelligence 2024",
    citations: 389,
  },
  {
    title: "Robust Domain Adaptation under Distribution Shift",
    venue: "ICML 2023",
    citations: 641,
  },
];

export default function Profile() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Academic Profile"
        subtitle="How industry partners and students see you."
      />

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <GlassCard className="rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name="Elena Reyes" size={72} />
            <div className="flex-1">
              <h2 className="text-ink font-semibold text-xl">Dr. Elena Reyes</h2>
              <p className="text-ink-soft">Professor of Computer Science</p>
              <p className="text-ink-soft text-sm">
                Dept. of Artificial Intelligence · Delft University of Technology
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Pencil className="size-4" /> Edit profile
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 space-y-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <Card className="rounded-2xl p-6">
            <h3 className="text-ink font-semibold mb-3">Biography</h3>
            <p className="text-ink-soft leading-relaxed">
              Elena leads the Edge Intelligence Lab, focusing on making deep learning
              practical, private, and efficient outside the data center. Her work bridges
              foundational ML research with deployment in manufacturing, healthcare, and
              energy. She has partnered with over 20 companies and supervised 30+ doctoral
              researchers now working across academia and industry.
            </p>
          </Card>

          <Card className="rounded-2xl p-6">
            <h3 className="text-ink font-semibold mb-4">Selected publications</h3>
            <motion.ul
              className="space-y-3"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {publications.map((p) => (
                <motion.li
                  key={p.title}
                  variants={fadeUp}
                  className="flex items-start justify-between gap-4 rounded-xl border border-line p-4"
                >
                  <div>
                    <p className="text-ink font-medium">{p.title}</p>
                    <p className="text-ink-soft text-sm">{p.venue}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge tone="tint">{p.citations} cites</Badge>
                    <ExternalLink className="size-4 text-ink-soft" />
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </Card>
        </motion.div>

        <motion.div className="space-y-6" variants={fadeUp} initial="hidden" animate="show">
          <Card className="rounded-2xl p-6">
            <h3 className="text-ink font-semibold mb-4">Key metrics</h3>
            <div className="flex flex-wrap gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-2 rounded-xl bg-tint px-3 py-2"
                >
                  <span className="text-primary">{m.icon}</span>
                  <div>
                    <div className="text-ink font-semibold leading-none">{m.value}</div>
                    <div className="text-ink-soft text-xs">{m.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl p-6">
            <h3 className="text-ink font-semibold mb-4">Research interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <Badge key={i} tone="primary">
                  {i}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
