import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Users, Calendar, MapPin, Building2, Save, X } from "lucide-react";
import { PageHeader, Card, GlassCard, Grid, GridItem, Badge, Avatar, Button } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

const team = [
  { name: "Sofia Alvarez", role: "Head of Talent" },
  { name: "Marcus Chen", role: "Engineering Manager" },
  { name: "Nina Patel", role: "University Relations" },
  { name: "Omar Haddad", role: "Recruiter" },
];

export default function OrganizationProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get("/industry/profile");
        if (res?.industry) {
          setProfile(res.industry);
          setFormData({
            companyName: res.industry.companyName || "",
            industryType: res.industry.industryType || "",
            description: res.industry.description || "",
            companySize: res.industry.companySize || "",
            founded: res.industry.founded || "",
            headquarters: res.industry.headquarters || "",
            benefits: res.industry.benefits ? res.industry.benefits.join(", ") : "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        benefits: formData.benefits.split(",").map((b: string) => b.trim()).filter(Boolean),
      };
      const res = await api.put("/industry/profile", payload);
      if (res?.industry) {
        setProfile(res.industry);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="size-10 animate-spin rounded-full border-4 border-line border-t-primary" />
      </div>
    );
  }

  if (!profile) {
    return <div className="p-20 text-center">Failed to load profile.</div>;
  }

  const inputClass = "w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div>
      <PageHeader
        title="Organization Profile"
        subtitle="How candidates see your company"
        action={
          isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setFormData(profile); }}>
                <X size={16} /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save size={16} /> Save Changes
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil size={16} /> Edit profile
            </Button>
          )
        }
      />

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <GlassCard className="flex flex-wrap items-center gap-5">
          <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-primary text-3xl font-bold text-white uppercase">
            {formData.companyName ? formData.companyName.charAt(0) : "C"}
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            {isEditing ? (
              <input
                className={`${inputClass} text-lg font-bold`}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Company Name"
              />
            ) : (
              <h2 className="text-2xl font-bold text-ink">{profile.companyName}</h2>
            )}
            
            {isEditing ? (
              <input
                className={inputClass}
                value={formData.industryType}
                onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
                placeholder="e.g. Applied AI & Robotics"
              />
            ) : (
              <p className="flex items-center gap-1.5 text-ink-soft">
                <Building2 size={16} /> {profile.industryType || "Industry not specified"}
              </p>
            )}

            {!isEditing && (
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="primary">Verified employer</Badge>
                <Badge tone="accent">Actively hiring</Badge>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="mb-3 text-lg font-semibold text-ink">About</h3>
            {isEditing ? (
              <textarea
                className={`${inputClass} min-h-[120px]`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell candidates about your company's mission and work..."
              />
            ) : (
              <div className="rounded-xl border border-line bg-bg p-4 text-sm leading-relaxed text-ink-soft">
                {profile.description || "No description provided."}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink">Key facts</h3>
            <Grid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { key: "companySize", icon: <Users size={18} />, label: "Company size" },
                { key: "founded", icon: <Calendar size={18} />, label: "Founded" },
                { key: "headquarters", icon: <MapPin size={18} />, label: "Headquarters" },
              ].map((f) => (
                <GridItem key={f.label}>
                  <div className="rounded-xl border border-line bg-bg p-4">
                    <span className="grid size-9 place-items-center rounded-lg bg-tint text-primary">{f.icon}</span>
                    <p className="mt-3 text-xs text-ink-soft">{f.label}</p>
                    {isEditing ? (
                      <input
                        className={`${inputClass} mt-1`}
                        value={formData[f.key]}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                        placeholder={f.label}
                      />
                    ) : (
                      <p className="font-semibold text-ink">{profile[f.key] || "-"}</p>
                    )}
                  </div>
                </GridItem>
              ))}
            </Grid>
          </Card>

          <Card>
            <h3 className="mb-3 text-lg font-semibold text-ink">Benefits & culture</h3>
            {isEditing ? (
              <input
                className={inputClass}
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="Comma separated values (e.g. Remote-first, Equity, Flexible PTO)"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.benefits && profile.benefits.length > 0 ? (
                  profile.benefits.map((b: string) => (
                    <Badge key={b} tone="tint">
                      {b}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-ink-soft">No benefits listed.</p>
                )}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink">Team</h3>
            <div className="space-y-4">
              {team.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <Avatar name={m.name} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{m.name}</p>
                    <p className="truncate text-sm text-ink-soft">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-line pt-4 text-center">
              <p className="text-xs text-ink-soft">Team management features coming soon.</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
