import { useState, useEffect } from "react";
import { Trophy, Search, Loader2, Award, TrendingUp } from "lucide-react";
import { PageHeader, Card, Button } from "../../components/ui";
import { api } from "../../lib/api";
import { fadeUp, stagger } from "../../lib/motion";
import { motion } from "framer-motion";
import { Avatar } from "../../components/ui";

export default function Leaderboards() {
  const [skill, setSkill] = useState("Python");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async (searchSkill: string) => {
    setLoading(true);
    try {
      const data = await api.get(`/skill/leaderboard?skill=${encodeURIComponent(searchSkill)}`);
      setLeaderboard(data || []);
    } catch (e) {
      console.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(skill);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (skill.trim()) {
      fetchLeaderboard(skill);
    }
  };

  return (
    <div>
      <PageHeader
        title="Skill Leaderboards"
        subtitle="Compare your proficiency globally and within your institution."
        action={<Button variant="outline" size="sm"><TrendingUp size={16} /> View My Rank</Button>}
      />

      <div className="mt-6 max-w-4xl space-y-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" size={18} />
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Search a skill (e.g., Python, React, Data Structures)..."
              className="w-full rounded-xl border border-line bg-surface py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <Button type="submit" variant="primary">Search</Button>
        </form>

        <Card>
          <div className="mb-6 flex items-center gap-3 border-b border-line pb-4">
            <Trophy className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-ink">Global Top {leaderboard.length > 0 ? leaderboard.length : ""} - {skill}</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary size-8" /></div>
          ) : leaderboard.length === 0 ? (
            <p className="py-12 text-center text-ink-soft">No students found with the skill '{skill}'.</p>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
              {leaderboard.map((entry, idx) => (
                <motion.div
                  key={entry.student?._id || idx}
                  variants={fadeUp}
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    idx < 3 ? "border-accent/40 bg-accent/5" : "border-line bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex w-8 justify-center font-bold text-ink-soft">
                      #{idx + 1}
                    </div>
                    <Avatar name={entry.student?.firstName || "Unknown"} size={40} />
                    <div>
                      <p className="font-semibold text-ink">
                        {entry.student?.firstName} {entry.student?.lastName}
                        {idx === 0 && <Award className="ml-2 inline text-accent" size={16} />}
                      </p>
                      <p className="text-sm text-ink-soft">{entry.student?.institution || "Student"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-dark">{entry.score}<span className="text-sm font-normal text-ink-soft">/100</span></p>
                    {entry.isVerified && <p className="text-xs font-medium text-accent">Verified</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
