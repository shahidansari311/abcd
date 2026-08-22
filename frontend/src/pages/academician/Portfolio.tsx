import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText, FolderGit2, ShieldCheck } from "lucide-react";
import {
  PageHeader,
  Card,
  Badge,
  Grid,
  GridItem,
} from "../../components/ui";
import { fadeUp, stagger, EASE } from "../../lib/motion";

const tabs = ["Publications", "Projects", "Patents"] as const;
type Tab = (typeof tabs)[number];

const data: Record<Tab, { title: string; meta: string; tags: string[] }[]> = {
  Publications: [
    {
      title: "Efficient Federated Vision Transformers for Edge Deployment",
      meta: "NeurIPS 2025 · 214 citations",
      tags: ["Federated Learning", "Edge AI"],
    },
    {
      title: "Self-Supervised Pretraining for Industrial Defect Detection",
      meta: "CVPR 2024 · 512 citations",
      tags: ["Computer Vision", "SSL"],
    },
    {
      title: "Robust Domain Adaptation under Distribution Shift",
      meta: "ICML 2023 · 641 citations",
      tags: ["Domain Adaptation"],
    },
  ],
  Projects: [
    {
      title: "NordVind Predictive Maintenance",
      meta: "Industry pilot · 2025–present",
      tags: ["Energy", "IoT"],
    },
    {
      title: "Edge Intelligence Lab Toolkit",
      meta: "Open source · 4.2k stars",
      tags: ["Open Source", "MLOps"],
    },
    {
      title: "Federated Clinical Learning Consortium",
      meta: "Multi-institution · 2024–present",
      tags: ["Healthcare", "Privacy"],
    },
  ],
  Patents: [
    {
      title: "Method for Privacy-Preserving Model Aggregation",
      meta: "US Patent 11,984,221 · Granted 2024",
      tags: ["Privacy", "Distributed ML"],
    },
    {
      title: "Adaptive Quantization for On-Device Inference",
      meta: "EP Patent 3,921,004 · Pending",
      tags: ["Edge AI", "Compression"],
    },
  ],
};

const tabIcon: Record<Tab, React.ReactNode> = {
  Publications: <FileText className="size-4" />,
  Projects: <FolderGit2 className="size-4" />,
  Patents: <ShieldCheck className="size-4" />,
};

export default function Portfolio() {
  const [active, setActive] = useState<Tab>("Publications");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Research Portfolio"
        subtitle="A curated record of your scholarly and applied work."
      />

      <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-surface border border-line p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              active === t ? "text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {active === t && (
              <motion.span
                layoutId="portfolio-pill"
                className="absolute inset-0 rounded-xl bg-primary"
                transition={{ duration: 0.3, ease: EASE }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              {tabIcon[t]}
              {t}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={stagger}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 8 }}
        >
          <Grid className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data[active].map((item) => (
              <GridItem key={item.title}>
                <motion.div variants={fadeUp}>
                  <Card hover className="rounded-2xl p-5 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-ink font-semibold">{item.title}</h3>
                      <ExternalLink className="size-4 text-ink-soft shrink-0" />
                    </div>
                    <p className="text-ink-soft text-sm mb-3">{item.meta}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {item.tags.map((tag) => (
                        <Badge key={tag} tone="tint">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </GridItem>
            ))}
          </Grid>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
