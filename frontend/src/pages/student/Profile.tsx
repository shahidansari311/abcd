import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, User, BookOpen, GraduationCap, Briefcase, Link as LinkIcon, FileText } from "lucide-react";
import { PageHeader, Card, Button } from "../../components/ui";
import { fadeUp } from "../../lib/motion";
import { api } from "../../lib/api";

type StudentProfile = {
  firstName: string;
  lastName: string;
  degree: string;
  graduationYear: number;
  headline: string;
  github: string;
  linkedin: string;
  portfolio: string;
  resumeUrl: string;
  preferredRoles: string;
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: "",
    lastName: "",
    degree: "",
    graduationYear: new Date().getFullYear(),
    headline: "",
    github: "",
    linkedin: "",
    portfolio: "",
    resumeUrl: "",
    preferredRoles: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.get("/student/profile");
        if (data && data.student) {
          setProfile({
            firstName: data.student.firstName || "",
            lastName: data.student.lastName || "",
            degree: data.student.degree || "",
            graduationYear: data.student.graduationYear || new Date().getFullYear(),
            headline: data.student.headline || "",
            github: data.student.github || "",
            linkedin: data.student.linkedin || "",
            portfolio: data.student.portfolio || "",
            resumeUrl: data.student.resumeUrl || "",
            preferredRoles: data.student.preferredRoles ? data.student.preferredRoles.join(", ") : "",
          });
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.degree.trim()) {
      setError("First Name, Last Name, and Degree are required.");
      setSaving(false);
      return;
    }
    const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/;
    const validateUrl = (url: string) => !url.trim() || urlRegex.test(url.trim());
    if (!validateUrl(profile.github) || !validateUrl(profile.linkedin) || !validateUrl(profile.portfolio) || !validateUrl(profile.resumeUrl)) {
      setError("Please enter valid URLs for Github, LinkedIn, Portfolio, and Resume.");
      setSaving(false);
      return;
    }

    const payload = {
      ...profile,
      preferredRoles: profile.preferredRoles ? profile.preferredRoles.split(",").map(s => s.trim()).filter(Boolean) : []
    };

    try {
      await api.put("/student/profile", payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-line bg-surface p-3 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <div>
      <PageHeader title="Personal Profile" subtitle="Manage your account information and preferences." />

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-3xl mt-6">
        <Card className="space-y-8">
          
          {/* Basic Information */}
          <section>
            <div className="flex items-center gap-3 mb-4 border-b border-line pb-4">
              <User className="text-primary" size={24} />
              <h2 className="text-lg font-semibold text-ink">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">First Name *</label>
                <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="Jane" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Last Name *</label>
                <input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Doe" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1 flex items-center gap-2">
                  <BookOpen size={16} className="text-ink-soft"/> Degree / Major *
                </label>
                <input name="degree" value={profile.degree} onChange={handleChange} placeholder="Computer Science" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1 flex items-center gap-2">
                  <GraduationCap size={16} className="text-ink-soft"/> Graduation Year
                </label>
                <input name="graduationYear" type="number" value={profile.graduationYear} onChange={handleChange} placeholder="2025" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section>
            <div className="flex items-center gap-3 mb-4 border-b border-line pb-4">
              <Briefcase className="text-primary" size={24} />
              <h2 className="text-lg font-semibold text-ink">Professional Details</h2>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-ink mb-1">Professional Headline</label>
              <input name="headline" value={profile.headline} onChange={handleChange} placeholder="Aspiring Data Scientist | Python Enthusiast" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Preferred Roles (comma separated)</label>
              <input name="preferredRoles" value={profile.preferredRoles} onChange={handleChange} placeholder="Data Scientist, Data Analyst, Machine Learning Engineer" className={inputClass} />
            </div>
          </section>

          {/* Links & Resume */}
          <section>
            <div className="flex items-center gap-3 mb-4 border-b border-line pb-4">
              <LinkIcon className="text-primary" size={24} />
              <h2 className="text-lg font-semibold text-ink">Links & Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">LinkedIn URL</label>
                <input name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">GitHub URL</label>
                <input name="github" value={profile.github} onChange={handleChange} placeholder="https://github.com/username" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Portfolio URL</label>
                <input name="portfolio" value={profile.portfolio} onChange={handleChange} placeholder="https://myportfolio.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1 flex items-center gap-2">
                  <FileText size={16} className="text-ink-soft"/> Resume URL
                </label>
                <input name="resumeUrl" value={profile.resumeUrl} onChange={handleChange} placeholder="https://drive.google.com/..." className={inputClass} />
              </div>
            </div>
          </section>

          {error && <p className="text-sm text-error font-medium bg-error/10 p-3 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-primary font-medium bg-primary/10 p-3 rounded-lg">Profile updated successfully!</p>}

          <div className="pt-4 border-t border-line flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6">
              {saving ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
