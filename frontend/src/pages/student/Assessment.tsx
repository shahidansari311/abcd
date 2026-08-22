import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, ChevronLeft, ChevronRight, Code2, Play } from "lucide-react";
import { PageHeader, Card, Badge, ProgressBar, Button, Grid, GridItem } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type Assessment = {
  _id: string;
  title: string;
  description: string;
  type: string;
  durationMinutes: number;
  isActive: boolean;
};

type Question = {
  _id: string;
  text: string;
  options: string[];
  points: number;
};

type FullAssessment = Assessment & {
  questions: Question[];
};

export default function AssessmentPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Active Assessment State
  const [activeAssessment, setActiveAssessment] = useState<FullAssessment | null>(null);
  const [loadingActive, setLoadingActive] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> providedAnswer
  
  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; maxScore: number; percentage: number } | null>(null);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await api.get("/assessment");
        if (res && Array.isArray(res)) {
          setAssessments(res);
        }
      } catch (err) {
        console.error("Failed to load assessments", err);
      } finally {
        setLoadingList(false);
      }
    }
    fetchAssessments();
  }, []);

  const loadAssessment = async (id: string) => {
    setLoadingActive(true);
    setResult(null);
    setCurrentQIndex(0);
    setAnswers({});
    try {
      const data = await api.get(`/assessment/${id}`);
      setActiveAssessment(data);
      // Smooth scroll down to the active assessment area (optional but helpful)
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      console.error("Failed to load assessment details", err);
    } finally {
      setLoadingActive(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const submitAssessment = async () => {
    if (!activeAssessment) return;
    setSubmitting(true);
    try {
      // Map dictionary to array format expected by backend
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: qId,
        providedAnswer: ans
      }));

      const res = await api.post(`/assessment/${activeAssessment._id}/submit`, { answers: formattedAnswers });
      setResult(res);
      setActiveAssessment(null);
    } catch (err) {
      console.error("Failed to submit assessment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = activeAssessment?.questions?.[currentQIndex];

  return (
    <div>
      <PageHeader
        title="Skill assessments"
        subtitle="Measure your abilities and unlock verified credentials."
      />

      {loadingList ? (
        <div className="flex justify-center p-10"><Loader className="animate-spin text-primary" /></div>
      ) : assessments.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-ink-soft">No active assessments available at the moment.</p>
        </Card>
      ) : (
        <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessments.map((a) => (
            <GridItem key={a._id}>
              <Card hover className="h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-tint text-primary shrink-0">
                    <Code2 size={20} />
                  </div>
                  <Badge tone="primary">{a.type}</Badge>
                </div>
                <h3 className="mt-4 font-semibold text-ink line-clamp-1">{a.title}</h3>
                <p className="mt-2 text-sm text-ink-soft line-clamp-2 flex-grow">{a.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
                  <span>{a.durationMinutes} mins</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full gap-2"
                  onClick={() => loadAssessment(a._id)}
                  disabled={loadingActive || activeAssessment?._id === a._id}
                >
                  <Play size={14}/> Start Assessment
                </Button>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}

      {result && (
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-6">
          <Card className="border-primary/20 bg-primary/5 text-center py-8">
            <h3 className="text-2xl font-bold text-ink mb-2">Assessment Complete!</h3>
            <p className="text-ink-soft mb-6">You scored {result.score} out of {result.maxScore}.</p>
            <div className="inline-block relative">
              <div className="text-4xl font-black text-primary">{Math.round(result.percentage)}%</div>
            </div>
          </Card>
        </motion.div>
      )}

      {loadingActive && (
        <div className="flex justify-center mt-10"><Loader className="animate-spin text-primary" /></div>
      )}

      <AnimatePresence mode="wait">
        {activeAssessment && currentQ && (
          <motion.div 
            key={activeAssessment._id}
            variants={fadeUp} 
            initial="hidden" 
            animate="show" 
            exit="hidden"
            className="mt-6"
          >
            <Card>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Badge tone="accent">Active assessment</Badge>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{activeAssessment.title}</h3>
                </div>
                <p className="text-sm font-medium text-ink-soft">
                  Question {currentQIndex + 1} of {activeAssessment.questions.length}
                </p>
              </div>

              <ProgressBar 
                value={((currentQIndex + 1) / activeAssessment.questions.length) * 100} 
                className="mb-6" 
              />

              <p className="text-lg font-medium text-ink">{currentQ.text}</p>

              <div className="mt-4 space-y-3">
                {currentQ.options.map((opt, i) => {
                  const isActive = answers[currentQ._id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(currentQ._id, opt)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                        isActive ? "border-primary bg-tint" : "border-line bg-surface hover:bg-tint"
                      }`}
                    >
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-full border text-sm font-semibold ${
                          isActive ? "border-primary bg-primary text-white" : "border-line text-ink-soft"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-ink">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentQIndex(i => i - 1)} 
                  disabled={currentQIndex === 0}
                >
                  <ChevronLeft size={16} /> Prev
                </Button>
                
                {currentQIndex === activeAssessment.questions.length - 1 ? (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={submitAssessment} 
                    disabled={submitting || Object.keys(answers).length < activeAssessment.questions.length}
                  >
                    {submitting ? <Loader className="animate-spin" size={16}/> : "Submit Assessment"}
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setCurrentQIndex(i => i + 1)}
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
