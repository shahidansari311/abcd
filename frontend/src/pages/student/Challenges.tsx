import { useState, useEffect } from "react";
import { Trophy, Clock, Users, Award } from "lucide-react";
import { PageHeader, Card, Badge, Button, Avatar, Grid, GridItem } from "../../components/ui";
import { api } from "../../lib/api";

type Challenge = {
  _id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rewardXP: number;
  deadline: string;
  participants: string[];
};

const toneFor: Record<string, "primary" | "accent" | "warning"> = {
  Beginner: "primary",
  Intermediate: "accent",
  Advanced: "warning",
};

const leaderboard = [
  { name: "Aisha Rahman", points: 4820 },
  { name: "Leo Martins", points: 4610 },
  { name: "Chen Wei", points: 4390 },
  { name: "Maya Chen", points: 4120 },
  { name: "Tom Becker", points: 3980 },
];

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const [chalRes, profileRes] = await Promise.all([
          api.get("/challenges"),
          api.get("/student/profile")
        ]);
        setChallenges(chalRes || []);
        setCurrentUser(profileRes);
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  async function joinChallenge(id: string) {
    try {
      const res = await api.post(`/challenges/${id}/join`, {});
      setChallenges(challenges.map(c => c._id === id ? res : c));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <PageHeader title="Challenges" subtitle="Build real skills and climb the leaderboard." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {challenges.map((c) => {
              const hasJoined = currentUser && c.participants?.includes(currentUser._id);
              const daysLeft = Math.max(0, Math.ceil((new Date(c.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              return (
                <GridItem key={c._id}>
                  <Card hover className="flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <div className="grid size-11 place-items-center rounded-2xl bg-tint text-primary">
                        <Trophy size={20} />
                      </div>
                      <Badge tone={toneFor[c.difficulty]}>{c.difficulty}</Badge>
                    </div>
                    <h3 className="mt-4 font-semibold text-ink">{c.title}</h3>
                    <div className="mt-2 space-y-1 text-sm text-ink-soft">
                      <p className="inline-flex items-center gap-1.5"><Award size={14} /> {c.rewardXP.toLocaleString()} XP</p>
                      <p className="inline-flex items-center gap-1.5"><Clock size={14} /> {daysLeft} days left</p>
                      <p className="inline-flex items-center gap-1.5"><Users size={14} /> {c.participants.length} joined</p>
                    </div>
                    <Button 
                      variant={hasJoined ? "outline" : "primary"} 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => !hasJoined && joinChallenge(c._id)}
                      disabled={hasJoined}
                    >
                      {hasJoined ? "Joined" : "Join challenge"}
                    </Button>
                  </Card>
                </GridItem>
              );
            })}
          </Grid>
        </div>

        <Card className="h-full">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-ink">
            <Trophy size={18} className="text-accent" /> Leaderboard
          </h3>
          <ul className="space-y-2">
            {leaderboard.map((p, i) => {
              const me = p.name === "Maya Chen";
              return (
                <li
                  key={p.name}
                  className={`flex items-center gap-3 rounded-2xl p-2.5 ${me ? "bg-tint" : ""}`}
                >
                  <span className="w-5 text-center text-sm font-semibold text-ink-soft">{i + 1}</span>
                  <Avatar name={p.name} size={34} />
                  <span className={`flex-1 text-sm ${me ? "font-semibold text-primary" : "text-ink"}`}>{p.name}</span>
                  <span className="text-sm font-medium text-ink-soft">{p.points.toLocaleString()}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
