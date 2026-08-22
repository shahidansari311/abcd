import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkles } from "lucide-react";
import { PageHeader, Card, Button, Avatar, Badge, ProgressBar } from "../../components/ui";
import { fadeUp } from "../../lib/motion";

type Msg = { from: "ai" | "user"; text: string };

const aiFollowups = [
  "Great — can you walk me through a specific example where you applied that?",
  "Interesting. How did you measure the impact of that work?",
  "Thanks. What would you do differently if you faced that challenge again?",
  "Good. How do you stay current with new tools and techniques?",
];

export default function MockInterview() {
  const [messages, setMessages] = useState<Msg[]>([
    { from: "ai", text: "Hi Maya! Let's begin your mock interview. Tell me about a data project you're proud of." },
  ]);
  const [input, setInput] = useState("");
  const [turn, setTurn] = useState(0);

  function send() {
    const text = input.trim();
    if (!text) return;
    const next: Msg[] = [...messages, { from: "user", text }];
    next.push({ from: "ai", text: aiFollowups[turn % aiFollowups.length] });
    setMessages(next);
    setTurn((t) => t + 1);
    setInput("");
  }

  return (
    <div>
      <PageHeader title="Mock interview" subtitle="Practice with an AI interviewer and get instant feedback." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="flex h-[32rem] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.from === "ai" && (
                      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-tint text-primary">
                        <Bot size={16} />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.from === "user" ? "bg-primary text-white" : "bg-tint text-ink"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.from === "user" && <Avatar name="Maya Chen" size={32} />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your answer..."
                className="flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
              />
              <Button variant="primary" size="sm" onClick={send}>
                <Send size={16} /> Send
              </Button>
            </div>
          </Card>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h3 className="font-semibold text-ink">Live feedback</h3>
            </div>
            <div className="mt-4 grid place-items-center">
              <p className="text-4xl font-bold text-primary">78</p>
              <p className="text-sm text-ink-soft">Overall score</p>
            </div>
            <div className="mt-5 space-y-4">
              {[
                { label: "Clarity", value: 82 },
                { label: "Structure (STAR)", value: 70 },
                { label: "Technical depth", value: 75 },
                { label: "Confidence", value: 84 },
              ].map((f) => (
                <div key={f.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-ink">{f.label}</span>
                    <span className="text-ink-soft">{f.value}%</span>
                  </div>
                  <ProgressBar value={f.value} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="primary">Clear communicator</Badge>
              <Badge tone="accent">Add more metrics</Badge>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
