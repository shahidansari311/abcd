import { motion } from "framer-motion";
import { Rocket, Clock, Wrench } from "lucide-react";
import { PageHeader, Card } from "../../components/ui";
import { fadeUp } from "../../lib/motion";

export default function ChallengeEvaluation() {
  return (
    <div>
      <PageHeader
        title="Challenge Evaluation"
        subtitle="Review and score candidate submissions"
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex justify-center py-10"
      >
        <Card className="max-w-lg w-full text-center">
          <div className="mx-auto mb-6 grid size-20 place-items-center rounded-2xl bg-primary/10">
            <Rocket size={40} className="text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-ink">Coming Soon</h2>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Challenge evaluation with automated scoring, rubric-based manual review,
            and submission management is currently in development.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 text-left">
            <div className="rounded-xl border border-line bg-surface p-4 flex items-start gap-3">
              <div className="mt-0.5 grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Auto-Scoring</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  AI-powered evaluation of submissions based on correctness and performance.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4 flex items-start gap-3">
              <div className="mt-0.5 grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
                <Wrench size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Rubric Review</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Manual scoring with customisable rubrics for code quality, docs and more.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-ink-soft">
            We'll notify you when this feature goes live.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
