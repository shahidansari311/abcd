import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2, Globe, BookOpen, GraduationCap, ShieldCheck, ShieldAlert,
  Edit3, Save, X, Plus, Tag
} from "lucide-react";
import { PageHeader, Card, Badge, Button } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type InstitutionType = "university" | "college" | "training_institute";

interface InstitutionProfile {
  institutionName: string;
  type: InstitutionType | "";
  website: string;
  accreditationBody: string;
  departments: string[];
  isVerified: boolean;
  email: string;
}

const typeLabel: Record<InstitutionType, string> = {
  university: "University",
  college: "College",
  training_institute: "Training Institute",
};

const typeOptions: { value: InstitutionType; label: string }[] = [
  { value: "university", label: "University" },
  { value: "college", label: "College" },
  { value: "training_institute", label: "Training Institute" },
];

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/60 focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function InstitutionProfile() {
  const [profile, setProfile] = useState<InstitutionProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<InstitutionProfile | null>(null);
  const [newDept, setNewDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/institution/profile");
        const data = res?.institution || res;
        setProfile(data);
        setForm(data);
      } catch (err: any) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const res = await api.put("/institution/profile", {
        institutionName: form.institutionName,
        type: form.type,
        website: form.website,
        accreditationBody: form.accreditationBody,
        departments: form.departments,
      });
      const updated = res?.institution || res;
      setProfile(updated);
      setForm(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
    setError("");
  };

  const addDept = () => {
    const d = newDept.trim();
    if (!d || form?.departments.includes(d)) return;
    setForm(f => f ? { ...f, departments: [...f.departments, d] } : f);
    setNewDept("");
  };

  const removeDept = (dept: string) => {
    setForm(f => f ? { ...f, departments: f.departments.filter(d => d !== dept) } : f);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="size-10 animate-spin rounded-full border-4 border-line border-t-primary" />
      </div>
    );
  }

  const data = editing ? form! : profile!;

  return (
    <div>
      <PageHeader
        title="Institution Profile"
        subtitle="Manage your institution's information and departments"
        action={
          editing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={16} /> Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setEditing(true)}>
              <Edit3 size={16} /> Edit Profile
            </Button>
          )
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — Identity */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2 space-y-6">
          <Card>
            <div className="mb-5 flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Building2 size={32} />
              </div>
              <div className="flex-1">
                {editing ? (
                  <input
                    className={field}
                    value={data?.institutionName || ""}
                    onChange={e => setForm(f => f ? { ...f, institutionName: e.target.value } : f)}
                    placeholder="Institution Name"
                  />
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-ink">{data?.institutionName || "—"}</h2>
                    <p className="text-sm text-ink-soft">{data?.email}</p>
                  </>
                )}
              </div>
              <Badge tone={data?.isVerified ? "primary" : "warning"}>
                {data?.isVerified ? (
                  <><ShieldCheck size={13} className="mr-1" />Verified</>
                ) : (
                  <><ShieldAlert size={13} className="mr-1" />Pending</>
                )}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Type */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  <GraduationCap size={13} /> Institution Type
                </label>
                {editing ? (
                  <select
                    className={field}
                    value={data?.type || ""}
                    onChange={e => setForm(f => f ? { ...f, type: e.target.value as InstitutionType } : f)}
                  >
                    <option value="">Select type</option>
                    {typeOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-ink">{data?.type ? typeLabel[data.type as InstitutionType] : "—"}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  <Globe size={13} /> Website
                </label>
                {editing ? (
                  <input
                    className={field}
                    value={data?.website || ""}
                    onChange={e => setForm(f => f ? { ...f, website: e.target.value } : f)}
                    placeholder="https://youruni.edu"
                  />
                ) : (
                  <a
                    href={data?.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {data?.website || "—"}
                  </a>
                )}
              </div>

              {/* Accreditation */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  <BookOpen size={13} /> Accreditation Body
                </label>
                {editing ? (
                  <input
                    className={field}
                    value={data?.accreditationBody || ""}
                    onChange={e => setForm(f => f ? { ...f, accreditationBody: e.target.value } : f)}
                    placeholder="e.g. NAAC, UGC, AICTE"
                  />
                ) : (
                  <p className="text-sm text-ink">{data?.accreditationBody || "—"}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Departments */}
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Tag size={18} className="text-primary" />
              <h3 className="text-base font-semibold text-ink">Departments</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {(data?.departments || []).map(dept => (
                <span
                  key={dept}
                  className="flex items-center gap-1.5 rounded-full bg-tint px-3 py-1 text-sm font-medium text-primary-dark"
                >
                  {dept}
                  {editing && (
                    <button
                      onClick={() => removeDept(dept)}
                      className="text-ink-soft hover:text-error transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
              {(!data?.departments || data.departments.length === 0) && !editing && (
                <p className="text-sm text-ink-soft">No departments added yet.</p>
              )}
            </div>

            {editing && (
              <div className="mt-4 flex gap-2">
                <input
                  className={`${field} flex-1`}
                  value={newDept}
                  onChange={e => setNewDept(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addDept()}
                  placeholder="Add a department (press Enter)"
                />
                <Button variant="secondary" size="sm" onClick={addDept}>
                  <Plus size={16} /> Add
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Right — Status card */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-ink">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Verification</span>
                <Badge tone={profile?.isVerified ? "primary" : "warning"}>
                  {profile?.isVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Role</span>
                <Badge tone="tint">Institution</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Departments</span>
                <span className="text-sm font-semibold text-ink">
                  {profile?.departments?.length || 0}
                </span>
              </div>
            </div>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-ink">Get Verified</p>
                <p className="mt-1 text-xs text-ink-soft">
                  Verification unlocks full access to industry partners and placement tracking features.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
