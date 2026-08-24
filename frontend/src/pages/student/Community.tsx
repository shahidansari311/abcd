import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, TrendingUp, Share2, Edit2, Trash2, X, Check } from "lucide-react";
import { PageHeader, Card, Avatar, Button, Badge, Grid, GridItem } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type Post = {
  _id: string;
  author: { _id: string; firstName: string; lastName: string };
  content: string;
  likesCount: number;
  commentsCount: number;
  likedBy: string[];
  createdAt: string;
};

const trending = ["#DataScience", "#MockInterviews", "#SQLGolf", "#ResumeTips", "#MLShowdown", "#Internships2026"];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const [postsRes, profileRes] = await Promise.all([
          api.get("/community/posts"),
          api.get("/student/profile")
        ]);
        setPosts(postsRes || []);
        setCurrentUser(profileRes?.student || profileRes); // handles nested student or flat response
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  async function post() {
    const text = draft.trim();
    if (!text) return;
    try {
      const res = await api.post("/community/posts", { content: text });
      setPosts([res, ...posts]);
      setDraft("");
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleLike(postId: string) {
    try {
      const res = await api.post(`/community/posts/${postId}/like`, {});
      setPosts(posts.map(p => p._id === postId ? res : p));
    } catch (err) {
      console.error(err);
    }
  }

  async function deletePost(postId: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/community/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error(err);
    }
  }

  async function saveEdit(postId: string) {
    const text = editContent.trim();
    if (!text) return;
    try {
      const res = await api.put(`/community/posts/${postId}`, { content: text });
      setPosts(posts.map(p => p._id === postId ? res : p));
      setEditingPostId(null);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <PageHeader title="Community" subtitle="Connect, share wins, and learn together." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Card>
              <div className="flex items-start gap-3">
                <Avatar name={currentUser?.firstName || "Me"} size={40} />
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
            {posts.map((p) => {
              const currentUserId = currentUser?._id || currentUser?.id;
              const hasLiked = currentUserId && p.likedBy?.includes(currentUserId);
              const isOwner = currentUserId && p.author?._id === currentUserId;
              const authorName = p.author ? `${p.author.firstName} ${p.author.lastName}` : "Unknown";
              const time = new Date(p.createdAt).toLocaleDateString();

              return (
                <GridItem key={p._id}>
                  <Card>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar name={authorName} size={40} />
                        <div>
                          <p className="text-sm font-semibold text-ink">{authorName}</p>
                          <p className="text-xs text-ink-soft">{time}</p>
                        </div>
                      </div>
                      
                      {isOwner && (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => {
                              setEditingPostId(p._id);
                              setEditContent(p.content);
                            }}
                            className="p-1.5 text-ink-soft hover:text-primary transition-colors rounded-lg hover:bg-tint"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deletePost(p._id)}
                            className="p-1.5 text-ink-soft hover:text-error transition-colors rounded-lg hover:bg-error/10"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editingPostId === p._id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full resize-none rounded-xl border border-primary bg-surface px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingPostId(null)}>
                            <X size={16} /> Cancel
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => saveEdit(p._id)}>
                            <Check size={16} /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-relaxed text-ink whitespace-pre-wrap">{p.content}</p>
                    )}
                    
                    <div className="mt-4 flex items-center gap-1 border-t border-line pt-3">
                      <Button variant="ghost" size="sm" onClick={() => toggleLike(p._id)}>
                        <Heart size={16} className={hasLiked ? "fill-error text-error" : ""} />
                        {p.likesCount}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle size={16} /> {p.commentsCount}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 size={16} /> Share
                      </Button>
                    </div>
                  </Card>
                </GridItem>
              );
            })}
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
