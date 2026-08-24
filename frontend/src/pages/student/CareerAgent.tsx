import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Loader2, Target, Route } from "lucide-react";
import { PageHeader, Card, Button } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
};

export default function CareerAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "agent",
      content: "Hi! I'm your AI Career Agent. I've reviewed your skill profile and academic records. How can I help you improve your placement readiness today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Format history for Groq (only user/assistant roles)
      const history = messages
        .filter((m) => m.id !== "init")
        .map((m) => ({
          role: m.role === "agent" ? "assistant" : "user",
          content: m.content,
        }));

      const res = await api.post("/student/career-agent/chat", {
        message: userMsg.content,
        history,
      });

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: res.reply,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "agent", content: "Sorry, I encountered an error connecting to my AI backend. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      <PageHeader
        title="AI Career Agent"
        subtitle="Your personalized, data-driven career mentor."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Target size={16} /> Update Goal</Button>
            <Button variant="primary" size="sm"><Route size={16} /> Generate Roadmap</Button>
          </div>
        }
      />

      <Card className="mt-4 flex flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`grid size-9 shrink-0 place-items-center rounded-full ${m.role === "agent" ? "bg-primary text-white" : "bg-tint text-primary-dark"}`}>
                  {m.role === "agent" ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${m.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-surface border border-line text-ink rounded-tl-sm markdown-body"}`}>
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Bot size={20} />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-line bg-surface p-4 text-sm text-ink-soft">
                  <Loader2 size={16} className="animate-spin" /> Thinking...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-line bg-white p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me how to improve your placement readiness..."
              className="flex-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
              disabled={loading}
            />
            <Button type="submit" variant="primary" disabled={!input.trim() || loading} className="shrink-0 px-6">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
