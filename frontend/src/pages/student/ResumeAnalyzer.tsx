import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Lightbulb, Download } from "lucide-react";
import { PageHeader, Card, Button, Badge, ProgressBar } from "../../components/ui";
import { CompatibilityScore, BarList } from "../../components/charts";
import { fadeUp, stagger } from "../../lib/motion";
import { api } from "../../lib/api";
import { Loader } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumeDocument, ResumeData } from "../../components/ResumeTemplate";

type Category = { label: string; value: number };
type Suggestion = { text: string; tone: "primary" | "warning" | "accent" };

export default function ResumeAnalyzer() {
  const [activeTab, setActiveTab] = useState<"analyze" | "generate">("analyze");
  
  // Analyze State
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState("");

  // Generate State
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [summary, setSummary] = useState("");

  const fetchResumeData = async () => {
    setLoadingData(true);
    try {
      const [profileRes, skillsRes] = await Promise.all([
        api.get("/student/profile"),
        api.get("/skill/profile")
      ]);
      const st = profileRes.student;
      const sk = skillsRes;

      const data: ResumeData = {
        firstName: st.firstName,
        lastName: st.lastName,
        email: st.email,
        headline: st.headline,
        github: st.github,
        linkedin: st.linkedin,
        portfolio: st.portfolio,
        experience: st.experience,
        projects: st.projects,
        education: st.education,
        certifications: st.certifications,
        skills: sk?.skills?.filter((s: any) => s.isVerified) || sk?.skills
      };
      setResumeData(data);
      setSummary(st.headline || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (activeTab === "generate" && !resumeData) {
      fetchResumeData();
    }
  }, [activeTab]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.postForm("/student/resume-analyze", formData);
      setScore(res.overallScore || 0);
      setCategories(res.categories || []);
      setSuggestions(res.suggestions || []);
      setAnalyzed(true);
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Resume Tools" 
        subtitle="Analyze your existing resume or generate a new ATS-friendly one from your profile." 
      />

      <div className="mb-6 flex gap-2 border-b border-line pb-px">
        <button
          onClick={() => setActiveTab("analyze")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "analyze" ? "border-b-2 border-primary text-primary" : "text-ink-soft hover:text-ink"
          }`}
        >
          Analyze Resume
        </button>
        <button
          onClick={() => setActiveTab("generate")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "generate" ? "border-b-2 border-primary text-primary" : "text-ink-soft hover:text-ink"
          }`}
        >
          Auto-Generate PDF
        </button>
      </div>

      {activeTab === "analyze" && (
        <>
          {!analyzed ? (
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <Card>
                <div className="grid place-items-center rounded-2xl border-2 border-dashed border-line bg-surface px-6 py-16 text-center">
                  <div className="grid size-16 place-items-center rounded-2xl bg-tint text-primary">
                    <UploadCloud size={30} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">Drop your resume here</h3>
                  <p className="mt-1 text-sm text-ink-soft">PDF or DOCX, up to 5MB</p>
                  {error && <p className="mt-2 text-sm text-error">{error}</p>}
                  <label className="mt-5 relative">
                    <input type="file" accept=".pdf,.txt" className="sr-only" onChange={handleUpload} disabled={loading} />
                    <Button variant="primary" size="sm" className="pointer-events-none">
                      {loading ? <Loader className="animate-spin" size={16} /> : <FileText size={16} />} 
                      {loading ? "Analyzing..." : "Upload & analyze"}
                    </Button>
                  </label>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <Card className="h-full">
                  <h3 className="mb-2 text-center font-semibold text-ink">Overall score</h3>
                  <div className="grid place-items-center">
                    <CompatibilityScore value={score} size={160} label="Resume strength" />
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setAnalyzed(false)}>
                    Upload another
                  </Button>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="show">
                <Card className="h-full">
                  <h3 className="mb-4 font-semibold text-ink">Category breakdown</h3>
                  <div className="space-y-4">
                    {categories.map((c) => (
                      <div key={c.label}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-ink">{c.label}</span>
                          <span className="text-ink-soft">{c.value}%</span>
                        </div>
                        <ProgressBar value={c.value} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5">
                    <h4 className="mb-2 text-sm font-medium text-ink">Skill keyword coverage</h4>
                    <BarList data={categories} />
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={stagger} initial="hidden" animate="show">
                <Card className="h-full">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-ink">
                    <Lightbulb size={18} className="text-accent" /> Suggestions
                  </h3>
                  <ul className="space-y-3">
                    {suggestions.map((s, i) => (
                      <motion.li key={i} variants={fadeUp} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-3">
                        {s.tone === "primary" ? (
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                        ) : (
                          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-accent" />
                        )}
                        <div>
                          <p className="text-sm text-ink">{s.text}</p>
                          <Badge tone={s.tone}>{s.tone === "primary" ? "Looking good" : "Improve"}</Badge>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
          )}
        </>
      )}

      {activeTab === "generate" && (
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="mb-4 font-semibold text-ink">Customize Resume</h3>
            {loadingData ? (
              <div className="flex h-40 items-center justify-center text-ink-soft">
                <Loader className="mr-2 animate-spin" size={20} /> Loading profile...
              </div>
            ) : resumeData ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">Professional Summary</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-line bg-surface p-3 text-sm text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                    placeholder="Write a brief professional summary..."
                  />
                  <p className="mt-1 text-xs text-ink-soft">This will appear at the top of your resume.</p>
                </div>
                
                <div className="rounded-xl bg-tint p-4">
                  <h4 className="mb-2 text-sm font-medium text-ink">Data Included</h4>
                  <ul className="space-y-1 text-sm text-ink-soft">
                    <li>• Contact info (Email, LinkedIn, GitHub, Portfolio)</li>
                    <li>• {resumeData.skills?.length || 0} Technical Skills</li>
                    <li>• {resumeData.experience?.length || 0} Work Experiences</li>
                    <li>• {resumeData.projects?.length || 0} Projects</li>
                    <li>• {resumeData.education?.length || 0} Education Entries</li>
                    <li>• {resumeData.certifications?.length || 0} Certifications</li>
                  </ul>
                  <p className="mt-2 text-xs italic">To edit this data, update your Student Profile.</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-error">Failed to load profile data.</div>
            )}
          </Card>

          <Card className="flex flex-col items-center justify-center bg-surface">
            {resumeData && (
              <div className="text-center">
                <div className="mb-6 grid size-20 mx-auto place-items-center rounded-2xl bg-tint text-primary">
                  <FileText size={40} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ink">Ready to Download</h3>
                <p className="mb-6 max-w-sm text-sm text-ink-soft text-center mx-auto">
                  Your resume is perfectly formatted for ATS parsers using a clean, standard single-column design.
                </p>
                <PDFDownloadLink
                  document={<ResumeDocument data={{ ...resumeData, summary }} />}
                  fileName={`${resumeData.firstName}_${resumeData.lastName}_Resume.pdf`}
                >
                  {({ loading: pdfLoading }) => (
                    <Button variant="primary" disabled={pdfLoading}>
                      {pdfLoading ? (
                        <>
                          <Loader className="mr-2 animate-spin" size={16} /> Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2" size={16} /> Download Resume PDF
                        </>
                      )}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
