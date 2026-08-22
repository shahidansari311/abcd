import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, TrendingUp, Share2 } from "lucide-react";
import { PageHeader, Card, Avatar, Button, Badge, Grid, GridItem } from "../../components/ui";
import { fadeUp } from "../../lib/motion";

const initialPosts = [
  { name: "Aisha Rahman", time: "2h ago", content: "Just verified my Machine Learning credential on SkillBridge! The assessment was tough but fair. Happy to share study tips.", likes: 42, comments: 8 },
  { name: "Leo Martins", time: "5h ago", content: "Anyone else doing the SQL Query Golf challenge? My best is 4 lines — think we can go lower?", likes: 27, comments: 15 },
  { name: "Chen Wei", time: "1d ago", content: "Landed a data internship at Northwind thanks to the mock interview practice here. Thank you mentors!", likes: 96, comments: 21 },
];

const trending = ["#DataScience", "#MockInterviews", "#SQLGolf", "#ResumeTips", "#MLShowdown", "#Internships2026"];

export default function Community() {
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  function post() {
    const text = draft.trim();
    if (!text) return;
    setPosts([{ name: "Maya Chen", time: "just now", content: text, likes: 0, comments: 0 }, ...posts]);
    setDraft("");
  }

  return (
    <div>
      <PageHeader title="Community" subtitle="Connect, share wins, and learn together." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <div className="flex items-start gap-3">
                <Avatar name="Maya Chen" size={40} />
                <div className="flex-1">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Share something with the community..."
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button variant="primary" size="sm" onClick={post}>
                      <Send size={16} /> Post
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <Grid className="space-y-4">
            {posts.map((p, i) => (
              <GridItem key={`${p.name}-${i}`}>
                <Card>
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} size={40} />
                    <div>
                      <p className="text-sm font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-ink-soft">{p.time}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink">{p.content}</p>
                  <div className="mt-3 flex items-center gap-1 border-t border-line pt-3">
                    <Button variant="ghost" size="sm" onClick={() => setLiked((l) => ({ ...l, [i]: !l[i] }))}>
                      <Heart size={16} className={liked[i] ? "fill-error text-error" : ""} />
                      {p.likes + (liked[i] ? 1 : 0)}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle size={16} /> {p.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 size={16} /> Share
                    </Button>
                  </div>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="h-full">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-ink">
              <TrendingUp size={18} className="text-primary" /> Trending topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trending.map((t) => (
                <Badge key={t} tone="tint">{t}</Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
