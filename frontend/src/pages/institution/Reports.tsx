import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, RefreshCw, TrendingUp, Layers, Users, Handshake } from "lucide-react";
import { PageHeader, Card, Grid, GridItem, Badge, Button } from "../../components/ui";
import { BarList } from "../../components/charts";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";

const templates = [
  {
    key: "placement",
    icon: <TrendingUp size={20} />,
    title: "Placement Report",
    description: "Offers, packages, and placement rate across departments and years.",
    lastGenerated: "Aug 12, 2026",
  },
  {
    key: "skillgap",
    icon: <Layers size={20} />,
    title: "Skill Gap Report",
    description: "Competency gaps mapped against current industry demand signals.",
    lastGenerated: "Aug 05, 2026",
  },
  {
    key: "department",
    icon: <Users size={20} />,
    title: "Department Performance",
    description: "Readiness, participation, and outcomes broken down by department.",
    lastGenerated: "Jul 28, 2026",
  },
  {
    key: "partner",
    icon: <Handshake size={20} />,
    title: "Partner Engagement",
    description: "Hiring activity, MOU status, and collaboration health per partner.",
    lastGenerated: "Jul 19, 2026",
  },
];



const departments = ["All departments", "Computer Science", "Electronics", "Mechanical", "Civil", "Biotech"];

export default function Reports() {
  const [dept, setDept] = useState(departments[0]);
  const [from, setFrom] = useState("2026-01");
  const [to, setTo] = useState("2026-08");
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/institution/stats");
        if (res?.readinessByDept) {
          setPreviewData(res.readinessByDept);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const selectClass =
    "w-full rounded-2xl border border-line bg-surface px-4 py-2.5 text-ink outline-none focus:border-primary";

  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate and download institutional insights" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <Grid className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {templates.map((t) => (
                <GridItem key={t.key}>
                  <motion.div variants={fadeUp}>
                    <Card hover className="flex h-full flex-col">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-tint text-primary">
                          {t.icon}
                        </span>
                        <h3 className="font-semibold text-ink">{t.title}</h3>
                      </div>
                      <p className="mb-4 flex-1 text-sm text-ink-soft">{t.description}</p>
                      <p className="mb-4 text-xs text-ink-soft">Last generated: {t.lastGenerated}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <RefreshCw size={16} /> Generate
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download size={16} /> Download
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </GridItem>
              ))}
            </Grid>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-ink">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-ink-soft">From</label>
                  <input type="month" value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-ink-soft">To</label>
                  <input type="month" value={to} onChange={(e) => setTo(e.target.value)} className={selectClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-ink-soft">Department</label>
                  <select value={dept} onChange={(e) => setDept(e.target.value)} className={selectClass}>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <h2 className="text-lg font-semibold text-ink">Preview</h2>
                </div>
                <Badge tone="accent">{dept === "All departments" ? "All" : dept}</Badge>
              </div>
              <p className="mb-4 text-sm text-ink-soft">Placement readiness by department</p>
              <BarList data={previewData} />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
